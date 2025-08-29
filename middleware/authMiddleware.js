// backend/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verificamos que la cabecera exista y tenga el formato "Bearer [token]"
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Extraemos solo el token

        // Aquí iría la validación real del token JWT.
        // Por ahora, simulamos que cualquier token es bueno.
        console.log('Token válido recibido:', token);
        next();
    } else {
        console.log('Acceso denegado: Cabecera de autorización ausente o mal formada.');
        res.status(401).json({ message: 'Acceso no autorizado. Se requiere token.' });
    }
};

module.exports = authMiddleware;