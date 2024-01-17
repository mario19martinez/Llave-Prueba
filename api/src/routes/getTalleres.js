const { Router } = require("express");
const { Taller } = require("../db");
const { Op } = require("sequelize");

const router = Router();

// Ruta GET para obtener todos los talleres
router.get("/talleres", async (req, res) => {
  const title = req.query.title;
  try {
    let totalTalleres;

    if (title) {
      totalTalleres = await Taller.findAll({
        where: {
          titulo: {
            [Op.iLike]: `%${title}%`,
          },
          deletedAt: {
            [Op.eq]: false, // Excluye los talleres eliminados logicamente (deletedAt = false)
          },
        },
      });
    } else {
      totalTalleres = await Taller.findAll({
        where: {
          deletedAt: {
            [Op.eq]: false, // Excluye los talleres eliminados logicamente (deletedAt = false)
          },
        },
      });
    }
    res.status(200).json(totalTalleres);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta GET para obtener un taller por su ID
router.get("/talleres/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const taller = await Taller.findByPk(id); // findByPk es un método de sequelize para encontrar por clave primaria
    if (!taller) {
      return res.status(404).json({ error: "Taller no encontrado" });
    }

    return res.status(200).json(taller);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ruta POST para crear un nuevo taller
router.post("/newTaller", async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      fechaInicio,
      fechaFinalizacion,
      duracionHoras,
      cupoMaximo,
      cursoId,
    } = req.body;

    const newTaller = await Taller.create({
      titulo,
      descripcion,
      fechaInicio,
      fechaFinalizacion,
      duracionHoras,
      cupoMaximo,
      cursoId,
    });

    res.status(201).send(newTaller);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta PUT para actualizar un taller por su ID
router.put("/newTaller/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTaller = await Taller.update(req.body, {
      where: { id },
    });

    res
      .status(202)
      .json({ mensaje: "Taller actualizado con éxito", taller: updatedTaller });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta DELETE para eliminar un taller por su ID
router.delete("/taller/:id", async (req, res) => {
  const tallerID = req.params.id;

  try {
    const taller = await Taller.findByPk(tallerID);

    if (!taller) {
      return res.status(404).json({ message: "Taller no encontrado" });
    }

    await taller.destroy();

    return res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el taller" });
  }
});

module.exports = router;
