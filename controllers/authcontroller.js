const db = require('../data/database');
const jwt = require('jsonwebtoken'); // <-- 1. Importamos la nueva herramienta

// 2. Creamos una "llave secreta". ¡Debe ser secreta y más compleja en producción!
const JWT_SECRET = process.env.JWT_SECRET;

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
    }

    const user = db.findUser(username, password);

    if (user) {
        // 3. Creamos el "payload": la información que irá DENTRO del token.
        // ¡Nunca guardes la contraseña aquí!
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role 
        };

        // 4. Creamos el token real.
        // Le damos el payload, nuestra llave secreta y una fecha de expiración.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' }); // El token será válido por 8 horas

        res.status(200).json({ 
            message: 'Login exitoso', 
            user: {
                name: user.name,
                role: user.role
            },
            token: token // <-- 5. Enviamos el nuevo token real al frontend
        });

    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
};

module.exports = {
    login
};