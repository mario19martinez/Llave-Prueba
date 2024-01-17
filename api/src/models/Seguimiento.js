const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("seguimiento", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duracionEnMinutos: {
      type: DataTypes.INTEGER,
      //allowNull: false,
    },
  });
};
