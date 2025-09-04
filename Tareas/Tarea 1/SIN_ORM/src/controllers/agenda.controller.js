
// Importamos el modelo de Agenda para poder interactuar con la base de datos.
const Agenda = require('../models/agenda.model');

// Objeto que contendrá las funciones que se ejecutarán cuando se acceda a cada ruta.
const agendaCtrl = {};

// Muestra todos los contactos.
agendaCtrl.renderizarListaContactos = async (req, res) => {
  try {
    // Llama al método del modelo para obtener todos los contactos.
    const contactos = await Agenda.obtenerTodos();
    // Renderiza la vista 'index.ejs' y le pasa la lista de contactos.
    res.render('index', { contactos });
  } catch (error) {
    // Si hay un error, lo mostramos en la consola y enviamos una respuesta de error.
    console.error(error);
    res.status(500).send('Error al cargar los contactos.');
  }
};

// Muestra el formulario para crear un nuevo contacto.
agendaCtrl.renderizarFormularioCrear = (req, res) => {
  // Simplemente renderiza la vista del formulario.
  // La variable 'contacto' se pasa como null para indicar que es una creación.
  res.render('formulario', { contacto: null, esEdicion: false });
};

// Procesa la creación de un nuevo contacto.
agendaCtrl.crearContacto = async (req, res) => {
  try {
    // Llama al método del modelo para crear un nuevo contacto con los datos del formulario (req.body).
    await Agenda.crear(req.body);
    // Redirige al usuario a la página principal después de crear el contacto.
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el contacto.');
  }
};

// Muestra el formulario para editar un contacto existente.
agendaCtrl.renderizarFormularioEditar = async (req, res) => {
  try {
    // Obtiene el contacto por su ID (que viene en la URL como req.params.id).
    const contacto = await Agenda.obtenerPorId(req.params.id);
    // Renderiza la misma vista de formulario, pero esta vez le pasa los datos del contacto.
    res.render('formulario', { contacto, esEdicion: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar el contacto.');
  }
};

// Procesa la actualización de un contacto.
agendaCtrl.actualizarContacto = async (req, res) => {
  try {
    // Llama al método del modelo para actualizar el contacto.
    // Se necesita el ID del contacto (req.params.id) y los nuevos datos (req.body).
    await Agenda.actualizar(req.params.id, req.body);
    // Redirige a la página principal.
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el contacto.');
  }
};

// Procesa la eliminación de un contacto.
agendaCtrl.eliminarContacto = async (req, res) => {
  try {
    // Llama al método del modelo para eliminar el contacto por su ID.
    await Agenda.eliminar(req.params.id);
    // Redirige a la página principal.
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el contacto.');
  }
};

// Exportamos el controlador.
module.exports = agendaCtrl;
