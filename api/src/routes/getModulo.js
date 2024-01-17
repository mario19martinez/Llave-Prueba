const { Router } = require("express");
const { Modulo } = require("../db");
const { updatedModulo } = require("../controllers/putModulo");
const { Op } = require("sequelize");

const router = Router();

// Ruta Get para obtener los modulos
router.get("/modulos", async (req, res) => {
  const titulo = req.query.titulo;
  try {
    let modulo;
    if (titulo) {
      modulo = await Modulo.findAll({
        where: {
          titulo: {
            [Op.iLike]: `%${titulo}%`,
          },
        },
      });
    } else {
      modulo = await Modulo.findAll();
    }
    res.status(200).json(modulo);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// Ruta Post para crear un nuevo modulo
router.post("/modulos", async (req, res) => {
  try {
    const { titulo, descripcion, contenido } = req.body;

    const newModulo = await Modulo.create({
      titulo,
      descripcion,
      contenido,
    });

    res.status(201).json(newModulo);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// Ruta Put para modificar los modulos
router.put("/modulos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await updatedModulo(id, req.body);
    res
      .status(200)
      .json({ mensaje: "Modulo actualizado con exito", modulo: modulo });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});


// Ruta Delete donde implemento el borrado logico para un modulo.
router.delete("/modulos/:id", async (req, res) => {
  const moduloID = req.params.id;

  try {
    // Busca el modulo por su ID en la base de datos
    const modulo = await Modulo.findByPk(moduloID);

    // Si el modulo no existe, devuelve un error 404
    if (!modulo) {
      res.status(404).json({ message: "Modulo no encontrado" });
    }

    // Devuelve el estado del modulo a inactivo
    await modulo.update({ activo: false });

    // Devuelve una respuesta exitosa
    res.status(204).send(); // 204 significa "No Content", ya que no hay contenido para devolver
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
module.exports = router