const { Comment, User } = require("../../db");

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { sub: userId } = req.user; // El id del usuario que quiere eliminar el comentario

  try {
    // Verifica si el comentario existe y fue creado por el usuario
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        userId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        message:
          "Comentario no encontrado o no tienes permiso para eliminarlo.",
      });
    }

    // Elimina el comentario
    await comment.destroy();

    return res
      .status(200)
      .json({ message: "Comentario eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteComment,
};
