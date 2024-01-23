const { Router } = require("express");
const {
  addComment,
} = require("../../controllers/CommentController/commentController");
const {
  updateComment,
} = require("../../controllers/CommentController/putComment");
const {
  deleteComment,
} = require("../../controllers/CommentController/deleteComment");
const {
  getComment,
} = require("../../controllers/CommentController/getComment");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = Router();

// Ruta GET para obtener comentarios por postId
router.get("/comments/:postId", getComment);

// Ruta para agregar un comentario a una publicacion
router.post("/newComment", verifyToken, addComment);

// Ruta para actualizar un comentario
router.put("/comment/:commentId", updateComment);

// Ruta para eliminar un comentario
router.delete("/deleteComment/:commentId", deleteComment);

module.exports = router;
