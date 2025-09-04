import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";

export class AgendaService {
  private agendaRepository = AppDataSource.getRepository(Agenda);

  /**
   * Obtiene todos los contactos de la agenda.
   * @returns Una promesa que resuelve con un array de objetos Agenda.
   */
  async obtenerTodosContactos(): Promise<Agenda[]> {
    return this.agendaRepository.find();
  }

  /**
   * Obtiene un contacto de la agenda por su ID.
   * @param id El ID del contacto a buscar.
   * @returns Una promesa que resuelve con el objeto Agenda encontrado o undefined si no existe.
   */
  async obtenerContactoPorId(id: number): Promise<Agenda | null> {
    return this.agendaRepository.findOneBy({ id });
  }

  /**
   * Crea un nuevo contacto en la agenda.
   * @param contacto Los datos del contacto a crear.
   * @returns Una promesa que resuelve con el objeto Agenda creado.
   */
  async crearContacto(contacto: Partial<Agenda>): Promise<Agenda> {
    const nuevoContacto = this.agendaRepository.create(contacto);
    return this.agendaRepository.save(nuevoContacto);
  }

  /**
   * Actualiza un contacto existente en la agenda.
   * @param id El ID del contacto a actualizar.
   * @param contacto Los datos parciales del contacto a actualizar.
   * @returns Una promesa que resuelve con el objeto Agenda actualizado o undefined si no se encontró el contacto.
   */
  async actualizarContacto(id: number, contacto: Partial<Agenda>): Promise<Agenda | null> {
    const contactoExistente = await this.agendaRepository.findOneBy({ id });
    if (!contactoExistente) {
      return null;
    }
    // Actualiza solo los campos proporcionados
    Object.assign(contactoExistente, contacto);
    return this.agendaRepository.save(contactoExistente);
  }

  /**
   * Elimina un contacto de la agenda por su ID.
   * @param id El ID del contacto a eliminar.
   * @returns Una promesa que resuelve con true si se eliminó el contacto, false en caso contrario.
   */
  async eliminarContacto(id: number): Promise<boolean> {
    const resultado = await this.agendaRepository.delete(id);
    return resultado.affected === 1;
  }
}
