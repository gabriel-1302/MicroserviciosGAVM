// @/app/components/BuyTicketModal.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  name: string;
}

interface BuyTicketModalProps {
  event: Event;
  onClose: () => void;
  onSuccess: (purchaseData: any) => void;
}

const BuyTicketModal = ({ event, onClose, onSuccess }: BuyTicketModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (quantity <= 0) {
      setError('La cantidad debe ser al menos 1.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3002/api/comprar', {
        event_id: event.id,
        quantity: quantity,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      onSuccess(response.data);
      // No need to call onClose here, onSuccess should handle closing.
    } catch (err) {
      setError('Error al realizar la compra. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Comprar Entradas</h2>
        <p>Estás comprando entradas para el evento: <strong>{event.name}</strong></p>
        
        <div className="form-group">
          <label htmlFor="quantity">Cantidad</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            min="1"
            required
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-secondary" disabled={loading}>
            Cancelar
          </button>
          <button type="button" onClick={handlePurchase} className="button button-primary" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTicketModal;
