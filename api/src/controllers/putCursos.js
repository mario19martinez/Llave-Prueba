const { Curso } = require("../db");

const updatedCourse = async (id, { name, image, duracion, nivel, costo, fechaInicio, fechaFinalizacion }) => {
  if (!id) {
    throw new Error("Debe proporcionar un ID valido");
  }

  if (!name && !image && !duracion && !nivel && !costo && !fechaInicio && !fechaFinalizacion) {
    throw new Error(
      "Debe proporcionar al menos un parametro para modificar el curso"
    );
  }

  const course = await Curso.findByPk(id);

  if (!course) {
    throw new Error(`El curso con el ID ${id} no existe`);
  }

  if (name) course.name = name;
  if (image) course.image = image;
  if (duracion) course.duracion = duracion;
  if (nivel) course.nivel = nivel;
  if (costo) course.costo = costo;
  if (fechaInicio) course.fechaInicio = fechaInicio;
  if (fechaFinalizacion) course.fechaFinalizacion = fechaFinalizacion;

  await course.save();

  return course;
};

module.exports = {updatedCourse};