const { Amistad, User } = require("../../db");

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    //console.log('Received friend request for userId:', userId);
    const { sub: subId } = req.user; // El id del usuario que envia la solicitud

    // VAlidar la existencia de userId y subId
    if (!userId || !subId) {
      return res
        .status(400)
        .json({ message: "Parametros de solicitud no validos." });
    }

    // Verificar si ya existe una solicitud pendiente o si ya son amigos
    const existingAmigo = await Amistad.findOne({
      where: {
        userId,
        amigoId: subId,
        status: "pending",
      },
    });

    const areAlreadyAmigos = await Amistad.findOne({
      where: {
        userId: subId,
        amigoId: userId,
        status: "accepted",
      },
    });

    if (existingAmigo || areAlreadyAmigos) {
      return res
        .status(400)
        .json({ message: "Solicitud ya enviada o ya son amigos." });
    }

    // Verificar si ya existe una solicitud aceptada en la direccion opuesta
    const reverseExistingAmigo = await Amistad.findOne({
      where: {
        userId: userId,
        amigoId: subId,
        status: 'accepted',
      }
    })

    if (reverseExistingAmigo) {
      return res.status(400).json({ message: 'Ya eres amigo de este usuario.' })
    }
    console.log('Creating friend request:', { userId, amigoId: subId });
    // Crear la solicitud de amistad
    await Amistad.create({
      userId,
      amigoId: subId,
      status: "pending",
    });

    return res
      .status(200)
      .json({ message: "Solicitud de amistad envianda correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
};
