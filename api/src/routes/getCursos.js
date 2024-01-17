const { Router } = require("express");
const { Curso } = require("../db");
const { updatedCourse } = require("../controllers/putCursos");
const { Op } = require("sequelize");
const { cursosDelUsuario } = require("../controllers/getControllersUser");
//const { json } = require("body-parser");

const router = Router();

// Ruta GET para los cursos.
router.get("/cursos", async (req, res) => {
  const name = req.query.name;
  try {
    let totalCursos;

    if (name) {
      totalCursos = await Curso.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
          deletedAt: {
            [Op.eq]: false, // Excluye los cursos que han sido eliminados logicamente (deletedAt = false)
          },
        },
      });
    } else {
      totalCursos = await Curso.findAll({
        where: {
          deletedAt: {
            [Op.eq]: false, // Excluye los cursos que han sido eliminados logicamente (deletedAt = false)
          },
        },
      });
    }
    res.status(200).json(totalCursos);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta GET que me permite buscar cursos por su id
router.get("/cursos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const curso = await Curso.findByPk(id); // findByPk es un metodo de sequelize para encontrar por clave primaria
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/newCurso", async (req, res) => {
  try {
    // Obtengo los datos del cuerpo de la solicitud
    const {
      name,
      image,
      duracion,
      nivel,
      costo,
      fechaInicio,
      fechaFinalizacion,
    } = req.body;

    // Crear un nuevo curso
    const newCurso = await Curso.create({
      name,
      image,
      duracion,
      nivel,
      costo,
      fechaInicio,
      fechaFinalizacion,
    });
    //console.log(newCurso)

    res.status(201).send(newCurso);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta para actualizar un curso por id
router.put("/newCurso/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await updatedCourse(id, req.body);
    res
      .status(202)
      .json({ mensaje: "Curso actualizado con exito", curso: curso });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta DELETE para eliminar un curso por su ID.
router.delete("/curso/:id", async (req, res) => {
  const cursoID = req.params.id;

  try {
    // Buscar el curso por si ID.
    const curso = await Curso.findByPk(cursoID);

    // Verificamos que el curso existe.
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Eliminar el curso.
    await curso.destroy();

    return res.status(204).send(); // Envia una respuesta 204 (Sin contenido) despues de eliminar.
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso" });
  }
});

// Ruta para eliminar de forma logica un curso o restaurar un curso
router.delete("/cursos/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Alternar el valor de deletedAt (de true a false o de false a true)
    curso.deletedAt = !curso.deletedAt;
    await curso.save();

    const mensaje = curso.deletedAt
      ? "Curso eliminado logicamente con exito"
      : "Curso restaurado con exito";

    res.status(200).json({ message: mensaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Esta ruta GET me permitira tener la lista de los cursos que han sido borrados de forma logica
router.get("/cursosD", async (req, res) => {
  try {
    const cursosEliminados = await Curso.findAll({
      where: {
        deletedAt: true, // Filtra los registros donde deletedAt sea true (eliminados logicamente)
      },
    });
    res.status(200).json(cursosEliminados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/usuario/cursos", cursosDelUsuario);

module.exports = router;
