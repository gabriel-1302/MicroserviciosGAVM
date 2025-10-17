// @/app/components/EventCard.tsx
"use client";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  price: number;
}

interface EventCardProps {
  event: Event;
  onBuyClick: (event: Event) => void;
}

const EventCard = ({ event, onBuyClick }: EventCardProps) => {
  // Helper to format the date
  const formattedDate = new Date(event.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="event-card" onClick={() => onBuyClick(event)}>
      <div className="event-card-image">
        <img 
          src={`https://source.unsplash.com/random/400x200?concert,event,${event.id}`} 
          alt={event.name} 
        />
      </div>
      <div className="event-card-content">
        <div>
          <h3>{event.name}</h3>
          <p className="event-card-info">{formattedDate} - {event.location}</p>
        </div>
        <div className="event-card-footer">
          <p className="event-price">${event.price.toFixed(2)}</p>
          <button className="button button-primary" onClick={(e) => {
            e.stopPropagation(); // Prevent card's onClick from firing again
            onBuyClick(event);
          }}>
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
