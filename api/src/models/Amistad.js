const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "amistad",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      amigoId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      senderId: {
        type: DataTypes.STRING, // Puedes ajustar el tipo de dato segun tu necesidad
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
