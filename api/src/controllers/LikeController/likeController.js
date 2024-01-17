const { Like, Post, User } = require("../../db");

const addLike = async (req, res) => {
  const { postId } = req.body;
  const user = req.user; // Usuario autenticado mediante el middleware

  try {
    // Buscar la publicación
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Publicacion no encontrada." });
    }

    // Crear el like y asociarlo al usuario y la publicación
    const like = await Like.create({
      postId: post.id,
      userSub: user.sub // Asignar la sub del usuario al campo de userSub del like
    });

    return res.status(201).json({ like, message: "Me gusta agregado correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getLikesCount = async (req, res) => {
  try {
    const { postId } = req.params;

    // Obtener la cantidad de likes de la publicación con postId
    const likesCount = await Like.count({
      where: {
        postId: postId,
      },
    });

    res.status(200).json({ likesCount });
  } catch (error) {
    console.error("Error al obtener la cantidad de likes:", error);
    res.status(500).json({ message: "Error al obtener la cantidad de likes" });
  }
};

module.exports = {
  addLike,
  getLikesCount,
};
