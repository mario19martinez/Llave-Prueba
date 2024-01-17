const { Amistad, User } = require("../../db");
const { Op } = require("sequelize");

const responseToAmistad = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    // Busca la solicitud de amistad por su ID
    const solicitud = await Amistad.findByPk(id);

    if (!solicitud) {
      return res
        .status(404)
        .json({ error: "Solicitud de amistad no encontrada." });
    }

    // Realizamos la accion de aceptar o rechazar
    if (response === "accept") {
      solicitud.status = "accepted";

      // Obtener los usuarios
      const userA = await User.findByPk(solicitud.senderId);
      const userB = await User.findByPk(solicitud.amigoId);

      // Agrega a userA a la lista de amigos de userB y viceversa
      await userA.addReceivedRequest(solicitud); // Agrega la solicitud recibida como amigo
      await userB.addSentRequest(solicitud); // Agrega la solicitud enviada como amigo
    } else if (response === "reject") {
      solicitud.status = "rejected";
    } else {
      return res.status(400).json({ error: "Respuesta no valida." });
    }

    await solicitud.save();

    return res.status(200).json({ message: "Solicitud actualizada" });
  } catch (error) {
    console.error("Error al procesar la solicitud de amistad:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { responseToAmistad };
