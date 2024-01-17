const { Router } = require("express");
const {
  createPost,
} = require("../../controllers/PostController/postController");
const {
  getAllPosts,
  getPostsByUser,
  myPost
} = require("../../controllers/PostController/getAllPost");
const { updatePost } = require("../../controllers/PostController/putPost");
const { deletePost } = require("../../controllers/PostController/deletePost");
const { verifyToken } = require('../../middleware/authMiddleware');

const router = Router();

// Ruta para crear una nueva publicacion con verificación de token
router.post('/create-post', verifyToken, createPost);

// Ruta para obtener todas las publicaciones
router.get("/allPost", getAllPosts);

// Ruta para obtener todas las publicaciones de un usuario
router.get("/post/:userId", getPostsByUser);

// Ruta para obtener publicaciones del usuario actual
router.get('/my-posts', verifyToken, myPost)

// Ruta para actualizar una publicacion
router.put("/:postId", updatePost);

// Ruta para eliminar una publicacion
router.delete("/:postId", deletePost);

module.exports = router;
