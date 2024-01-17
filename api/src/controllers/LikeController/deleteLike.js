const { Like, User } = require("../../db");

const deleteLike = async (req, res) => {
  const { likeId } = req.params;
  const { sub: userId } = req.user; // El id del usuario que quiere eliminar el 'Me gusta'

  try {
    // Verifica si el 'Me gusta' existe y fue dado por el usuario
    const like = await Like.findOne({
      where: {
        id: likeId,
        userId,
      },
    });

    if (!like) {
      return res
        .status(404)
        .json({
          message:
            "Me gusta no encontrado o no tienes permisos para eliminarlo.",
        });
    }

    // Elimina el 'Me gusta'
    await like.destroy();

    return res.status(200).json({ message: " Me gusta eliminado con exito." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteLike,
};
