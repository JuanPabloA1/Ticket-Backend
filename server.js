// backend/server.js

// 1. Cargar variables de entorno
require('dotenv').config();

// 1. Importar dependencias
const express = require('express');
const cors = require('cors');
const path = require('path');

// 2. Crear la app
const app = express();

// 3. Middlewares
// app.use(cors({
//   origin: 'http://localhost:4200', // ajusta según tu frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

app.use(cors({ origin: '*' }));

// 3. Importar las rutas de la API
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const printRoutes = require('./routes/print');

// 5. Middlewares globales
app.use(cors());
app.use(express.json());

// 6. Rutas de la API
// Todas las rutas de la API deben ir ANTES de servir los archivos de Angular
app.use('/api/auth', authRoutes);
app.use('/api/print', printRoutes);
app.use('/api/users', userRoutes);
app.use('/api', ticketRoutes);

// 7. Servir la aplicación de Angular (Frontend)
// Ruta a la carpeta que contiene el build de Angular
const angularAppPath = path.join(__dirname, '..', 'public');

// Servir los archivos estáticos (js, css, imágenes, etc.)
app.use(express.static(angularAppPath));

// Para cualquier otra ruta que no sea de la API, servir el index.html de Angular.
// Esto es clave para que el enrutamiento de la SPA funcione.
app.get('*', (req, res) => {
  res.sendFile(path.join(angularAppPath, 'index.html'));
});

// 8. Iniciar el servidor (para desarrollo local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});

// 9. Exportar la app para Vercel
module.exports = app;