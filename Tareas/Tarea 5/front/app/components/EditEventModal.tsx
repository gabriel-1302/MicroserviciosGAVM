// @/app/components/EditEventModal.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
}

interface EditEventModalProps {
  event: Event | null;
  onClose: () => void;
  onEventUpdated: (updatedEvent: Event) => void;
}

const EditEventModal = ({ event, onClose, onEventUpdated }: EditEventModalProps) => {
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
      });
    }
  }, [event]);

  if (!event) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://127.0.0.1:8000/api/events/${event.id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      onEventUpdated(response.data);
      onClose();
    } catch (err) {
      setError('Error al actualizar el evento.');
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Editar Evento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Fecha (YYYY-MM-DD)</label>
            <input type="text" name="date" value={formData.date || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Lugar</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Capacidad</label>
            <input type="number" name="capacity" value={formData.capacity || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input type="number" step="0.01" name="price" value={formData.price || ''} onChange={handleChange} />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
            <button type="submit" className="button-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
