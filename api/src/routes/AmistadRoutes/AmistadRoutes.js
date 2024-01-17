const { Router } = require("express");
// const {
//   sendFriendRequest,
// } = require("../../controllers/AmistadController/AmistadController");
const {
  responseToAmistad,
} = require("../../controllers/AmistadController/putController");
const {
  removeAmigo,
} = require("../../controllers/AmistadController/deleteControler");
const {
  getPendingFriendRequests,
  buscarAmigo,
  getAmigos,
} = require("../../controllers/AmistadController/getAmistadController");
const { verifyToken } = require("../../middleware/authMiddleware");
const { Amistad, User } = require("../../db");
const { Op } = require('sequelize');

const router = Router();

// Aplicamos el middleware de verificacion del token a todas las demas rutas.
//router.use(verifyToken);

// Ruta para las solicitudes de amistad pendientes
router.get("/pending-friend-requests", verifyToken, getPendingFriendRequests);

router.get("/buscar-amigos/:userId", buscarAmigo);

// Ruta para obtener la lista de amigos
router.get("/mis-amigos/:userId", verifyToken, getAmigos);

// Ruta  para aceptar o rechazar una solicitud de amistad
router.put("/accept-request/:id", verifyToken, responseToAmistad);

// Ruta para eliminar a un amigo
router.delete("/deleteAmigo/:id", verifyToken, removeAmigo);

router.post("/send-request/:amigoId", verifyToken, async (req, res) => {
  try {
    const { amigoId } = req.params;
    const { sub: senderId } = req.user;

    // Validar la existencia de senderId y amigoId
    if (!senderId || !amigoId ) {
      return res
        .status(400)
        .json({ message: "Parametros de la solicitud no validos." });
    }

    // Verificar si ya existe una solicitud pendiente o si ya son amigos
    const existingAmigo = await Amistad.findOne({
      where: {
        senderId,
        amigoId,
        status: "pending",
      },
    });

    const areAlreadyAmigos = await Amistad.findOne({
      where: {
        senderId: amigoId,
        amigoId: senderId,
        status: "accepted",
      },
    });

    if (existingAmigo || areAlreadyAmigos) {
      return res
        .status(400)
        .json({ message: "Solicitud y enviada o ya son amigos." });
    }

    // Crea la solicitud de amistad
    const amistad = await Amistad.create({
      senderId,
      amigoId,
      status: "pending",
    });
    console.log('amistad', amistad)

    return res
      .status(200)
      .json({amistad, message: "Solicitud de amistad enviada correctamente." });
  } catch (error) {
    console.error("Error al enviar la solicitud de amistad:", error);
    return res.status(500).json({ error: error.message });
  }
});



router.get('/amigos/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar todas las amistades donde el usuario es el remitente o el amigo
    const amistades = await Amistad.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { amigoId: userId, accepted: true },
        ],
      },
    });

    // Obtener los IDs de los amigos
    const friendIds = amistades.map((amistad) =>
      amistad.senderId === userId ? amistad.amigoId : amistad.senderId
    );

    // Buscar información del usuario para cada amigo
    const amigos = await User.findAll({
      where: {
        sub: { [Op.in]: friendIds },
      },
      attributes: ['sub', 'name', 'last_name', 'image', 'email'], // Ajusta las columnas según tus necesidades
    });

    res.json({ success: true, amigos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener la lista de amigos' });
  }
});

module.exports = router;
