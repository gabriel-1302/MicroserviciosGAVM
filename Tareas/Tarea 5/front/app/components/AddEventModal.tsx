// @/app/components/AddEventModal.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';

interface AddEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddEventModal = ({ onClose, onSuccess }: AddEventModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    capacity: '',
    price: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        price: parseFloat(formData.price),
      };
      await axios.post('http://127.0.0.1:8000/api/events/', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      onSuccess(); // Notify parent to refresh
      onClose();   // Close the modal
    } catch (err) {
      setError('Error al crear el evento. Revisa los datos.');
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Crear Nuevo Evento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Fecha (YYYY-MM-DD)</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Lugar</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Capacidad</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
            <button type="submit" className="button-primary">Crear Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
