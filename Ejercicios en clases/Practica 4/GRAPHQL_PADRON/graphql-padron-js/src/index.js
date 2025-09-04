const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { AppDataSource } = require("./data-source");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });
    await server.start();
    server.applyMiddleware({ app });
    await AppDataSource.initialize();
    console.log("✅Conectado a la base de datos");
    app.listen(4000, () => {
        console.log(`🚀Servidor listo en http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();
