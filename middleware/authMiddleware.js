const jwt = require("jsonwebtoken");

// backend/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Verificamos que la cabecera exista y tenga el formato "Bearer [token]"
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extraemos solo el token

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
      // Si hay un error (token expirado, firma inválida), enviamos 403 (Prohibido)
      if (err) {
        console.error("Error de verificación de token:", err.message);
        return res.sendStatus(403);
      }

      // console.log("DECODE", decodedPayload);

      req.body.token_user = decodedPayload;
      next();
    });

    // Aquí iría la validación real del token JWT.
    // Por ahora, simulamos que cualquier token es bueno.
    // console.log("Token válido recibido:", token);
    // next();
  } else {
    console.log(
      "Acceso denegado: Cabecera de autorización ausente o mal formada."
    );
    res
      .status(401)
      .json({ message: "Acceso no autorizado. Se requiere token." });
  }
};

module.exports = authMiddleware;
