const { DataTypes } = require('sequelize');
const InscripcionModel = require('../../src/models/Inscripcion')

it('define atributos validos para el modelo', () => {
    const sequelizeMock = {
        define:jest.fn()
    };

    InscripcionModel(sequelizeMock);

    expect(sequelizeMock.define).toHaveBeenCalledWith('inscripcion', {
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
    }, {timestamps: false});
});