
// Importamos el framework Express para crear y gestionar las rutas.
const { Router } = require('express');
const router = Router();

// Importamos el controlador de la agenda que contiene la lógica de cada ruta.
const {
  renderizarListaContactos,
  renderizarFormularioCrear,
  crearContacto,
  renderizarFormularioEditar,
  actualizarContacto,
  eliminarContacto
} = require('../controllers/agenda.controller');

// --- Rutas Principales ---

// Ruta para mostrar la lista de todos los contactos (Read).
router.get('/', renderizarListaContactos);

// --- Rutas para Crear (Create) ---

// Ruta para mostrar el formulario de creación de un nuevo contacto.
router.get('/crear', renderizarFormularioCrear);

// Ruta para procesar los datos del formulario y crear el contacto en la BD.
router.post('/crear', crearContacto);

// --- Rutas para Actualizar (Update) ---

// Ruta para mostrar el formulario de edición con los datos de un contacto específico.
// ':id' es un parámetro que capturará el ID del contacto.
router.get('/editar/:id', renderizarFormularioEditar);

// Ruta para procesar la actualización de un contacto.
router.post('/editar/:id', actualizarContacto);

// --- Ruta para Eliminar (Delete) ---

// Ruta para eliminar un contacto. Se usa GET en este caso por simplicidad para el ejemplo,
// pero en una aplicación real se recomienda usar un método POST o DELETE por seguridad.
router.get('/eliminar/:id', eliminarContacto);

// Exportamos el router con todas las rutas definidas.
module.exports = router;
