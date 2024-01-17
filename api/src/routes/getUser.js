const { Router } = require("express");
const { User } = require("../db");
const { updateUser } = require("../controllers/putUser");
const verifyRol = require("../controllers/verifyRol");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = Router();

// Aca esta el POST para el usuario cuando se registre
router.post("/user", async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const {
      name,
      last_name,
      image,
      identificacion,
      email,
      contraseña,
      telefono,
      pais,
    } = req.body;

    // Asignar la identificación como valor de 'sub'
    const sub = identificacion;

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear un nuevo usuario en la base de datos con la contraseña hasheada
    const newUser = await User.create({
      sub,
      name,
      last_name,
      image,
      identificacion,
      email,
      contraseña: hashedPassword,
      telefono,
      pais,
    });

    // Generar un token para el nuevo usuario
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "12h", // Cambiar la expiración del token a 12 horas
    });

    // Asignar el token al usuario recién registrado
    newUser.token = token;
    newUser.tokenExpiration = new Date(
      new Date().getTime() + 12 * 60 * 60 * 1000
    ); // Expire en 12 horas

    await newUser.save(); // Guardar los cambios en la base de datos

    res.status(201).json({
      message: "Estudiante registrado exitosamente",
      user: newUser,
      token, // Devolver el token en la respuesta
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Ruta POST para el inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Actualizar el token y la expiración en la base de datos
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "12h", // Cambiar la expiración del token a 12 horas
    });

    // Actualizar el token y la expiración en la base de datos
    user.token = token;
    user.tokenExpiration = new Date(new Date().getTime() + 12 * 60 * 60 * 1000); // Expire en 12 horas

    await user.save(); // Guardar los cambios en la base de datos

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ message: "Error al iniciar sesión. Verifica tus datos" });
  }
});

// Ruta PUT para banear/desbanear un usuario por su ID
router.put("/user/ban/:identificacion", async (req, res) => {
  try {
    const identificacion = req.params.identificacion;

    // Encuentra al usuario por su identificación en la base de datos
    const user = await User.findOne({ where: { identificacion } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el estado de ban del usuario
    user.banned = !user.banned; // Si está baneado, lo desbanea; si no, lo banea

    // Guarda los cambios en la base de datos
    await user.save();

    res.status(200).json({ message: `Usuario ${user.banned ? 'baneado' : 'desbaneado'} correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Ruta PUT para actualizar datos del usuario (incluyendo la contraseña)
router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    if (userData.contraseña) {
      // Si se proporciona una nueva contraseña, hasheala antes de guardarla
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);
      userData.contraseña = hashedPassword;
    }

    const updatedUser = await updateUser(id, userData);

    res.status(202).json({
      mensaje: "Datos del usuario actualizados con éxito",
      user: updatedUser,
    });
  } catch (error) {
    res.status(304).send({ error: error.message });
  }
});

// Ruta GET para los estudantes.
router.get("/user", async (req, res) => {
  const name = req.query.name;
  try {
    let totalUsers;

    if (name) {
      totalUsers = await User.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
          deleted: false,
        },
      });
    } else {
      totalUsers = await User.findAll({
        where: {
          deleted: false,
        },
      });
    }
    res.status(200).json(totalUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET para obtener informacion de un usuario por su identificacion.
router.get("/user/:identificacion", async (req, res) => {
  try {
    const identificacion = req.params.identificacion;
    const user = await User.findOne({
      where: { identificacion },
      attributes: { exclude: ["contraseña"] },

      // Excluye la contraseña de la respuesta
    });

    if (user) {
      // Opcional: Puedes establecer la contraseña como null o eliminarla
      user.contraseña = null;

      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// Ruta GET para obtener información de un usuario por su correo electrónico.
router.get("/user/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["contraseña"] },
    });

    if (user) {
      user.contraseña = null;

      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// Ruta para verificar el rol del usuario
router.get("/rol/:sub", async (req, res) => {
  const { sub } = req.params;

  try {
    // Utiliza la funcion verifyRol para obtener el rol del usuario
    const rol = await verifyRol(sub);

    // Envia la respuesta con el rol del usuario
    res.json({ rol });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
