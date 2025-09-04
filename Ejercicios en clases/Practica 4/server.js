const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  // Crear la aplicación Express
  const app = express();
  
  // Crear el servidor Apollo GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Habilitar GraphQL Playground en desarrollo
    introspection: true,
    playground: true,
    // Formatear errores para mejor debugging
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    }
  });

  // Iniciar el servidor Apollo
  await server.start();
  
  // Aplicar el middleware de Apollo al app Express
  server.applyMiddleware({ app, path: '/graphql' });

  // Ruta de bienvenida
  app.get('/', (req, res) => {
    res.json({
      message: '🚀 Sistema de Biblioteca GraphQL está funcionando!',
      graphql: `http://localhost:4000${server.graphqlPath}`,
      playground: 'Visita el GraphQL Playground para probar las consultas'
    });
  });

  // Iniciar el servidor
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log('\n🚀 ===== SISTEMA DE BIBLIOTECA INICIADO =====');
    console.log(`📍 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
    console.log('\n📋 Endpoints disponibles:');
    console.log(`   • GET  /           - Información del servidor`);
    console.log(`   • POST ${server.graphqlPath} - Consultas GraphQL`);
    console.log('\n✨ ¡Listo para gestionar libros y préstamos!');
    console.log('=============================================\n');
  });
}

// Iniciar el servidor y manejar errores
startServer().catch(error => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});