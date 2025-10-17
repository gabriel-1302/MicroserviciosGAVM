"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import EditEventModal from './EditEventModal';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    // ... (fetchEvents logic remains the same)
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No estás autenticado.");
          setLoading(false);
          return;
        }
        const response = await axios.get('http://127.0.0.1:8000/api/events/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEvents(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        setError("Error al cargar los eventos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/events/${eventId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // On successful deletion, filter out the event from the local state
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Error al eliminar el evento.');
      console.error(err);
    }
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div className="event-list-container">
        <h3>Eventos Actuales</h3>
        <table className="events-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Lugar</th>
              <th>Capacidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>{event.capacity}</td>
                  <td>${event.price.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button onClick={() => setEditingEvent(event)} className="edit-button">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="delete-button">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay eventos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </>
  );
};

export default EventList;