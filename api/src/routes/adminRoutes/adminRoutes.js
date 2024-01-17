const { Router } = require("express");
const { User } = require("../../db");
const { Op } = require('sequelize');

const router = Router();

// Ruta PUT para cambiar el Rol de un usuario.
router.put('/rol/:sub', async(req, res) => {
    try{
        const { sub } = req.params;
        const { newRole } = req.body;

        if (!['admin', 'docente', 'client'].includes(newRole)) {
            return res.status(400).json({ message: 'Rol no valido' })
        }

        const user = await User.findOne({where: {sub}});
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado'})
        }

        user.rol = newRole;
        await user.save();

        return res.status(200).json({ message: 'Rol actualizado exitosamente'})
    } catch(error) {
        return res.status(500).json({message: 'Error interno de servidor'})
    }
})


// Ruta GET para traer los usuarios y sus roles
router.get("/usuarios", async(req, res) => {
    try{
        const usuarios = await User.findAll(); // Obtengo todos los usuarios de la base de datos
        const usuariosConRoles = usuarios.map(usuario => {
            return {
                sub: usuario.sub,
                name: usuario.name,
                last_name: usuario.last_name,
                rol: usuario.rol
            }
        })
        return res.status(200).json(usuariosConRoles);
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
})


module.exports = router;
