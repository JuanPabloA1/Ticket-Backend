// backend/controllers/ticketController.js
const db = require('../data/database');
const PDFDocument = require('pdfkit');

const getNumbers = (req, res) => {
    try {
        const numbers = db.getAllNumbers();
        res.status(200).json(numbers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los números.' });
    }
};

const createTicket = (req, res) => {
    const { customerName, plays } = req.body;

    // Validación de entrada
    if (!customerName || !plays || !Array.isArray(plays) || plays.length === 0) {
        return res.status(400).json({ message: 'Datos de la boleta incompletos o incorrectos.' });
    }
    for (const play of plays) {
        if (play.amount < 1000 || play.amount > 10000) {
            return res.status(400).json({ message: `El valor de la jugada para el número ${play.number} debe estar entre 1,000 y 10,000.` });
        }
    }

    try {
        const newTicket = db.createTicketTransaction(customerName, plays);
        res.status(201).json(newTicket);
    } catch (error) {
        // El error vendrá de la "transacción" si algo falla
        res.status(400).json({ message: error.message });
    }
};

const getHistory = (req, res) => {
    try {
        const history = db.getTicketHistory();
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial.' });
    }
};

const printReceipt = async (req, res) => {
    // ... (Esta función no ha cambiado)
};

// --- FUNCIÓN MODIFICADA ---
const generateTicketPDF = (req, res) => {
    const { customerName, plays, total } = req.body;

    if (!plays || plays.length === 0 || !total) {
        return res.status(400).json({ message: 'Datos incompletos para generar el PDF.' });
    }

    // --- CORRECCIÓN APLICADA AQUÍ ---
    // Convertir 48mm a puntos (1 pulgada = 72 puntos, 1 pulgada = 25.4mm)
    const widthInPoints = (48 / 25.4) * 72; // Aproximadamente 136 puntos

    const doc = new PDFDocument({
        size: [widthInPoints, 842], // Ancho de 48mm, altura flexible
        margins: { top: 15, bottom: 15, left: 8, right: 8 } // Márgenes ajustados
    });

    res.setHeader('Content-Disposition', 'attachment; filename=boleta.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    // --- Contenido del PDF reajustado para el nuevo ancho ---

    // Encabezado
    doc.font('Helvetica-Bold').fontSize(10).text('TU RIFA', { align: 'center' });
    doc.fontSize(7).text('Recibo de Venta', { align: 'center' });
    doc.moveDown(0.5);
    const separator = '-----------------------------';
    doc.text(separator, { align: 'center' });
    doc.moveDown();

    // Información del Cliente y Fecha
    doc.font('Helvetica').fontSize(7);
    doc.text(`Cliente: ${customerName || 'N/A'}`);
    doc.text(`Fecha: ${new Date().toLocaleString('es-CO')}`);
    doc.moveDown();

    // Tabla de Jugadas
    doc.font('Helvetica-Bold');
    const tableTop = doc.y;
    doc.text('Número', 10, tableTop);
    doc.text('Valor', widthInPoints - 50, tableTop, { align: 'right' });
    doc.y += 10;
    doc.text(separator, { align: 'center' });
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(8);
    plays.forEach(play => {
        const rowY = doc.y;
        doc.text(play.number, 10, rowY);
        doc.text(`$ ${play.amount.toLocaleString('es-CO')}`, widthInPoints - 60, rowY, { align: 'right' });
        doc.y += 12;
    });

    doc.moveDown(0.5);
    doc.text(separator, { align: 'center' });
    doc.moveDown();

    // Total
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('TOTAL:', 10, doc.y);
    doc.text(`$ ${total.toLocaleString('es-CO')}`, widthInPoints - 70, doc.y, { align: 'right' });
    doc.moveDown(2);

    // Pie de página
    doc.font('Helvetica').fontSize(7);
    doc.text('¡Gracias por su compra!', { align: 'center' });
    doc.text('Conserve este tiquete.', { align: 'center' });

    doc.end();
};


module.exports = {
    getNumbers,
    getHistory,
    createTicket,
    printReceipt, // Mantengo esta por si la usas, no fue modificada
    generateTicketPDF
};