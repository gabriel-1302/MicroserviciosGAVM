const { MongoClient } = require('mongodb');

const uri = 'mongodb://172.20.0.2:27017';
const dbName = 'agendaDB';

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