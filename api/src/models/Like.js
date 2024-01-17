const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "like",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      // Agregar relaciones con otros modelos
      associate: (models) => {
        const { User, Post } = models;
        Like.belongsTo(User); // Relación con User
        Like.belongsTo(Post); // Relación con Post
      },
    }
  );
};
