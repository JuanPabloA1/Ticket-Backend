// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // <-- ¡AÑADE ESTA LÍNEA!
// const initSsr = require('./ssr');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const printRoutes = require('./routes/print');

// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// --- ¡NUEVA SECCIÓN! ---
// Servir los archivos estáticos de la aplicación de Angular
// app.use(express.static(path.join(__dirname, '../public')));
// initSsr(app, express);
//   const __dirname = path.dirname(__filename);

  // Ruta a la carpeta dist de Angular
//   const angularDistPath = path.join(
//     __dirname,
//     "..",
//     "public",
//     "browser"
//   );

//   // Servir archivos estáticos
//   console.log('dfadsfdasfdasfadsfasdf',angularDistPath);
  
//   app.use(express.static(angularDistPath));

//   // Para manejar rutas de Angular (SPA)
//   app.get("/app", (req, res) => {
//     res.sendFile(path.join(angularDistPath, "index.csr.html"));
//   });
async function setupSSR() {
  // Import dinámico porque Angular Universal está compilado como ESM
  const { ngExpressEngine } = await import("@nguniversal/express-engine");
  const { AppServerModule } = await import(
    path.join(__dirname, "..", "public", "server", "main.js")
  );

  const browserDistPath = path.join(__dirname, "..", "public", "browser");

  // Configurar motor de vistas para SSR
  app.engine("html", ngExpressEngine({ bootstrap: AppServerModule }));
  app.set("view engine", "html");
  app.set("views", browserDistPath);

  // Archivos estáticos de Angular
  app.use(express.static(browserDistPath));

  // SSR fallback (todas las rutas no-API)
  app.get("/app", (req, res) => {
    res.render("index", { req });
  });
}
// --------------------

// Usar las rutas de la API
app.use('/api/print', printRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', ticketRoutes);

// Iniciar el servidor
// app.listen(PORT, () => {
//     // console.log(`✅ Servidor y App corriendo en http://localhost:${PORT}`); 
// });

setupSSR().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server corriendo en http://localhost:${PORT}`);
    console.log(`   API disponible en http://localhost:${PORT}/api`);
  });
});

module.exports = app;