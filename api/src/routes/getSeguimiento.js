const { Router } = require("express");
const { User, Curso, Seguimiento, Inscripcion } = require("../db");

const router = Router();

// Ruta para mostrar la información de un usuario y la clase que vio
router.get("/seguimiento/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Consulta los seguimientos basados en el userId sin cargar información de Curso
    const userSeguimientos = await Seguimiento.findAll({
      where: { userId: userId },
      attributes: ["duracionEnMinutos"],
    });

    if (!userSeguimientos || userSeguimientos.length === 0) {
      return res.status(404).json({ error: "No se encontraron seguimientos para este usuario" });
    }

    // Formatear la respuesta para enviar solo los datos necesarios
    const formattedData = userSeguimientos.map((seguimiento) => {
      return {
        duracionEnMinutos: seguimiento.duracionEnMinutos,
      };
    });

    res.status(200).json({ message: "Seguimientos encontrados exitosamente", seguimientos: formattedData });
  } catch (error) {
    console.error("Error de Sequelize:", error);
    res.status(500).json({ error: "Hubo un problema al procesar la solicitud" });
  }
});

// ruta para ver cursos inscritos
router.get("/userCourse/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Consulta las inscripciones basadas en el userId
    const userInscripciones = await Inscripcion.findAll({
      where: { userSub: userId },
      attributes: ["inicio", "progreso", "cursoId"],
    });

    if (!userInscripciones || userInscripciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron inscripciones para este usuario" });
    }

    // Formatear la respuesta para enviar solo los datos necesarios
    const formattedData = userInscripciones.map((inscripcion) => {
      return {
        inicio: inscripcion.inicio,
        progreso: inscripcion.progreso,
        cursoId: inscripcion.cursoId,
      };
    });

    res.status(200).json({ message: "Inscripciones encontradas exitosamente", inscripciones: formattedData });
  } catch (error) {
    console.error("Error de Sequelize:", error);
    res.status(500).json({ error: "Hubo un problema al procesar la solicitud" });
  }
});

//Usuarios inscritos en el curso
router.get("/usuariosPorCurso/:cursoId", async (req, res) => {
  try {
    const cursoId = req.params.cursoId;

    // Buscar los usuarios registrados para el curso específico
    const usuariosInscritos = await Inscripcion.findAll({
      where: { cursoId: cursoId },
      attributes: ["userSub"], // Obtener solo la columna userSub
    });

    if (!usuariosInscritos || usuariosInscritos.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios para este curso" });
    }

    // Extraer los userSub de los resultados
    const usersInCurso = usuariosInscritos.map((inscripcion) => inscripcion.userSub);

    res.setHeader("Content-Type", "application/json"); // Configurar encabezado JSON
    res.status(200).json({ usuariosEnCurso: usersInCurso });
  } catch (error) {
    console.error("Error de Sequelize:", error);
    res.status(500).json({ error: "Hubo un problema al procesar la solicitud" });
  }
});

// Nueva ruta para asignar usuario a curso e inscribirlo
router.post("/userCourse", async (req, res) => {
  try {
    const { userId, cursoId } = req.body;

    // Verificar si el usuario y el curso existen en la base de datos
    const user = await User.findByPk(userId);
    const curso = await Curso.findByPk(cursoId);

    if (!user || !curso) {
      return res.status(400).json({ error: "Usuario o curso no encontrado" });
    }

    // Obtener o calcular el valor de duracionEnMinutos (puedes ajustar esto según tus necesidades)
    const duracionEnMinutos = 60; // Por ejemplo, establecer un valor predeterminado

    // Crear una entrada en la tabla Seguimiento para representar la relación
    const seguimiento = await Seguimiento.create({
      userId: userId,
      cursoId: cursoId,
      duracionEnMinutos: duracionEnMinutos,
      userSub: userId,
    });

    // Crear una entrada en la tabla Inscripcions para representar la inscripción
    const inscripcion = await Inscripcion.create({
      inicio: new Date().toISOString(),
      progreso: 0, // Puedes ajustar esto según tus necesidades
      userSub: userId,
      cursoId: cursoId,
      // Puedes agregar más campos según sea necesario
    });

    // Responder con un mensaje de éxito.
    res.status(200).json({ message: "Usuario asignado al curso e inscrito con éxito", seguimiento, inscripcion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;