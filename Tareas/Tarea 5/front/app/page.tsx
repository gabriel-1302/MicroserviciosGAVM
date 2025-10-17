"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserEventView from '@/app/components/UserEventView';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; role: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role === 'admin') {
        router.replace('/dashboard');
      } else {
        setUser(decodedToken);
        setLoading(false);
      }
    } catch (error) {
      // Invalid token, redirect to login
      localStorage.removeItem('token');
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return (
      <main className="main-container">
        <header className="main-header">
          <h1>Plataforma de Eventos</h1>
          <button onClick={handleLogout} className="button button-secondary">
            Cerrar Sesión
          </button>
        </header>
        <UserEventView />
      </main>
    );
  }

  return null;
}
