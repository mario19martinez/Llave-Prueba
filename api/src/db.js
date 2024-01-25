require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const pg = require("pg");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DATABASE_URL } =
  process.env;

// Crea un directorio si no existe
const directorioDeSubida = "uploads/";
if (!fs.existsSync(directorioDeSubida)) {
  fs.mkdirSync(directorioDeSubida); // Crea el directorio si no existe
}

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
    host: "localhost", // Este es el host de tu base de datos
    dialect: "postgres",
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos  la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models estan todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  User,
  Taller,
  Participacion,
  Inscripcion,
  Modulo,
  Curso,
  Blog,
  About,
  Comentario,
  Seguimiento,
  Clases,
  Amistad,
  Post,
  Comment,
  Like,
  Message,
  Testimonios,
  Chat,
  Card,
  Answer,
  Question,
} = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
User.hasMany(Inscripcion);
Inscripcion.belongsTo(User);

Inscripcion.belongsTo(Curso);
Curso.hasMany(Inscripcion);

Inscripcion.belongsTo(Curso);
Curso.hasMany(Inscripcion);

Curso.hasMany(Modulo);
Modulo.belongsTo(Curso);

Curso.hasMany(Comentario);
Comentario.belongsTo(Curso);

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(About);
About.belongsTo(User);

User.belongsToMany(Curso, { through: Seguimiento });
Curso.belongsToMany(User, { through: Seguimiento });

User.belongsToMany(Taller, { through: Participacion });
Taller.belongsToMany(User, { through: Participacion });

Curso.hasMany(Clases, { foreignKey: "cursoId" });
Clases.belongsTo(Curso, { foreignKey: "cursoId" });

Curso.hasMany(Taller);
Taller.belongsTo(Curso);

Taller.belongsTo(Curso);
Curso.hasMany(Taller);

Taller.belongsToMany(User, { through: Participacion });
User.belongsToMany(Taller, { through: Participacion });

User.belongsToMany(User, { as: "Friends", through: Amistad });
User.hasMany(Post);
User.hasMany(Comment);
User.hasMany(Like);

// Relaciones para el modelo Amistad
Amistad.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Amistad.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

User.hasMany(Amistad, { as: "sentRequests", foreignKey: "senderId" });
User.hasMany(Amistad, { as: "receivedRequests", foreignKey: "receiverId" });

// Relaciones para el modelo Post
Post.belongsTo(User, { foreignKey: "userSub" });
Post.hasMany(Comment);
Post.hasMany(Like);

// Relaciones para el modelo Comment
Comment.belongsTo(User);
Comment.belongsTo(Post);

// Relaciones para el modelo Like
Like.belongsTo(User);
Like.belongsTo(Post);

User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

Seguimiento.belongsTo(User);
Seguimiento.belongsTo(Curso);

Testimonios.belongsTo(User);
User.hasMany(Testimonios);

Chat.belongsTo(User, { as: "user1", foreignKey: "user1Id" });
Chat.belongsTo(User, { as: "user2", foreignKey: "user2Id" });

Chat.hasMany(Message, { foreignKey: "chatId" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

User.hasMany(Card);
Card.belongsTo(User);

Question.belongsTo(User);
User.hasMany(Question);

User.hasMany(Answer, { foreignKey: "userSub" });
Answer.belongsTo(User, { foreignKey: "userSub" });
Question.hasMany(Answer, { foreignKey: "questionId" });
// Answer.belongsTo(User);
// Answer.belongsTo(Question);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
