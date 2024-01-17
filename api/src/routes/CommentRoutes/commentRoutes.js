const { Router } = require("express");
const { addComment } = require("../../controllers/CommentController/commentController");
const {
  updateComment,
} = require("../../controllers/CommentController/putComment");
const {
  deleteComment,
} = require("../../controllers/CommentController/deleteComment");

const router = Router();

// Ruta para agregar un comentario a una publicacion
router.post("/newComment", addComment);

// Ruta para actualizar un comentario
router.put("/comment/:commentId", updateComment);

// Ruta para eliminar un comentario
router.delete("/deleteComment/:commentId", deleteComment);

module.exports = router;
