const { Router } = require("express");
const { About } = require("../db");

const router = Router();

// Obtener todos los contenidos "About"
router.get("/about", async (req, res) => {
  try {
    const aboutContents = await About.findAll();
    res.json(aboutContents);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los contenidos 'About'" });
  }
});

// Obtener un contenido "About" por ID
router.get("/about/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const aboutContent = await About.findByPk(id);
    if (!aboutContent) {
      return res.status(404).json({ message: "Contenido 'About' no encontrado" });
    }
    res.json(aboutContent);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener el contenido 'About' por ID" });
  }
});

// Crear un nuevo contenido "About"
router.post("/about", async (req, res) => {
  const { titulo, content } = req.body;

  try {
    const newAboutContent = await About.create({ titulo, content });
    res.status(201).json(newAboutContent);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al crear el contenido 'About'" });
  }
});

// Modificar un contenido "About" por ID
router.put("/about/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, content } = req.body;

  try {
    const aboutContentToUpdate = await About.findByPk(id);
    if (!aboutContentToUpdate) {
      return res.status(404).json({ message: "Contenido 'About' no encontrado" });
    }

    // Actualizar el contenido "About" con los nuevos datos
    await aboutContentToUpdate.update({ titulo, content });

    res.json(aboutContentToUpdate);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al modificar el contenido 'About'" });
  }
});

// Eliminar un contenido "About" por ID
router.delete("/about/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const aboutContentToDelete = await About.findByPk(id);
    if (!aboutContentToDelete) {
      return res.status(404).json({ message: "Contenido 'About' no encontrado" });
    }

    // Eliminar el contenido "About"
    await aboutContentToDelete.destroy();

    res.json({ message: "Contenido 'About' eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al eliminar el contenido 'About'" });
  }
});

module.exports = router;
