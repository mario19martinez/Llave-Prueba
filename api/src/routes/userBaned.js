const { Router } = require("express");
const { User } = require("../db");

const router = Router();

// Ruta PUT para banear usuario por su identificacion.
router.put("/user/ban/:identificacion", async (req, res) => {
  const identificacion = req.params.identificacion;

  try {
    // Busca al usuario por su identificacion.
    const user = await User.findOne({
      where: {
        identificacion: identificacion,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica que el usuario no sea null antes de establecer la propiedad "banned".
    if (user) {
      // Si el usuario ya esta baneado, desbanea al usuario.
      if (user.banned) {
        user.banned = false;
        await user.save();
        res.status(200).json({ message: "Usuario Desbaneado con exito" });
      } else {
        // Marca al usuario como baneado.
        user.banned = true;
        await user.save();

        res.status(200).json({ message: "Usuario baneado con exito" });
      }
    }
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta DELETE para eliminar un usuario por su identificacion.
router.delete("/user/deleted/:identificacion", async (req, res) => {
  const { identificacion } = req.params;

  try {
    // Busca al usuario por su identificacion
    const user = await User.findOne({
      where: {
        identificacion: identificacion,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Marca al Usuario como eliminado de forma logica
    user.deleted = true;
    await user.save();

    return res.status(200).json({ message: "Usuario eliminado con exito" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta GET para obtener todos los usuarios eliminados
router.get("/eliminados", async (req, res) => {
  try {
    const usuariosEliminados = await User.findAll({
      where: {
        deleted: true,
      },
    });
    res.status(200).json(usuariosEliminados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para restaurar un usuario eliminado en caso de ser necesario
router.put("/restore/:identificacion", async (req, res) => {
  const { identificacion } = req.params;

  try {
    // Busca al usuario por su identificacion y verifica si esta marcado como eliminado
    const user = await User.findOne({
      where: {
        identificacion: identificacion,
        deleted: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o no esta eliminado" });
    }

    // Restaura al usuario cambiando el valor de la propiedad deleted a false
    user.deleted = false;
    await user.save();

    return res.status(200).json({ message: "Usuario restaurado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
