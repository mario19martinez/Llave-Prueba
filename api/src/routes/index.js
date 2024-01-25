const { Router } = require("express");
// Importar todos los routers;
const getUser = require("./getUser");
const getCursos = require("./getCursos");
const getModulo = require("./getModulo");
const postInscripcion = require("./postInscripcion");
const userBaned = require("./userBaned");
const getComentario = require("./getComentario");
const getSeguimiento = require("./getSeguimiento");
const adminRoutes = require("./adminRoutes/adminRoutes");
const getClases = require("./getClases");
const AmistadRoutes = require("./AmistadRoutes/AmistadRoutes");
const PostRoutes = require("./PostRoutes/PostRoutes");
const CommentRoutes = require("./CommentRoutes/commentRoutes");
const LikeRoutes = require("./LikeRoutes/likeRoutes");
const MessageRoutes = require("./MessageRoutes/messageRoutes");
const getTestimonios = require("./getTestimonios");
const BlogRoutes = require("./blogRoutes");
const getAbaut = require("./getAbaut");
const getTalleres = require("./getTalleres");
//const getPreguntaTaller = ('./getPreguntaTaller')
const cardRoutes = require("./cardRoutes/cardRoutes");
const questionRoutes = require("./questionRoutes/questionRoutes");
const router = Router();

router.use("/", getUser);
router.use("/", getCursos);
router.use("/", getModulo);
router.use("/", postInscripcion);
router.use("/", userBaned);
router.use("/", getComentario);
router.use("/", getSeguimiento);
router.use("/", adminRoutes);
router.use("/", getClases);
router.use("/", AmistadRoutes);
router.use("/", PostRoutes);
router.use("/", CommentRoutes);
router.use("/", LikeRoutes);
router.use("/", MessageRoutes);
router.use("/", getTestimonios);
router.use("/", BlogRoutes);
router.use("/", getAbaut);
router.use("/", getTalleres);
//router.use("/", getPreguntaTaller);
router.use("/", cardRoutes);
router.use("/", questionRoutes);

module.exports = router;
