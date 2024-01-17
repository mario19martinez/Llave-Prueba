const { Post, User } = require("../../db");

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { sub: userId } = req.user; // El id del usuario que quiere actualizar la publicacion

  try {
    // Verifica si la publicacion existe y fue creada por el usuario
    const post = await Post.findOne({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({
          message:
            "Publicacion no encontrada o no tienes permisos para actualizarla.",
        });
    }

    // Actualiza la publicacion
    post.content = content;
    await post.save();

    return res
      .status(200)
      .json({ post, message: "Publicacion actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updatePost,
};
