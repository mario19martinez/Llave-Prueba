const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      sub: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      identificacion: {
        type: DataTypes.STRING,
        allowNull: false,
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
        private: true, // Hace que la columna sea privada
      },
      telefono: {
        type: DataTypes.STRING,
      },
      pais: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM("admin", "docente", "client"),
        defaultValue: "client",
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
      token: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser nulo inicialmente
      },
      tokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true, // Puede ser nulo inicialmente
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: (user) => {
          // Genera un UUID automáticamente y asígnalo a 'sub' e 'identificacion'
          const uuid = uuidv4();
          user.sub = uuid;
          user.identificacion = uuid; // Asigna el mismo valor a 'identificacion'
        },
      },
    }
  );
};
