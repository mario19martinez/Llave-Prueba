const { Op } = require("sequelize");
const { User } = require("../db");

// Lógica para limpiar el token después de cierto tiempo
const cleanExpiredTokens = async () => {
  try {
    const users = await User.findAll({ 
      where: { tokenExpiration: { [Op.lt]: new Date() } } 
    });

    users.forEach(async (user) => {
      user.token = null;
      user.tokenExpiration = null;
      await user.save();
    });

    console.log("Tokens expirados limpiados.");
  } catch (error) {
    console.error("Error al limpiar tokens expirados:", error);
  }
};

module.exports = cleanExpiredTokens;
