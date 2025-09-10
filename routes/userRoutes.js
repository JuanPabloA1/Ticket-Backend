const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

// Rutas de usuarios
router.post('/', userController.createUser);
router.get('/list', userController.getUsers);

module.exports = router;