const { Comment, User } = require("../../db");

const getComment = async (req, res) => {
  const postId = req.params.postId;

  try {
    // Aca va la logica para obtener los comentarios asociados a la publicacion.
    const comments = await Comment.findAll({
      where: { postId: postId },
      include: {
        model: User,
        attributes: ['name', 'last_name'],
        as: 'user',
      }
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error al traer los comentarios:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getComment,
};
