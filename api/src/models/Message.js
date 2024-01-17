const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "message",
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
      senderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.UUID,
        allowNull: false,
      }
    },
    { timestamps: true }
  );
};
