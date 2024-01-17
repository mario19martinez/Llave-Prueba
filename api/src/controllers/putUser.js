const { User } = require("../db");

const updateUser = async (
  id,
  { name, last_name, identificacion, image, email, contraseña, telefono, pais }
) => {
  if (!id) {
    throw new Error("Debes proporcionar un ID valido");
  }

  if (
    !name &&
    !last_name &&
    !identificacion &&
    !image &&
    !email &&
    !contraseña &&
    !telefono &&
    !pais
  ) {
    throw new Error("Debes proporcionar al menos un parametro");
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new Error(`El curso con el ID ${id} no existe`);
  }

  if (name) user.name = name;
  if (last_name) user.last_name = last_name;
  if (identificacion) user.identificacion = identificacion;
  if (image) user.image = image;
  if (email) user.email = email;
  if (contraseña) user.contraseña = contraseña;
  if (telefono) user.telefono = telefono;
  if (pais) user.pais = pais;

  await user.save();

  return user;
};

module.exports = { updateUser };
