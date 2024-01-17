const { Amistad } = require("../../db");

const removeAmigo = async (req, res) => {
  const { id } = req.params;
  const { sub: subId } = req.user; // El id del usuario que quiere eliminar al amigo

  try {
    // Verifica si la amistad existe y esta aceptada
    const friendShip = await Amistad.findOne({
      where: {
        id: id,
        subId,
        status: "accepted",
      },
    });

    if (!friendShip) {
      return res
        .status(404)
        .json({ message: "Amistad no encontrada o no esta aceptada." });
    }

    // Elimina la amistad
    await friendShip.destroy();
    return res.status(200).json({ message: "Amigo eliminado correcatmente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  removeAmigo,
};
