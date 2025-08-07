import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import agendaRoutes from "./routes/agendaRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Rutas de la API
app.use("/api", agendaRoutes);

// Servir archivos estáticos del frontend
app.use(express.static("../frontend/public"));

// Inicializar la conexión a la base de datos y el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.error("Error al conectar a la base de datos:", error));
