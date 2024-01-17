const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "testimonios",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      video: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          is: /^[\w-]{11}$/, // Validacion de la url
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
