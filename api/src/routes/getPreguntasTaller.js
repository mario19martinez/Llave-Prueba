const { Router } = require('express');
const { PreguntaTaller, User, Taller } = require('../db');

const router = Router();

// Ruta GET para obtener todas las preguntas de un taller específico
router.get('/talleres/:id/preguntas', async (req, res) => {
  const { id } = req.params;

  try {
    const taller = await Taller.findByPk(id, {
      include: [{ model: PreguntaTaller }],
    });

    if (!taller) {
      return res.status(404).json({ message: 'Taller no encontrado' });
    }

    const preguntas = taller.preguntaTallers;
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para responder una pregunta de un taller
router.post('/usuarios/:userId/talleres/:tallerId/preguntas/:preguntaId/responder', async (req, res) => {
  const { userId, tallerId, preguntaId } = req.params;
  const { respuesta } = req.body;

  try {
    const user = await User.findByPk(userId);
    const taller = await Taller.findByPk(tallerId);
    const pregunta = await PreguntaTaller.findByPk(preguntaId);

    if (!user || !taller || !pregunta) {
      return res.status(404).json({ message: 'Usuario, taller o pregunta no encontrados' });
    }

    // Verificar si la respuesta es correcta según el tipo de pregunta
    if (pregunta.tipo === 'abierta') {
      pregunta.respondidaCorrectamente = (respuesta === pregunta.respuestaCorrecta);
    } else if (pregunta.tipo === 'seleccionUnica') {
      pregunta.respondidaCorrectamente = (respuesta === pregunta.respuestaCorrecta);
    }

    await pregunta.save();

    // Relacionar la respuesta del usuario con la pregunta
    await pregunta.addUser(user);

    res.status(200).json({ message: 'Respuesta registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
