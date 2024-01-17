const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('taller', {
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
        descripcion: {
            type: DataTypes.TEXT,
        },
        fechaInicio: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        fechaFinalizacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        duracionHoras: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cupoMaximo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // Otros campos relevantes para el taller...
        deletedAt: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { timestamps: false });
};
