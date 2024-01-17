const { DataTypes } = require('sequelize');
const Comentario = require('../../src/models/Comentario');

it('define atributos validos para el modelo Comentario', () => {
    const sequelizeMock = {
        define:jest.fn()
    };

     Comentario(sequelizeMock);

     expect(sequelizeMock.define).toHaveBeenCalledWith('comentario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        texto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: expect.any(Function),
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
     },
     {timestamps: false});
});