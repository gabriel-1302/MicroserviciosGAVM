require("reflect-metadata");
const { DataSource } = require("typeorm");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

// Usamos la configuración que ya tenías en tu index.js
const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql_practica",
    synchronize: true,
    logging: false,
    entities: [Mesa, Padron]
});

module.exports = { AppDataSource };
