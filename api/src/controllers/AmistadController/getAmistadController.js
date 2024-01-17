const { Op } = require("sequelize");
const { Amistad, User } = require("../../db");

const getPendingFriendRequests = async (req, res) => {
  try {
    const { sub: currentUserSub } = req.user;

    const pendingRequest = await Amistad.findAll({
      where: {
        amigoId: currentUserSub,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["sub", "name", "last_name", "image", "email"],
        },
      ],
    });

    const formattedRequest = pendingRequest.map((request) => ({
      id: request.id,
      status: request.status,
      sender: {
        sub: request.sender.sub,
        name: request.sender.name,
        last_name: request.sender.last_name,
        image: request.sender.image,
        email: request.sender.email,
      },
    }));

    res.status(200).json(formattedRequest);
  } catch (error) {
    console.error(
      "Error al cargar las solicitudes de amistad pendientes:",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

// Funcion para obtener la lista de amigos del usuario
const obtenerListaAmigos = async (userId) => {
  const amigosIds = (
    await Amistad.findAll({
      where: {
        [Op.or]: [{ amigoId: userId }, { senderId: userId }],
        status: "accepted",
      },
      attributes: ["amigoId", "senderId"],
    })
  ).map((amistad) =>
    amistad.amigoId === userId ? amistad.senderId : amistad.amigoId
  );

  return amigosIds;
};

// Funcion para obtener la lista de usuarios que no son amigos
const userSinAmigos = async (userId, amigosIds) => {
  const usuariosSinAmigos = await User.findAll({
    where: {
      sub: {
        [Op.notIn]: [...amigosIds, userId],
      },
      rol: "client",
      banned: false,
      deleted: false,
    },
  });

  return usuariosSinAmigos;
};

// Funcion principal que utiliza las funciones anteriores
const buscarAmigo = async (req, res) => {
  try {
    const { userId } = req.params;

    const amigosIds = await obtenerListaAmigos(userId);

    const usuariosSinAmigos = amigosIds.includes(userId)
      ? await userSinAmigos(
          userId,
          amigosIds.filter((id) => id !== userId)
        )
      : await userSinAmigos(userId, amigosIds);

    res.status(200).json(usuariosSinAmigos);
  } catch (error) {
    console.error("Error al buscar amigos:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAmigos = async (req, res) => {
  const { userId } = req.params;
  try {
    const amistades = await Amistad.findAll({
      where: {
        [Op.and]: [
          {
            status: "accepted",
          },
          {
            [Op.or]: [{ senderId: userId }, { amigoId: userId }],
          },
        ],
      },
    });

    const amigosIds = amistades.map((amistad) =>
      amistad.senderId === userId ? amistad.amigoId : amistad.senderId
    );

    const amigos = await User.findAll({
      where: {
        sub: {
          [Op.in]: amigosIds,
        },
      },
    });

    res.status(200).json(amigos);
  } catch (error) {
    console.error("Error al obtener la lista de amigos:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPendingFriendRequests,
  buscarAmigo,
  getAmigos,
};
