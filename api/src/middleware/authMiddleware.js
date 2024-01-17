const jwt = require('jsonwebtoken');
const { User } = require("../db");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado - Token no proporcionado' });
  }

  try {
    const user = await User.findOne({ where: { token: token.split(" ")[1] } }); // Buscar al usuario por el token

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Almacenar los datos del usuario en el objeto de solicitud para uso posterior si es necesario
    req.user = user;

    next(); // Continuar con la siguiente función middleware o controlador
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Acceso no autorizado - Token inválido' });
  }
};

module.exports = { verifyToken };