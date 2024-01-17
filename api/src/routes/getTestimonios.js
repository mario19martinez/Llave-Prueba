const { Router } = require("express");
const { Testimonios } = require("../db");

const router = Router();

// Ruta para obtener todos los testimonios
router.get("/testimonios", async (req, res) => {
  try {
    const testimonios = await Testimonios.findAll();

    return res.status(200).json({ testimonios });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

function obtenerVideoIdDesdeUrl(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("v");
}

// Crear un testimonio
router.post("/testimonio", async (req, res) => {
  const { video, descripcion } = req.body;

  try {
    const videoId = obtenerVideoIdDesdeUrl(video);

    const nuevoTestimonio = await Testimonios.create({
      video: videoId,
      descripcion,
    });
    return res.status(201).json({ nuevoTestimonio });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear testimonio" });
  }
});

// Modificar un testimonio
router.put("/testimonios/:id", async (req, res) => {
  const { id } = req.params;
  const { video, descripcion } = req.body;

  // Validamos el ID del testimonio
  const testimonioId = parseInt(id);

  if (isNaN(testimonioId)) {
    return res.status(400).json({ error: 'ID de testimonio no valido'})
  }

  // Validamos los datos de entrada
  if (!video || !descripcion){
    return res.status(400).json({error: 'Datos de entrada invalidos'})
  }

  try {
    // Buscar el testimonio por su ID
    const testimonio = await Testimonios.findByPk(id);

    if (!testimonio) {
      return res.status(404).json({ error: "Testimonio no encontrado" });
    }

    // Actualizar el testimonio con los nuevos datos
    await testimonio.update({
      video,
      descripcion,
    });

    return res.json(testimonio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar testimonio" });
  }
});

// Eliminar un testimonio
router.delete("/testimonio/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el testimonio por su ID
    const testimonio = await Testimonios.findByPk(id);

    if (!testimonio) {
      return res.status(404).json({ error: "Testimonio no encontrado" });
    }

    // Eliminar el testimonio de la base de datos
    await testimonio.destroy();

    res.json({ mensaje: "Testimonio eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar testimonio" });
  }
});

// Obtener un testimonio por ID
router.get("/testimonios/:id", async (req, res) => {
  const { id } = req.params;

  // Validar el ID del testimonio
  const testimonioId = parseInt(id);

  if (isNaN(testimonioId)) {
    return res.status(400).json({ error: 'ID de testimonio no válido' });
  }

  try {
    // Buscar el testimonio por su ID
    const testimonio = await Testimonios.findByPk(id);

    if (!testimonio) {
      return res.status(404).json({ error: "Testimonio no encontrado" });
    }

    res.json(testimonio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el testimonio" });
  }
});

module.exports = router;
