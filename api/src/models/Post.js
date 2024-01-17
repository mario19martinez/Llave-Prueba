const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
