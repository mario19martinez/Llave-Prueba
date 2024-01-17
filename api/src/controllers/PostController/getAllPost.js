const { Post, User, Comment, Like } = require("../../db");
const { Op } = require('sequelize');

const getAllPosts = async (req, res) => {
  try {
    // Obtenemos todas las publicaciones con la informacion del usuario que las creo
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["sub", "name", "last_name", "image"],
      },
    });

    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener todas las publicaciones de un usuario específico según el modelo Post
const getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verifica si el usuario existe
    const user = await User.findOne({
      where: {
        sub: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener todas las publicaciones del usuario con la informacion de usuario
    const posts = await Post.findAll({
      where: {
        userId,
      },
      include: {
        model: User,
        attributes: ["sub", "name", "last_name", "image"],
      },
    });

    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Funcion para traer mis publicaciones
const myPost = async (req, res) => {
  try {
    // Obtener el usuario actual basado en el token (asumiendo que estás usando algún middleware para la autenticación)
    const currentUser = req.user; // Ajusta esto según cómo manejas la autenticación

    // Verificar si el usuario existe
    if (!currentUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener las publicaciones del usuario y sus comentarios y me gusta
    const userPosts = await Post.findAll({
      where: { userSub: currentUser.sub },
      attributes: ['content', 'image', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(userPosts);
  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}


module.exports = {
  getAllPosts,
  getPostsByUser,
  myPost
};
