const { Routes, Router } = require("express");
const { addLike } = require("../../controllers/LikeController/likeController");
const { deleteLike } = require("../../controllers/LikeController/deleteLike");
const { getLikesCount } = require("../../controllers/LikeController/likeController");
const { verifyToken } = require('../../middleware/authMiddleware');

const router = Router();

// Ruta para dar 'Me gusta' a una publicacion
router.post('/newLike', verifyToken, addLike);

// Ruta para eliminar un 'Me gusta'
router.delete("/deleteLike/:likeId", deleteLike);

// Ruta para obtener la cantidad de likes de una publicacion
router.get('/likesCount/:postId', verifyToken, getLikesCount,);

module.exports = router;
