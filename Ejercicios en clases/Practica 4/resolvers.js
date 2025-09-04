const { libroService, prestamoService } = require('./database');

// Resolvers para las consultas y mutaciones GraphQL
const resolvers = {
  // Resolvers para consultas (Query)
  Query: {
    // Obtener todos los libros
    getLibros: () => {
      console.log('🔍 Consultando todos los libros...');
      return libroService.getAllLibros();
    },

    // Obtener todos los préstamos
    getPrestamos: () => {
      console.log('🔍 Consultando todos los préstamos...');
      return prestamoService.getAllPrestamos();
    },

    // Obtener un préstamo por su ID
    getPrestamoById: (_, { id }) => {
      console.log(`🔍 Buscando préstamo con ID: ${id}`);
      return prestamoService.getPrestamoById(id);
    },

    // Desafío extra: Obtener préstamos por usuario
    getPrestamosByUsuario: (_, { usuario }) => {
      console.log(`🔍 Buscando préstamos del usuario: ${usuario}`);
      return prestamoService.getPrestamosByUsuario(usuario);
    }
  },

  // Resolvers para mutaciones (Mutation)
  Mutation: {
    // Crear un nuevo libro
    createLibro: (_, { input }) => {
      console.log('📚 Creando nuevo libro:', input);
      try {
        const nuevoLibro = libroService.createLibro(input);
        console.log('✅ Libro creado exitosamente:', nuevoLibro);
        return nuevoLibro;
      } catch (error) {
        console.error('❌ Error al crear libro:', error.message);
        throw new Error(`Error al crear libro: ${error.message}`);
      }
    },

    // Crear un nuevo préstamo
    createPrestamo: (_, { input }) => {
      console.log('📋 Creando nuevo préstamo:', input);
      try {
        const nuevoPrestamo = prestamoService.createPrestamo(input);
        console.log('✅ Préstamo creado exitosamente:', nuevoPrestamo);
        return nuevoPrestamo;
      } catch (error) {
        console.error('❌ Error al crear préstamo:', error.message);
        throw new Error(`Error al crear préstamo: ${error.message}`);
      }
    }
  },

  // Resolvers para campos específicos
  Libro: {
    // Resolver para obtener los préstamos de un libro específico
    prestamos: (libro) => {
      return prestamoService.getAllPrestamos()
        .filter(prestamo => prestamo.libro.id === libro.id);
    }
  },

  Prestamo: {
    // Resolver para obtener el libro asociado a un préstamo
    libro: (prestamo) => {
      return libroService.getLibroById(prestamo.libroId);
    }
  }
};

module.exports = resolvers;