// Importamos el pool de conexiones a la base de datos que configuramos previamente.
const pool = require('../config/database');

// Objeto que contendrá todos los métodos para interactuar con la tabla 'agenda'.
const Agenda = {};

// Método para obtener todos los contactos de la agenda.
Agenda.obtenerTodos = async () => {
  try {
    // Realizamos la consulta a la base de datos para seleccionar todos los registros.
    // [rows] desestructura el resultado para obtener solo las filas.
    const [rows] = await pool.query('SELECT * FROM agenda ORDER BY id ASC');
    // Devolvemos las filas obtenidas.
    return rows;
  } catch (error) {
    // Si ocurre un error, lo mostramos en la consola y lo lanzamos para que sea manejado por el controlador.
    console.error('Error al obtener los contactos:', error);
    throw error;
  }
};

// Método para obtener un contacto específico por su ID.
Agenda.obtenerPorId = async (id) => {
  try {
    // Consulta para seleccionar un contacto donde el 'id' coincida.
    // Usamos consultas parametrizadas (?) para prevenir inyección SQL.
    const [rows] = await pool.query('SELECT * FROM agenda WHERE id = ?', [id]);
    // Devolvemos la primera (y única) fila encontrada.
    return rows[0];
  } catch (error) {
    console.error('Error al obtener el contacto:', error);
    throw error;
  }
};

// Método para crear un nuevo contacto.
Agenda.crear = async (nuevoContacto) => {
  try {
    // Extraemos los datos del objeto 'nuevoContacto'.
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = nuevoContacto;
    // Consulta para insertar un nuevo registro con los datos proporcionados.
    // El resultado de INSERT en MySQL incluye 'insertId'.
    const [resultado] = await pool.query(
      'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]
    );
    // Para devolver el contacto completo, podemos obtenerlo por su ID recién insertado.
    return Agenda.obtenerPorId(resultado.insertId);
  } catch (error) {
    console.error('Error al crear el contacto:', error);
    throw error;
  }
};

// Método para actualizar un contacto existente por su ID.
Agenda.actualizar = async (id, datosActualizados) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = datosActualizados;
    // Consulta para actualizar los datos de un contacto específico.
    await pool.query(
      'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
      [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id]
    );
    // Devolvemos el contacto actualizado (lo volvemos a obtener para asegurar que los datos son los correctos).
    return Agenda.obtenerPorId(id);
  } catch (error) {
    console.error('Error al actualizar el contacto:', error);
    throw error;
  }
};

// Método para eliminar un contacto por su ID.
Agenda.eliminar = async (id) => {
  try {
    // Consulta para eliminar un contacto de la base de datos.
    const [resultado] = await pool.query('DELETE FROM agenda WHERE id = ?', [id]);
    // MySQL devuelve 'affectedRows' para indicar cuántas filas fueron afectadas.
    return resultado.affectedRows > 0; // Devuelve true si se eliminó al menos una fila.
  } catch (error) {
    console.error('Error al eliminar el contacto:', error);
    throw error;
  }
};

// Exportamos el objeto Agenda para usarlo en los controladores.
module.exports = Agenda;