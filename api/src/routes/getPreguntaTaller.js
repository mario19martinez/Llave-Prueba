const express = require('express');
const router = express.Router();
const { PreguntaTaller } = require('../models'); // Asegúrate de importar el modelo adecuadamente

// Ruta para obtener todas las preguntas de un taller
router.get('/talleres/:id_taller/preguntas', async (req, res) => {
  try {
    const idTaller = req.params.id_taller;
    const preguntas = await PreguntaTaller.findAll({ where: { TallerId: idTaller } });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener una pregunta específica de un taller
router.get('/talleres/:id_taller/preguntas/:id_pregunta', async (req, res) => {
  try {
    const idPregunta = req.params.id_pregunta;
    const pregunta = await PreguntaTaller.findOne({ 
      where: { id: idPregunta, TallerId: req.params.id_taller } 
    });
    if (!pregunta) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear una nueva pregunta para un taller
router.post('/talleres/:id_taller/preguntas', async (req, res) => {
  try {
    const idTaller = req.params.id_taller;
    const nuevaPregunta = await PreguntaTaller.create({
      enunciado: req.body.enunciado,
      tipo: req.body.tipo,
      respuestaCorrecta: req.body.respuestaCorrecta,
      TallerId: idTaller,
    });
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar una pregunta específica de un taller
router.put('/talleres/:id_taller/preguntas/:id_pregunta', async (req, res) => {
  try {
    const idPregunta = req.params.id_pregunta;
    const pregunta = await PreguntaTaller.findOne({ 
      where: { id: idPregunta, TallerId: req.params.id_taller } 
    });
    if (!pregunta) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }
    pregunta.enunciado = req.body.enunciado || pregunta.enunciado;
    pregunta.tipo = req.body.tipo || pregunta.tipo;
    pregunta.respuestaCorrecta = req.body.respuestaCorrecta || pregunta.respuestaCorrecta;
    await pregunta.save();
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar una pregunta específica de un taller
router.delete('/talleres/:id_taller/preguntas/:id_pregunta', async (req, res) => {
  try {
    const idPregunta = req.params.id_pregunta;
    const pregunta = await PreguntaTaller.findOne({ 
      where: { id: idPregunta, TallerId: req.params.id_taller } 
    });
    if (!pregunta) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }
    await pregunta.destroy();
    res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;