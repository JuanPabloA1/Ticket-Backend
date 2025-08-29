function initSsr(app, express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ruta a la carpeta dist de Angular
  const angularDistPath = path.join(
    __dirname,
    "...",
    "frontend",
    "public",
    "browser"
  );

  // Servir archivos estáticos
  app.use(express.static(angularDistPath));

  // Para manejar rutas de Angular (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(angularDistPath, "index.html"));
  });
}

module.exports = initSsr;