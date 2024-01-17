const { DataTypes } = require('sequelize');
const Modulo = require('../../src/models/Modulo');

it('define atributos validos para el modelo Modulo', () => {
    const sequelizeMock = {
        define:jest.fn()
    };

    Modulo(sequelizeMock);

    expect(sequelizeMock.define).toHaveBeenCalledWith('modulo', {
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
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {timestamps: false});
});