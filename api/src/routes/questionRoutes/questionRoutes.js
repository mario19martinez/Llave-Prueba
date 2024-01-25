const { Router } = require("express");
const { Question, Answer, User } = require("../../db");

const router = Router();

router.get("/question", async (req, res) => {
  try {
    const question = await Question.findAll({ include: User });
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para crear una nueva pregunta
router.post("/question", async (req, res) => {
  try {
    const { userSub, text } = req.body;

    // Busca el usuario por su userSub
    const user = await User.findOne({ where: { sub: userSub } });
    console.log('usuario:', user)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const question = await Question.create({
      text,
      userSub: user.sub,
    });
    console.log('Pregunta:', question)

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
      where: { questionID: id },
      include: {
        model: User,
        attributes: ['sub', 'name', 'last_name']
      }
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
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    const user = await User.findOne({ where: { sub: userSub } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
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

module.exports = router;
