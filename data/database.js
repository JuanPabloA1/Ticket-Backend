// backend/data/database.js

// Este objeto simula nuestra base de datos.
const db = {
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'Administrador General' },
        { id: 2, username: 'supervisor1', password: 'super123', role: 'Supervisor', name: 'Supervisor Uno' },
        { id: 3, username: 'vendedor1', password: 'vende123', role: 'Vendedor', name: 'Vendedor Principal' }
    ],
    tickets: [],
    numberAvailability: Array.from({ length: 100 }, (_, i) => ({
        number: i.toString().padStart(2, '0'),
        availableAmount: 10000
    }))
};

let nextTicketId = 1;

// Exportamos funciones para interactuar con la "base de datos"
module.exports = {
    findUser: (username, password) => {
        return db.users.find(u => u.username === username && u.password === password);
    },
    
    getAllNumbers: () => {
        return db.numberAvailability;
    },

    getTicketHistory: () => {
        return [...db.tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Esta función simula una transacción para crear una boleta.
    createTicketTransaction: (customerName, plays) => {
        // 1. Validar cada jugada antes de hacer cambios
        for (const play of plays) {
            const numberState = db.numberAvailability.find(n => n.number === play.number);
            if (!numberState || play.amount > numberState.availableAmount) {
                // Si una jugada falla, revertimos todo y lanzamos un error.
                throw new Error(`No hay monto suficiente para el número ${play.number}. Disponible: ${numberState.availableAmount}`);
            }
        }

        // 2. Si todas las validaciones pasan, aplicamos los cambios.
        for (const play of plays) {
            const numberState = db.numberAvailability.find(n => n.number === play.number);
            numberState.availableAmount -= play.amount;
        }

        // 3. Creamos y guardamos la boleta.
        const newTicket = {
            id: `BOLETA-${nextTicketId++}`,
            customerName,
            plays,
            createdAt: new Date().toISOString()
        };
        db.tickets.push(newTicket);
        
        return newTicket; // Devolvemos la boleta creada.
    }
};