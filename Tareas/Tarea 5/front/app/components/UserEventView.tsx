// @/app/components/UserEventView.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import BuyTicketModal from './BuyTicketModal';
import SuccessModal from './SuccessModal';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
}

const UserEventView = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // This case is handled by the HomePage, so we can just stop.
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/events/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setEvents(Array.isArray(response.data) ? response.data : []);

      } catch (err) {
        setError("No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBuyClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseBuyModal = () => {
    setSelectedEvent(null);
  };

  const handlePurchaseSuccess = (purchaseData: any) => {
    setSelectedEvent(null); // Close the buy modal
    if (purchaseData.status === 'pendiente') {
      setSuccessMessage(
        `Tu compra para ${selectedEvent?.name} ha sido registrada. Recibirás una notificación por correo para validar el pago.`
      );
    } else {
      setSuccessMessage(
        `¡Compra exitosa! Has adquirido ${purchaseData.quantity} entrada(s) para ${selectedEvent?.name}.`
      );
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessMessage(null);
  };

  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Próximos Eventos</h2>
      {events.length > 0 ? (
        <div className="event-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} onBuyClick={handleBuyClick} />
          ))}
        </div>
      ) : (
        <p>No hay eventos disponibles en este momento.</p>
      )}

      {selectedEvent && (
        <BuyTicketModal
          event={selectedEvent}
          onClose={handleCloseBuyModal}
          onSuccess={handlePurchaseSuccess}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      )}
    </section>
  );
};

export default UserEventView;
