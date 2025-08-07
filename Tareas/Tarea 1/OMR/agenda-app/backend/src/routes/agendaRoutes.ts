import { Router } from "express";
import { AgendaController } from "../controller/AgendaController";

const router = Router();
const agendaController = new AgendaController();

/**
 * @swagger
 * /api/agenda:
 *   get:
 *     summary: Obtiene todos los contactos de la agenda.
 *     responses:
 *       200:
 *         description: Lista de contactos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agenda'
 *   post:
 *     summary: Crea un nuevo contacto en la agenda.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaInput'
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 */
router.get("/agenda", agendaController.obtenerTodosContactos.bind(agendaController));
router.post("/agenda", agendaController.crearContacto.bind(agendaController));

/**
 * @swagger
 * /api/agenda/{id}:
 *   get:
 *     summary: Obtiene un contacto de la agenda por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto.
 *     responses:
 *       200:
 *         description: Detalles del contacto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       404:
 *         description: Contacto no encontrado.
 *   put:
 *     summary: Actualiza un contacto existente en la agenda.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaInput'
 *     responses:
 *       200:
 *         description: Contacto actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       404:
 *         description: Contacto no encontrado.
 *   delete:
 *     summary: Elimina un contacto de la agenda por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto a eliminar.
 *     responses:
 *       204:
 *         description: Contacto eliminado exitosamente.
 *       404:
 *         description: Contacto no encontrado.
 */
router.get("/agenda/:id", agendaController.obtenerContactoPorId.bind(agendaController));
router.put("/agenda/:id", agendaController.actualizarContacto.bind(agendaController));
router.delete("/agenda/:id", agendaController.eliminarContacto.bind(agendaController));

export default router;
