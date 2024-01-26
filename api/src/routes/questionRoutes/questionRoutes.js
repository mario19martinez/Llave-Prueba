const { Router } = require("express");
const { Question, Answer, User } = require("../../db");
const { verifyToken } = require('../../middleware/authMiddleware')

const router = Router();

router.get("/question", async (req, res) => {
  try {
    const question = await Question.findAll({
      include: {
        model: User,
        attributes: ["name", "last_name"],
      },
    });
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para crear una nueva pregunta
router.post("/question", verifyToken, async (req, res) => {
  try {
    const { userSub, text } = req.body;

    // Busca el usuario por su userSub
    const user = await User.findOne({ where: { sub: userSub } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const question = await Question.create({
      text,
      userSub: user.sub,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta GET para obtener respuestas de una pregunta especifica
router.get("/question/:id/answers", async (req, res) => {
  try {
    const { id } = req.params;

    const answers = await Answer.findAll({
      where: { questionId: id },
      include: {
        model: User,
        attributes: ["name", "last_name"],
      },
    });

    res.status(200).json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para responder a una pregunta
router.post("/question/:id/answers", async (req, res) => {
  try {
    const { userSub, text } = req.body;
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    const user = await User.findOne({ where: { sub: userSub } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const answer = await Answer.create({
      text,
      userSub: user.sub,
      questionId: id,
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar una respuesta
router.delete("/question/:questionId/answer/:answerId", verifyToken, async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userSub = req.query.userSub;
    const answer = await Answer.findOne({
      where: { id: answerId, questionId },
      include: {
        model: User,
        attributes: ["sub"],
      },
    });

    if (!answer) {
      return res.status(404).json({ error: "Respuesta no encontrada." });
    }

    if (answer.user.sub !== userSub) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para eliminar esta respuesta" });
    }

    await answer.destroy();

    res.status(204).send(); // 204 significa 'No Content' y se usa para indicar exito sin contenido adicional.
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
