// backend/data/database.js
const { v4: uuidv4 } = require("uuid"); // ✅ asegúrate de importar uuid

// Este objeto simula nuestra base de datos.
const db = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "Admin",
      name: "Administrador General",
    },
    {
      id: 2,
      username: "supervisor1",
      password: "super123",
      role: "Supervisor",
      name: "Supervisor Uno",
    },
    {
      id: 3,
      username: "vendedor1",
      password: "vende123",
      role: "Vendedor",
      name: "Vendedor Principal",
    },
  ],
  tickets: [],
  numberAvailability: Array.from({ length: 100 }, (_, i) => ({
    number: i.toString().padStart(2, "0"),
    availableAmount: 10000,
  })),
};

let nextTicketId = 1;
let nextUserId = db.users.length + 1; // ✅ Inicializamos el contador de usuarios

// Exportamos funciones para interactuar con la "base de datos"
module.exports = {
  findUser: (username, password) => {
    return db.users.find(
      (u) => u.username === username && u.password === password
    );
  },

  getAllNumbers: () => {
    return db.numberAvailability;
  },

  getTicketHistory: () => {
    return [...db.tickets].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  // Crear un nuevo usuario
  createUser: (username, password, role, name) => {
    const existingUser = db.users.find((u) => u.username === username);
    if (existingUser) {
      throw new Error(`El usuario "${username}" ya existe.`);
    }

    const newUser = {
      id: nextUserId++,
      username,
      password, // ⚠️ En un caso real debería encriptarse con bcrypt
      role,
      name,
    };

    db.users.push(newUser);
    return newUser;
  },

  // Crear un nuevo ticket con transacción
  createTicketTransaction: (customerName, customerPhone, plays, user) => {
    // 1. Validar jugadas
    for (const play of plays) {
      const numberState = db.numberAvailability.find(
        (n) => n.number === play.number
      );
      if (!numberState || play.amount > numberState.availableAmount) {
        throw new Error(
          `No hay monto suficiente para el número ${play.number}. Disponible: ${numberState?.availableAmount || 0}`
        );
      }
    }

    // 2. Restar montos
    for (const play of plays) {
      const numberState = db.numberAvailability.find(
        (n) => n.number === play.number
      );
      numberState.availableAmount -= play.amount;
    }

    // 3. Crear boleta
    const newTicket = {
      id: `BOLETA-${uuidv4()}`,
      customerName,
      customerPhone, // ✅ nuevo campo para almacenar el celular del cliente
      plays,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      createdAt: new Date().toISOString(),
    };

    db.tickets.push(newTicket);
    return newTicket;
  },
};
