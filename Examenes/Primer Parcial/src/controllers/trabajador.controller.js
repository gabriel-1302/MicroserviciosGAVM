
import Trabajador from '../models/Trabajador.js';

export const getTrabajadores = async (req, res) => {
  try {
    const trabajadores = await Trabajador.find();
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los trabajadores', error });
  }
};

export const createTrabajador = async (req, res) => {
  try {
    const nuevoTrabajador = new Trabajador(req.body);
    const trabajadorGuardado = await nuevoTrabajador.save();
    res.status(201).json(trabajadorGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el trabajador', error });
  }
};

export const getTrabajadorById = async (req, res) => {
  try {
    const trabajador = await Trabajador.findById(req.params.id);
    if (!trabajador) return res.status(404).json({ message: 'Trabajador no encontrado' });
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el trabajador', error });
  }
};

export const updateTrabajador = async (req, res) => {
  try {
    const trabajadorActualizado = await Trabajador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trabajadorActualizado) return res.status(404).json({ message: 'Trabajador no encontrado' });
    res.json(trabajadorActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el trabajador', error });
  }
};

export const deleteTrabajador = async (req, res) => {
  try {
    const trabajadorEliminado = await Trabajador.findByIdAndDelete(req.params.id);
    if (!trabajadorEliminado) return res.status(404).json({ message: 'Trabajador no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el trabajador', error });
  }
};
