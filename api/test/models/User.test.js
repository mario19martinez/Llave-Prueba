const { DataTypes } = require('sequelize');
const User = require('../../src/models/User')

it('define atributos del modelo User', () => {
    const sequelizeMock = {
        define:jest.fn()
    };

    User(sequelizeMock);

    expect(sequelizeMock.define).toHaveBeenCalledWith('user', {
        sub: {
            type: DataTypes.TEXT,
        },
        identificacion: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
            private: true,
        },
        telefono: {
            type: DataTypes.STRING,
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM('admin', 'client'),
            defaultValue: 'client',
            allowNull: false,
        },
        banned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        timestamps: false
    });
});