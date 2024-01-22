const { Router } = require("express");
const {
  getUsers,
  chatUser,
  getUserInfo,
  getUsersChat,
} = require("../../controllers/MessageController/getUserMessage");
const { verifyToken } = require("../../middleware/authMiddleware");
const { Message } = require("../../db");
const { Op } = require("sequelize");

const router = Router();

// Muestra los usuarios
router.get("/users-chat", verifyToken, getUsers);

// Ruta GET para obtener el historial de mensajes
router.get("/chat-users/:userId", verifyToken, chatUser);

// Ruta GET que trae el los mensajes entre usuarios
router.get("/user-info", verifyToken, getUserInfo);

// Ruta GET que trae los usuarios con los que se ha tenido chat
router.get("/chat-historial", verifyToken, getUsersChat);

router.get("/messages", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
