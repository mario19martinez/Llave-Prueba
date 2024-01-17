const { Router } = require("express");
const { Blog } = require("../db");

const router = Router();

// Obtener todos los blogs
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los blogs" });
  }
});

// Obtener un blog por ID
router.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener el blog por ID" });
  }
});

// Crear un nuevo blog
router.post("/blogs", async (req, res) => {
  const { title, content, imageUrl, embeddedElement } = req.body;

  try {
    const newBlog = await Blog.create({ title, content, imageUrl, embeddedElement });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al crear el blog" });
  }
});

// Modificar un blog por ID
router.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl, embeddedElement } = req.body;

  try {
    const blogToUpdate = await Blog.findByPk(id);
    if (!blogToUpdate) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    // Actualizar el blog con los nuevos datos
    await blogToUpdate.update({ title, content, imageUrl, embeddedElement });

    res.json(blogToUpdate);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al modificar el blog" });
  }
});

// Eliminar un blog por ID
router.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blogToDelete = await Blog.findByPk(id);
    if (!blogToDelete) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    // Eliminar el blog
    await blogToDelete.destroy();

    res.json({ message: "Blog eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al eliminar el blog" });
  }
});

module.exports = router;