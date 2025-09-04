const { gql } = require('apollo-server-express');

// Definición del esquema GraphQL
const typeDefs = gql`
  # Tipo Libro
  type Libro {
    id: ID!
    titulo: String!
    autor: String!
    isbn: String!
    anio_publicacion: Int!
    prestamos: [Prestamo!]!
  }

  # Tipo Prestamo
  type Prestamo {
    id: ID!
    usuario: String!
    fecha_prestamo: String!
    fecha_devolucion: String!
    libro: Libro!
    libroId: ID!
  }

  # Input para crear un libro
  input LibroInput {
    titulo: String!
    autor: String!
    isbn: String!
    anio_publicacion: Int!
  }

  # Input para crear un préstamo
  input PrestamoInput {
    usuario: String!
    fecha_prestamo: String!
    fecha_devolucion: String!
    libroId: ID!
  }

  # Consultas (Queries)
  type Query {
    # Obtener todos los libros
    getLibros: [Libro!]!
    
    # Obtener todos los préstamos
    getPrestamos: [Prestamo!]!
    
    # Obtener un préstamo por su id
    getPrestamoById(id: ID!): Prestamo
    
    # Desafío extra: Filtrar préstamos por usuario
    getPrestamosByUsuario(usuario: String!): [Prestamo!]!
  }

  # Mutaciones (Mutations)
  type Mutation {
    # Crear un nuevo libro
    createLibro(input: LibroInput!): Libro!
    
    # Registrar un nuevo préstamo
    createPrestamo(input: PrestamoInput!): Prestamo!
  }
`;

module.exports = typeDefs;