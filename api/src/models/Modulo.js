const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('modulo', {
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
        contenido: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Por defecto, un módulo está activo
        },
    },
    {timestamps: false});
};