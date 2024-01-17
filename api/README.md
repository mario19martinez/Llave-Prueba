
Llave Para Las Naciones - Documentación de la API
-
 
 -1. Modelo Users
-
	Sub, Indentificacion, Nombre, Apellido, Imagen, Email, Contraseña, Telefono, Pais, Rol, Banned, Deleted

* Rutas

	GET, http://localhost:3001/user para ver todos los usuarios.

	GET, http://localhost:3001/user/:identificacion para buscar un usuario por su identificacion.
	
    POST, http://localhost:3001/user para crear un usuario
	
    PUT, http://localhost:3001/user/:id para modificar informacion de un usuario
	
    PUT, http://localhost:3001/user/ban/:identificacion para banear un suario por su identificacion
	
    DELETE, http://localhost:3001/:identificacion para eliminar un usuario por su identificacion

    GET, http://localhost:3001/rol/:sub Ruta para verificar el rol del usuario

    PUT, http://localhost:3001/rol/:sub Ruta en la que el admin puede cambiar el rol de un usuario


-2. Modelo de Cursos
-

	Name, Imagen, Certificado, Duracion, Nivel, Costo

* Rutas

	GET, http://localhost:3001/cursos para ver los cursos
	
    POST, http://localhost:3001/newCurso para crear un nuevo curso
	
    PUT, http://localhost:3001/newCurso/:id para modificar un curso
	
    PUT, http://localhost:3001/cursos/:id para eliminar de forma logica un curso
	
    DELETE, http://localhost:3001/curso/:id para eliminar un curso

-3. Modelo de Inscripcion
-
    Inicio, Progreso

* Rutas

	GET, http://localhost:3001/inscritos para ver los inscritos
	
    POST, http://localhost:3001/inscripcion para crear una inscripcion
	
    PUT, http://localhost:3001/inscripciones/:id para modificar una inscripcion

-4. Modelo para los Modulos
-
    Titulo, Contenido, Descripcion, Activo

* Rutas
	
    GET, http://localhost:3001/modulos para obtener todos los modulos
	
    POST, http://localhost:3001/modulos para crear un nuevo modulo
	
    PUT, http://localhost:3001/modulos/:id para modificar un modulo
	
    DELETE, http://localhost:3001/modulos/:id para implementar el borrado logico de un modulo

-5. Modelo de Comentarios
-	
    Message, Date, Deleted


- Rutas

	GET, http://localhost:3001/:id/comentarios para obtener todos los comentarios
	
    POST, http://localhost:3001/:id/comentarios para agregar un comentario
	
    PUT, http://localhost:3001/:id para modificar un comentario
	
    DELETE, http://localhost:3001/comentarios/:id para eleiminar comentarios
    

-6. Modelo de Seguimiento
-

    userId, cursoId, duracionEnMinutos

- Rutas

    GET, http://localhost:3001/seguimiento/:userId Consulta la informacion del usuario y la clase que vio