// 1. Importar dependencias
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { verificarDisponibilidadVehiculo } = require('./grpcClient');

// 2. Configuración inicial
const app = express();
app.use(cors());
app.use(express.json());

// 3. Conexión a la Base de Datos MySQL
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 4. Cargar el Schema de GraphQL desde el archivo .graphql
const schemaString = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
const schema = buildSchema(schemaString);

// 5. Implementar los "Resolvers"
// Estas son las funciones que se ejecutan cuando se llama a una query o mutación
const root = {
    // Resolver para la query "envios"
    envios: async () => {
        const [rows] = await dbPool.query('SELECT * FROM envios');
        return rows;
    },

    // Resolver para la query "envio"
    envio: async ({ id }) => {
        const [rows] = await dbPool.query('SELECT * FROM envios WHERE id = ?', [id]);
        return rows[0];
    },

    // Resolver para la mutación "crearEnvio"
    crearEnvio: async ({ input }) => {
        const { usuario_id, vehiculo_id, origen, destino, estado } = input;

        // --- INICIO DE LA INTEGRACIÓN gRPC ---
        try {
            const disponible = await verificarDisponibilidadVehiculo(vehiculo_id);
            if (!disponible) {
                // Lanzamos un error que GraphQL entenderá y enviará al cliente
                throw new Error(`El vehículo con ID ${vehiculo_id} no está disponible.`);
            }
        } catch (error) {
            // Si hay un error de comunicación con el servicio de vehículos, tampoco continuamos.
            throw new Error(error.message || 'No se pudo verificar la disponibilidad del vehículo.');
        }
        // --- FIN DE LA INTEGRACIÓN gRPC ---

        const sql = 'INSERT INTO envios (usuario_id, vehiculo_id, origen, destino, estado) VALUES (?, ?, ?, ?, ?)';
        const [result] = await dbPool.query(sql, [usuario_id, vehiculo_id, origen, destino, estado]);
        
        // Devolvemos el objeto recién creado
        return {
            id: result.insertId,
            ...input
        };
    },

    // Resolver para la mutación "actualizarEnvio"
    actualizarEnvio: async ({ id, input }) => {
        const { usuario_id, vehiculo_id, origen, destino, estado } = input;
        const sql = 'UPDATE envios SET usuario_id = ?, vehiculo_id = ?, origen = ?, destino = ?, estado = ? WHERE id = ?';
        await dbPool.query(sql, [usuario_id, vehiculo_id, origen, destino, estado, id]);
        
        // Devolvemos el objeto actualizado
        return {
            id: id,
            ...input
        };
    },

    // Resolver para la mutación "eliminarEnvio"
    eliminarEnvio: async ({ id }) => {
        await dbPool.query('DELETE FROM envios WHERE id = ?', [id]);
        return `Envío con ID ${id} eliminado correctamente.`;
    }
};

// 6. Configurar el endpoint de GraphQL
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Habilita una interfaz gráfica en el navegador para probar la API
}));

// 7. Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor GraphQL de Envíos corriendo en http://localhost:${PORT}/graphql`);
});
