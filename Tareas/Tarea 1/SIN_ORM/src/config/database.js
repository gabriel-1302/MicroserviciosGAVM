// Importamos el paquete 'mysql2' para interactuar con MySQL.
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para async/await

// Importamos 'dotenv' para cargar las variables de entorno desde el archivo .env.
require('dotenv').config();

// Creamos una nueva instancia de Pool, que gestionará las conexiones a la base de datos MySQL.
// La configuración se toma de las variables de entorno.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306, // Puerto por defecto de MySQL es 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportamos el pool para que pueda ser utilizado en otras partes de la aplicación (como en los modelos).
module.exports = pool;