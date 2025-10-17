// @/app/components/SaleList.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ActionStatusModal from './ActionStatusModal'; // Importar el modal

interface Sale {
  ID: number;
  event_id: number;
  user_id: number;
  quantity: number;
  status: string;
  CreatedAt: string;
}

const SaleList = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    message: string;
    title: string;
    error: boolean;
  }>({ isOpen: false, isLoading: false, message: '', title: '', error: false });

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No estás autenticado.");
        }
        const response = await axios.get('http://localhost:3002/api/compras', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSales(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err: any) {
        setModalState({
          isOpen: true,
          isLoading: false,
          message: err.message || "Error al cargar las ventas.",
          title: "Error",
          error: true,
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleConfirmPayment = async (saleId: number) => {
    setModalState({
      isOpen: true,
      isLoading: true,
      message: "Procesando pago y enviando email de confirmación al cliente...",
      title: "Confirmando Pago",
      error: false,
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3002/api/pagar/${saleId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSales(sales.map(sale => 
        sale.ID === saleId ? { ...sale, status: 'pagada' } : sale
      ));
      
      setModalState({
        isOpen: true,
        isLoading: false,
        message: `Pago confirmado para la venta ID: ${saleId}. El cliente ha sido notificado.`,
        title: "Pago Confirmado",
        error: false,
      });

    } catch (err) {
      setModalState({
        isOpen: true,
        isLoading: false,
        message: `Error al confirmar el pago para la venta ID: ${saleId}.`,
        title: "Error de Confirmación",
        error: true,
      });
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  if (loading) return <p>Cargando ventas...</p>;

  return (
    <>
      <div className="table-container">
        <h3>Listado de Ventas</h3>
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>ID Evento</th>
              <th>ID Usuario</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.ID}>
                  <td>{sale.ID}</td>
                  <td>{sale.event_id}</td>
                  <td>{sale.user_id}</td>
                  <td>{sale.quantity}</td>
                  <td>
                    <span className={`status-badge status-${sale.status}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>{new Date(sale.CreatedAt).toLocaleString()}</td>
                  <td className="actions-cell">
                    {sale.status === 'pendiente' && (
                      <button 
                        onClick={() => handleConfirmPayment(sale.ID)} 
                        className="button button-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Confirmar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No hay ventas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalState.isOpen && (
        <ActionStatusModal
          title={modalState.title}
          message={modalState.message}
          isLoading={modalState.isLoading}
          error={modalState.error}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default SaleList;
