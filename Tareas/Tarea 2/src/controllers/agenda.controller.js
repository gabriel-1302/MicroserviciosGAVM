const { getDB } = require('../database/connection');
const { ObjectId } = require('mongodb');

const getContactos = async (req, res) => {
    try {
        const db = getDB();
        const contactos = await db.collection('contactos').find({}).toArray();
        res.status(200).json(contactos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los contactos.' });
    }
};

const getContactoById = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const contacto = await db.collection('contactos').findOne({ _id: new ObjectId(id) });
        if (!contacto) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json(contacto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el contacto.' });
    }
};

const createContacto = async (req, res) => {
    try {
        const db = getDB();
        const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
        const newContacto = { nombres, apellidos, fecha_nacimiento, direccion, celular, correo };
        const result = await db.collection('contactos').insertOne(newContacto);
        
        // Corregido: Buscar el documento recién insertado para devolverlo
        const createdContacto = await db.collection('contactos').findOne({ _id: result.insertedId });
        res.status(201).json(createdContacto);
    } catch (error) {
        console.error('Error al crear el contacto:', error); // Añadido para mejor depuración
        res.status(500).json({ error: 'Error al crear el contacto.' });
    }
};

const updateContacto = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
        const updatedContacto = { nombres, apellidos, fecha_nacimiento, direccion, celular, correo };
        const result = await db.collection('contactos').updateOne({ _id: new ObjectId(id) }, { $set: updatedContacto });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json({ message: 'Contacto actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el contacto.' });
    }
};

const deleteContacto = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const result = await db.collection('contactos').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.status(200).json({ message: 'Contacto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el contacto.' });
    }
};

module.exports = {
    getContactos,
    getContactoById,
    createContacto,
    updateContacto,
    deleteContacto
};
