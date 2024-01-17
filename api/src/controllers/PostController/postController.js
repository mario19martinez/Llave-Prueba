const { Post, User, Like } = require("../../db");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
  const { content, image } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token

    const user = await User.findOne({ where: { token } }); // Buscar al usuario por el token

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("URL de la imagen:", image);
    const post = await Post.create({
      content: content,
      image: image,
      userId: user.id, // Asignar el ID del usuario correspondiente a la publicación
    });

    // Asociar la publicación al usuario
    await user.addPost(post);

    return res.status(201).json({ post, message: "Publicación creada correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const totalPosts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["sub", "name", "last_name", "image"],
        },
        {
          model: Like,
          attributes: [], // Traer solo los likes, sin incluir otros campos
        },
      ],
      attributes: ["id", "content", "userId"], // Incluir solo los campos necesarios
    });

    // Obtener la cantidad de likes para cada publicación
    const postsWithLikes = await Promise.all(
      totalPosts.map(async post => {
        const likeCount = await Like.count({ where: { postId: post.id } });
        return {
          id: post.id,
          content: post.content,
          userSub: post.userSub,
          user: post.user,
          likes: likeCount, // Incluir la cantidad de likes en la respuesta
        };
      })
    );

    res.status(200).json({ posts: postsWithLikes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};