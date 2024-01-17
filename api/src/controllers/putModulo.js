const { Modulo } = require("../db");

const updatedModulo = async (id, { titulo, contenido, descripcion }) => {
  if (!id) {
    throw new Error("Debe proporcionar un ID valido");
  }

  if (!titulo && !contenido && !descripcion) {
    throw new Error(
      "Debe proporcionar al menos un parametro para modificar el Modulo"
    );
  }

  const modulo = await Modulo.findByPk(id);

  if (!modulo) {
    throw new Error(`El modulo con el ID ${id} no existe`);
  }

  if (titulo) modulo.titulo = titulo;
  if (contenido) modulo.contenido = contenido;
  if (descripcion) modulo.descripcion = descripcion;

  await modulo.save();

  return modulo;
};

module.exports = { updatedModulo };
