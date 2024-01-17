const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, // Para contenido largo
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING, // Para guardar la URL de la imagen
        allowNull: true, // Puede ser nula si no se proporciona
      },
      embeddedElement: {
        type: DataTypes.TEXT, // Para guardar el elemento incrustado
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
