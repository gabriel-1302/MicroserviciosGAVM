
import { Router } from 'express';
import {
  getTrabajadores,
  createTrabajador,
  getTrabajadorById,
  updateTrabajador,
  deleteTrabajador
} from '../controllers/trabajador.controller.js';

const router = Router();

router.get('/', getTrabajadores);
router.post('/', createTrabajador);
router.get('/:id', getTrabajadorById);
router.put('/:id', updateTrabajador);
router.delete('/:id', deleteTrabajador);

export default router;
