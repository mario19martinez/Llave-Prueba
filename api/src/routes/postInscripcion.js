const { Router } = require("express");
const { Inscripcion } = require("../db")

const router = Router();

router.get("/inscritos", async (req, res) => {
  try {
    const inscritos = await Inscripcion.findAll();
    res.status(200).json(inscritos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Ruta POST para crear una nueva inscripcion
router.post("/inscripcion", async (req, res) => {
  const { inicio, progreso } = req.body; // Los datos para la nueva inscripción se obtienen del cuerpo de la solicitud

  try {
    // Crea una nueva inscripcion en la db
    const newInscripcion = await Inscripcion.create({
      inicio,
      progreso,
    });

    // Envia la inscripcion creada como respuesta
    return res.status(201).json(newInscripcion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Ruta PUT para modificar una inscripcion por su ID
router.put("/inscripciones/:id", async(req, res) => {
  const { id } = req.params
  const { inicio, progreso } = req.body; // Los datos actualizados se obtienen del cuerpo de la solicitud

  try {
    // Encuentra la inscripcion en la db
    const inscripcion = await Inscripcion.findByPk(id)

    if(!inscripcion) {
      return res.status(404).json({ message: "Inscripcion no encontrada"})
    }

    // Actualiza los cambios de la inscripcion
    inscripcion.inicio = inicio || inscripcion.inicio; // Si inicio no se proporciona, se mantiene el valor existente
    inscripcion.progreso = progreso || inscripcion.progreso; // Si progreso no se proporciona, se mantiene el valor existente

    // Guarda los cambios en la db
    await inscripcion.save();

    // Envia la inscripcion modificada como respuesta
    return res.status(200).json(inscripcion);
  } catch(error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router