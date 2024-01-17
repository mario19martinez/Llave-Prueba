const { Comment, Post, User } = require("../../db");

const addComment = async (req, res) => {
  const { postId, content } = req.body;
  const user = req.user; // Usuario autenticado mediante el middleware

  try {
    // Verifica si la publicación existe
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Publicacion no encontrada." });
    }

    // Crea el comentario y lo asocia al usuario y la publicación
    const comment = await Comment.create({
      content,
      userSub: user.sub, // Asignar la sub del usuario al campo de userSub del comentario
      postId: post.id,
    });

    return res.status(201).json({ comment, message: "Comentario agregado correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addComment,
};
