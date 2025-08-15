const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('La base de datos no está inicializada. Llama a connectDB primero.');
    }
    return db;
}

module.exports = { connectDB, getDB };
