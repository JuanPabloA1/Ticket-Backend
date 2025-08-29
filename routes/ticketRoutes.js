// backend/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicamos el middleware a todas las rutas de este archivo.
// Cualquier solicitud a /numbers, /tickets, o /history debe pasar primero por authMiddleware.
router.use(authMiddleware);

// GET /api/numbers
router.get('/numbers', ticketController.getNumbers);

// POST /api/tickets
router.post('/tickets', ticketController.createTicket);

// GET /api/history
router.get('/history', ticketController.getHistory);

module.exports = router;