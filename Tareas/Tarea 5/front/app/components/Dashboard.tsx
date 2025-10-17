"use client";

import { useState } from 'react';
import EventList from './EventList';
import AddEventModal from './AddEventModal';
import SaleList from './SaleList';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventAdded = () => {
    setRefreshKey(oldKey => oldKey + 1);
    setActiveView('events');
  };

  const renderView = () => {
    switch (activeView) {
      case 'events':
        return <EventList key={refreshKey} />;
      case 'sales':
        return <SaleList />;
      default:
        return (
          <div className="kpi-grid">
            <div className="kpi-card">
              <h4>Ingresos Totales</h4>
              <p>$12,345</p>
            </div>
            <div className="kpi-card">
              <h4>Entradas Vendidas</h4>
              <p>678</p>
            </div>
            <div className="kpi-card">
              <h4>Eventos Activos</h4>
              <p>12</p>
            </div>
            <div className="kpi-card">
              <h4>Tasa de Conversión</h4>
              <p>4.2%</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="admin-layout">
        <aside className="sidebar">
          <h1 className="sidebar-brand">Gateway</h1>
          <nav className="sidebar-nav">
            <a href="#" className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}>Inicio</a>
            <a href="#" className={activeView === 'events' ? 'active' : ''} onClick={() => setActiveView('events')}>Eventos</a>
            <a href="#" className={activeView === 'sales' ? 'active' : ''} onClick={() => setActiveView('sales')}>Ventas</a>
          </nav>
          <button onClick={onLogout} className="button button-secondary logout-button">Cerrar Sesión</button>
        </aside>
        <main className="main-content">
          <header className="main-header-admin">
            <h2>Bienvenido, Admin</h2>
            <p>Aquí tienes un resumen de la actividad reciente.</p>
            <button onClick={() => setShowAddModal(true)} className="button button-primary">
              Crear Evento
            </button>
          </header>
          {renderView()}
        </main>
      </div>

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleEventAdded}
        />
      )}
    </>
  );
};

export default Dashboard;
