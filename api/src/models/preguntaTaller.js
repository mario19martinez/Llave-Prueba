const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PreguntaTaller = sequelize.define('preguntaTaller', {
    enunciado: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('abierta', 'seleccionUnica'),
      allowNull: false,
    },
    respuestaCorrecta: {
      type: DataTypes.STRING,
      allowNull: true, // Puede ser nulo para preguntas abiertas
    },
    respondidaCorrectamente: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  PreguntaTaller.associate = (models) => {
    PreguntaTaller.belongsTo(models.Taller);
    PreguntaTaller.belongsToMany(models.User, { through: 'RespuestaUsuario' });
  };

  return PreguntaTaller;
};
