const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('About', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};

