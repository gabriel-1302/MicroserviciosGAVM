import { Request, Response } from "express";
import { AgendaService } from "../service/AgendaService";

export class AgendaController {
  private agendaService: AgendaService;

  constructor() {
    this.agendaService = new AgendaService();
  }

  /**
   * Maneja la solicitud para obtener todos los contactos.
   * @param req Objeto de solicitud de Express.
   * @param res Objeto de respuesta de Express.
   */
  async obtenerTodosContactos(req: Request, res: Response): Promise<void> {
    try {
      const contactos = await this.agendaService.obtenerTodosContactos();
      res.json(contactos);
    } catch (error) {
      console.error("Error al obtener todos los contactos:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  /**
   * Maneja la solicitud para obtener un contacto por su ID.
   * @param req Objeto de solicitud de Express.
   * @param res Objeto de respuesta de Express.
   */
  async obtenerContactoPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const contacto = await this.agendaService.obtenerContactoPorId(id);
      if (contacto) {
        res.json(contacto);
      } else {
        res.status(404).json({ mensaje: "Contacto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener contacto por ID:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  /**
   * Maneja la solicitud para crear un nuevo contacto.
   * @param req Objeto de solicitud de Express.
   * @param res Objeto de respuesta de Express.
   */
  async crearContacto(req: Request, res: Response): Promise<void> {
    try {
      const nuevoContacto = await this.agendaService.crearContacto(req.body);
      res.status(201).json(nuevoContacto);
    } catch (error) {
      console.error("Error al crear contacto:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  /**
   * Maneja la solicitud para actualizar un contacto existente.
   * @param req Objeto de solicitud de Express.
   * @param res Objeto de respuesta de Express.
   */
  async actualizarContacto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const contactoActualizado = await this.agendaService.actualizarContacto(id, req.body);
      if (contactoActualizado) {
        res.json(contactoActualizado);
      } else {
        res.status(404).json({ mensaje: "Contacto no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  /**
   * Maneja la solicitud para eliminar un contacto.
   * @param req Objeto de solicitud de Express.
   * @param res Objeto de respuesta de Express.
   */
  async eliminarContacto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await this.agendaService.eliminarContacto(id);
      if (eliminado) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ mensaje: "Contacto no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }
}
