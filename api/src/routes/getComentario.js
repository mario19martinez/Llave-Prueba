const { Router } = require("express");
const { Curso, Comentario } = require("../db")

const router = Router();

// Ruta para obtener todos los comentarios de un curso.
router.get("/:id/comentarios", async (req, res) => {
  try {
    const { id } = req.params;

    // Encuentra el curso al que deseas obtener los comentarios
    const curso = await Curso.findByPk(id, {
      include: Comentario, // Esto cargara los comentarios asociados al curso
    });

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Obtiene los comentarios asociados al curso
    const comentarios = curso.Comentario;

    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// Ruta para agregar un comentario a un curso.
router.post("/:id/comentarios", async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    // Encuentra el curso al que deseas agregar el comentario
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Crea el comentario y asocialo al curso
    const comentario = await Comentario.create({ texto });
    await curso.addComentario(comentario);

    return res.status(201).json(comentario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Ruta PUT para actualizar un comentario en especifico
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    // Encuentra el comentario que deseas actualizar
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Actualiza el texto de comentario
    comentario.texto = texto;
    await comentario.save();

    return res.status(200).json(comentario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Ruta DELETE para eliminar un comentario por su ID
router.delete("/comentarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Encuentra el comentario en la db
    const comentario = await Comentario.findByPk(id);

    if (!id) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Si el comentario existe, puedes eliminarlo
    await comentario.destroy();

    // Envia una respuesta exitosa
    return res.status(204).end(); // 204 significa "No Content"
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




module.exports = router;