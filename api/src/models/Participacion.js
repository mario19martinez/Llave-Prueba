const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('participacion', {
    // Define las columnas necesarias para esta tabla intermedia
    // Por ejemplo, podrías tener userId y tallerId para establecer las relaciones
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tallerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};