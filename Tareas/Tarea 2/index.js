require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/database/connection');
const agendaRoutes = require('./src/routes/agenda.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('src/public')); // Servir archivos estáticos para el frontend

// Rutas de la API
app.use('/api', agendaRoutes);

// Iniciar servidor y conectar a la BD
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Fallo al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
