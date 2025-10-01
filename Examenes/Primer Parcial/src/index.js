
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database.js';
import trabajadorRoutes from './routes/trabajador.routes.js';

// Inicialización
dotenv.config();
const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API de Trabajadores');
});
app.use('/api/trabajadores', trabajadorRoutes);

// Iniciar Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`>>> Servidor corriendo en el puerto ${PORT}`);
});
