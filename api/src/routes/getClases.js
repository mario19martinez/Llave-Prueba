const { Router } = require("express");
const multer = require("multer");
const { Curso, Clases } = require("../db");
const path = require("path");
const fs = require("fs")
//const { error } = require("console");
const router = Router();

// Configuracion de 'multer' para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Especifica donde se guardan los archivos temporales
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre del archivo PDF en el servidor
  },
});

const upload = multer({ storage: storage });
//const upload = multer({ dest: 'uploads/'})

// Ruta GET para obtener las clases de un curso por su ID
router.get("/cursos/:cursoId/clases", async (req, res) => {
  try {
    const cursoId = parseInt(req.params.cursoId);
    if (isNaN(cursoId)) {
      return res.status(400).json({ error: "ID del curso no valido" });
    }

    // Buscar el curso por su ID junto con las clases asociadas
    const cursosConClases = await Curso.findOne({
      where: { id: cursoId },
      include: [{ model: Clases }],
    });

    // Si el curso no se encuentra, devolver un error 404
    if (!cursosConClases) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.setHeader("Content-Type", "application/json");
    // Si se encuentra el curso, devolver las clases asociadas
    const clases = cursosConClases.clases; // Obtener las clases del curso usando el alias 'clases'

    return res.status(200).json(clases);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ruta POST para crear nuevas clases en un curso
router.post(
  "/cursos/:cursoId/clases",
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      const cursoId = req.params.cursoId;
      const { name, descripcion, url, platform } = req.body;

      let pdfURL = null;
      if (req.file) {
      pdfURL = req.file.path; // La ruta del archivo PDF en el servidor
    }

      // Verificar si el curso existe
      const cursoExistente = await Curso.findOne({ where: { id: cursoId } });

      if (!cursoExistente) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      //Crear una nueva clase asociada al curso
      const nuevaClase = await Clases.create({
        name,
        descripcion,
        url,
        platform,
        pdfURL, // Puede ser null si no se proporciono un archivo PDF
        cursoId, // Asocia la clase con el curso utilizando el ID del curso
      });

      // Devolver la nueva clase creada en la respuesta
      return res.status(201).json(nuevaClase);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Ruta PUT para modificar una clase en un curso
router.put("/cursos/:cursoId/clases/:claseId", async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const claseId = req.params.claseId;
    const { name, descripcion, url } = req.body;

    // Verificar si el curso existe
    const cursoExistente = await Curso.findOne({ where: { id: cursoId } });

    if (!cursoExistente) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Buscar la clase por si ID y verificar si esta asociada al curso
    const claseExistente = await Clases.findOne({
      where: {
        id: claseId,
        cursoId: cursoId,
      },
    });

    if (!claseExistente) {
      return res
        .status(404)
        .json({ error: "Clase no encontrada en el curso especificado" });
    }

    // Actualizar los datos de la clase
    await Clases.update(
      {
        name,
        descripcion,
        url,
      },
      {
        where: {
          id: claseId,
        },
      }
    );

    // Devolver un mensaje de exito en la respuesta
    return res.status(200).json({ message: "Clase modificada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para borrar una clase de un curso
router.delete("/cursos/:cursoId/clases/:claseId", async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const claseId = req.params.claseId;

    // Verificar si el curso existe
    const cursoExistente = await Curso.findOne({ where: { id: cursoId } });

    if (!cursoExistente) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Buscar la clase por su ID y verificar si esta asociada al curso
    const claseExistente = await Clases.findOne({
      where: {
        id: claseId,
        cursoId: cursoId,
      },
    });

    if (!claseExistente) {
      return res
        .status(404)
        .json({ error: "Clase no encontrada en el curso especificado" });
    }

    // Eliminar la clase de la db
    await Clases.destroy({
      where: {
        id: claseId,
      },
    });

    // Devolver un mensaje de exito en la respuesta
    return res.status(202).json({ message: "Clase eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta GET para obtener los detalles de una clase especifica en un curso especifico
router.get("/cursos/:cursoId/clases/:id", async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const claseId = req.params.id;

    // Verificar si el curso existe
    const cursoExistente = await Curso.findOne({ where: { id: cursoId } });

    if (!cursoExistente) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Buscar la clase por su ID y verificar si esta asociada al curso
    const clase = await Clases.findOne({
      where: {
        id: claseId,
        cursoId: cursoId,
      },
    });

    if (!clase) {
      return res
        .status(400)
        .json({ error: "Clase no encontrada en el curso especificado" });
    }

    // Devolver los detalles de la clase en la respuesta
    return res.status(200).json({
      id: clase.id,
      name: clase.name,
      descripcion: clase.descripcion,
      url: clase.url,
      pdfURL: clase.pdfURL,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


//Ruta GET para ver el Archivo PDF de una clase
router.get("/cursos/:cursoId/clases/:claseId/pdf", async(req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const claseId = req.params.claseId;

    // Buscar la clase por su ID y verificar si esta asociada al curso
    const clase = await Clases.findOne({
      where: {
        id: claseId,
        cursoId: cursoId,
      }
    })

    if (!clase) {
      return res.status(404).json({ error: "Clase no encontrada en el curso especificado" });
    }

    const pdfFilePath = clase.pdfURL;

    console.log("BAck", pdfFilePath)

    // Verificar si el archivo existe
    if (!fs.existsSync(pdfFilePath)) {
      return res.status(404).json({ error: "Archivo PDF no encontrado"});
    }

    res.setHeader('Content-Type', 'application/pdf');

    res.download(pdfFilePath, `${clase.name}.pdf`);
    return res.status(200).json({message: "Archivo", pdfFilePath});
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})


module.exports = router;
