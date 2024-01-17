const { User, Curso, Seguimiento } = require("../db");

const cursosDelUsuario = async (req, res) => {
  const id = req.id; // Asegurate de tener el ID del usuario desde la sesion o el token

  try {
    // Busca los cursos asociados al usuario actual a traves de la tabla de seguimiento
    const cursoDeUsuario = await User.findByPk(id, {
      include: [
        {
          model: Curso,
          through: Seguimiento,
        },
      ],
    });

    // Envia la lista de cursos al frontend para mostrar en el dashboard del usuario
    res.status(200).json({ cursos: cursosDelUsuario.Cursos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { cursosDelUsuario };
