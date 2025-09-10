const db = require('../data/database');

// Controlador para manejar usuarios
const userController = {
    // Iniciar sesión
    login: (req, res) => {
        const { username, password } = req.body;

        const user = db.findUser(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        return res.json({ 
            message: 'Login exitoso', 
            user 
        });
    },

    // Crear un nuevo usuario
    createUser: (req, res) => {
        const { username, password, role, name } = req.body;

        try {
            const newUser = db.createUser(username, password, role, name);
            return res.status(201).json({
                message: 'Usuario creado correctamente',
                user: newUser
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Listar todos los usuarios
    getUsers: (req, res) => {
        return res.json(db.getAllUsers ? db.getAllUsers() : []); 
        // Si quieres, podemos agregar la función getAllUsers en database.js
    }
};

module.exports = userController;