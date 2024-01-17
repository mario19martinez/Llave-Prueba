const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "clases",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.TEXT,
        // allowNull: false,
      },
      pdfURL: {
        type: DataTypes.TEXT, // Almacena la URL del archivo de PDF
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    { timestamps: false }
  );
};
