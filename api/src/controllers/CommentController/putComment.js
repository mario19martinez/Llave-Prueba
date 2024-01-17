const { Comment, User } = require("../../db");

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { sub: userId } = req.params; // El id del usuario que quiere actualizar el comentario

  try {
    // Verifica si el comentario existe y fue creado por el usuario
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        userId,
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json({
          message:
            "Comentario no encontrado o no tienes permisos para actualizarlo. ",
        });
    }

    // Actualizar el contenido del comentario
    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json({ comment, message: "Comentario actualizado correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateComment,
};
