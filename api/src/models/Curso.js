const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('curso', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            //defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
        },
        certificacion: {
            type: DataTypes.BOOLEAN, // Puede ser true o false
            defaultValue: false, // Valor por defecto es falso
        },
        duracion: {
            type: DataTypes.STRING, // Puede ser un valor numérico de duración en minutos, por ejemplo
            allowNull: true, // Puede ser nulo si la duración no se conoce
        },
        nivel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        costo: {
            type: DataTypes.DECIMAL(10, 2), // Puede ser un valor decimal con 10 dígitos en total y 2 decimales
            allowNull: true,
            defaultValue: 0.00, // Valor por defecto
        },
        fechaInicio : {
            type: DataTypes.DATEONLY,
            //allowNull: true, // Puede ser nulo si la fecha de inicio no se conoce
        },
        fechaFinalizacion : {
            type: DataTypes.DATEONLY,
            //allowNull: true, // Puede ser nulo si la fecha de finalizacion no se conoce
        },
        deletedAt: {
            type: DataTypes.BOOLEAN, // Campo para el borrado lógico
            defaultValue: false,
        },
    },
    {timestamps: false});
};