const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
