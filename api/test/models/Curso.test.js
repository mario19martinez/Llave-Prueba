const { DataTypes } = require('sequelize');
const CursoModel = require('../../src/models/Curso');

it('define atributos validos para el modelo Curso', () => {
    const sequelizeMock = {
        define:jest.fn()
    };

    CursoModel(sequelizeMock);

    expect(sequelizeMock.define).toHaveBeenCalledWith('curso', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull:false,
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
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        duracion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nivel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        costo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: false
    });
});