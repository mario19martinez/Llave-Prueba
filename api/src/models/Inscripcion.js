const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('inscripcion', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        inicio: {
            type: DataTypes.STRING,
        },
        progreso: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {timestamps: false});
};