const { Post, User } = require("../../db");

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { sub: userId } = req.user; // El id del usuario que quiere eliminar la publicacion

  try {
    // Verifica si la publicacin existe y fue creada por el usuario
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
            "Publicacion no encontrada o no tienes permeisos para eliminarla.",
        });
    }

    // Elimina la publicacion
    await post.destroy();

    return res
      .status(200)
      .json({ message: "Publicacion eliminada correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deletePost,
};
