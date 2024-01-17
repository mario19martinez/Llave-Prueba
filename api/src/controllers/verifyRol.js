const { User } = require("../db");

const verifyRol = async (sub) => {
  try {
    // Busca al usuario en la base de datos por su sub
    const user = await User.findOne({
      where: {
        sub: sub,
      },
    });

    if (!user) {
      throw new Error("No se encontro el usuario");
    }

    // Devuelve el rol del usuario
    return user.rol;
  } catch (error) {
    throw error; // Propaga cualquier error encontrado
  }
};

module.exports = { verifyRol };
