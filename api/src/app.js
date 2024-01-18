const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const cleanExpiredTokens = require("../src/middleware/tokenCleanup");
const { User, Message, Chat } = require("./db");
const { verifyToken } = require("./middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

require("./db");

const server = express();
const httpServer = http.createServer(server);
const io = socket(httpServer, { transports: ["websocket"] });

server.name = "API";

const corsOptions = {
  //origin: "http://localhost:5173",
  origin: "https://llave-prueba.vercel.app",
  //methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  credentials: true,
  //optionsSuccessStatus: 204,
};

server.use(cors(corsOptions));

server.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

server.use("/uploads", express.static("uploads"));
server.use("/pdfs", express.static(path.join(__dirname, "uploads")));

server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  //res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", "https://llave-prueba.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Envia el objeto 'io' a las rutas para que puedan utilizarlo
server.use((req, res, next) => {
  res.locals.io = io;
  next();
});

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.log(err);
  res.status(status).send(message);
});

const determineChatId = async (senderId, receiverId) => {
  try {
    // Busca el chat existente entre el remitente y el receptor
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ user1Id: senderId }, { user2Id: receiverId }] },
          { [Op.and]: [{ user1Id: receiverId }, { user2Id: senderId }] },
        ],
      },
    });

    // Si no hay chat existente, crea uno nuevo
    if (!chat) {
      chat = await Chat.create({
        user1Id: senderId,
        user2Id: receiverId,
      });
    }

    // Devuelve el chatId existente o el recién creado
    return chat.id;
  } catch (error) {
    console.error("Error en determineChatId:", error);
    throw error;
  }
};


const createNewChat = async (sender, receiver) => {
  try {
    // Crea un nuevo chat en la base de datos
    const newChat = await Chat.create();

    // Asocia el remitente y el receptor con el nuevo chat
    await newChat.setUsers([sender, receiver]);

    return newChat.id;
  } catch (error) {
    console.error("Error en createNewChat:", error);
    throw error;
  }
};

const startChat = async (req, res) => {
  const { receiverId, content } = req.body || {};
  const senderId = req.user.sub; // ID del usuario que inicia el chat

  try {
    // Asegúrate de que senderId y receiverId estén definidos
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: "El ID del remitente o del receptor no está definido" });
    }

    // Cambia la búsqueda del remitente utilizando findByPk directamente
    const sender = await User.findByPk(senderId);

    // Manejo de errores si el remitente no es encontrado
    if (!sender) {
      return res.status(404).json({ error: "Remitente no encontrado" });
    }

    // Cambia la búsqueda del receptor utilizando findByPk directamente
    const receiver = await User.findByPk(receiverId);

    // Manejo de errores si el receptor no es encontrado
    if (!receiver) {
      return res.status(404).json({ error: "Receptor no encontrado" });
    }

    // Utiliza determineChatId para obtener el chatId
    const chatId = await determineChatId(sender.sub, receiver.sub);

    // Resto del código
    const nuevoMensaje = await Message.create({
      content,
      senderId,
      receiverId,
      chatId,
    });

    // const mensajesActualizados = await Message.findAll({
    //   where: { chatId },
    //   order: [['createAt', 'ASC']],
    // })

    //io.to(socket.id).emit('historial-mensajes', mensajesActualizados);
    io.emit("nuevo-mensaje", nuevoMensaje);

    return res.status(201).json({ message: "Chat iniciado" });
  } catch (error) {
    console.error("Error en la ruta /start-chat:", error);
    return res.status(500).json({ error: error.message });
  }
};

server.post("/start-chat", verifyToken, startChat);


io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Escuchar el nuevo evento 'nuevo-mensaje'
  socket.on("nuevo-mensaje", (nuevoMensaje) => {
    console.log("Nuevo Mensaje recibido:", nuevoMensaje);
    io.emit("nuevo-mensaje", nuevoMensaje);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Llamar a la función para limpiar tokens expirados cada cierto tiempo
setInterval(() => {
  cleanExpiredTokens();
}, 12 * 60 * 60 * 1000);

module.exports = { server, httpServer, io };
