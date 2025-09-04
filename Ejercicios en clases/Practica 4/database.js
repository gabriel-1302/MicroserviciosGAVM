// Base de datos simulada en memoria
let libros = [];
let prestamos = [];
let libroIdCounter = 1;
let prestamoIdCounter = 1;

// Funciones para manejar los libros
const libroService = {
  // Obtener todos los libros
  getAllLibros: () => {
    return libros.map(libro => ({
      ...libro,
      prestamos: prestamos.filter(prestamo => prestamo.libroId === libro.id)
    }));
  },

  // Crear un nuevo libro
  createLibro: (libroData) => {
    const nuevoLibro = {
      id: libroIdCounter.toString(),
      ...libroData
    };
    libros.push(nuevoLibro);
    libroIdCounter++;
    return nuevoLibro;
  },

  // Buscar libro por ID
  getLibroById: (id) => {
    return libros.find(libro => libro.id === id);
  }
};

// Funciones para manejar los préstamos
const prestamoService = {
  // Obtener todos los préstamos
  getAllPrestamos: () => {
    return prestamos.map(prestamo => ({
      ...prestamo,
      libro: libroService.getLibroById(prestamo.libroId)
    }));
  },

  // Crear un nuevo préstamo
  createPrestamo: (prestamoData) => {
    // Verificar que el libro existe
    const libro = libroService.getLibroById(prestamoData.libroId);
    if (!libro) {
      throw new Error(`Libro con ID ${prestamoData.libroId} no encontrado`);
    }

    const nuevoPrestamo = {
      id: prestamoIdCounter.toString(),
      ...prestamoData
    };
    prestamos.push(nuevoPrestamo);
    prestamoIdCounter++;
    return {
      ...nuevoPrestamo,
      libro
    };
  },

  // Buscar préstamo por ID
  getPrestamoById: (id) => {
    const prestamo = prestamos.find(prestamo => prestamo.id === id);
    if (prestamo) {
      return {
        ...prestamo,
        libro: libroService.getLibroById(prestamo.libroId)
      };
    }
    return null;
  },

  // Filtrar préstamos por usuario
  getPrestamosByUsuario: (usuario) => {
    return prestamos
      .filter(prestamo => prestamo.usuario.toLowerCase().includes(usuario.toLowerCase()))
      .map(prestamo => ({
        ...prestamo,
        libro: libroService.getLibroById(prestamo.libroId)
      }));
  }
};

module.exports = {
  libroService,
  prestamoService
};