const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comentario = sequelize.define(
    "comentario",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      texto: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(),
        allowNull: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );
  return Comentario;
};
