const { User, Message, Chat } = require("../../db");
const { Op } = require("sequelize");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        sub: {
          [Op.not]: req.user.sub,
        },
      },
      attributes: ["sub", "name", "last_name", "email"],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Ruta GET para obtener el historial de mensajes
const chatUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar mensajes donde es usuario es el remitente o el destinatario
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creacion ascendente
    });

    const formattedMessages = messages.map((message) => ({
      ...message.toJSON(),
      messageType: message.senderId === userId ? "sent" : "received"
    }))
    res.status(200).json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userInfo = {
      sub: req.user.sub,
      identificacion: req.user.identificacion,
      name: req.user.name,
      last_name: req.user.last_name,
      email: req.user.email,
    };
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error al obtener informacion del usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUsersChat = async (req, res) => {
  try {
    const userId = req.user ? req.user.sub : null;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing in the request.' });
    }

    // Buscar todos los chats en los que el usuario ha participado
    const chats = await Chat.findAll({
      include: [
        {
          model: Message,
          where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
          },
          include: [
            { model: User, as: "sender" },
            { model: User, as: "receiver" },
          ],
        },
      ],
    });

    // Extraer los usuarios de los mensajes en los chats
    const usersChat = chats.reduce((users, chat) => {
      const usersInChat = chat.messages.reduce((usersInMessage, message) => {
        usersInMessage.push(message.sender, message.receiver);
        return usersInMessage;
      }, []);
      return users.concat(usersInChat);
    }, []);

    // Filtrar y eliminar duplicados
    const uniqueUsers = usersChat.filter(
      (user, index, self) => index === self.findIndex(u => u.sub === user.sub)
    );

    res.status(200).json(uniqueUsers);
  } catch (error) {
    console.error("Error al obtener usuarios con interacción:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getUsers,
  chatUser,
  getUserInfo,
  getUsersChat,
};
