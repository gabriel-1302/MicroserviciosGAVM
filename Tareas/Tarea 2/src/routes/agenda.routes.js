const { Router } = require('express');
const router = Router();

const {
    getContactos,
    getContactoById,
    createContacto,
    updateContacto,
    deleteContacto
} = require('../controllers/agenda.controller');

// Rutas para el CRUD de contactos
router.get('/contactos', getContactos);
router.get('/contactos/:id', getContactoById);
router.post('/contactos', createContacto);
router.put('/contactos/:id', updateContacto);
router.delete('/contactos/:id', deleteContacto);

module.exports = router;
