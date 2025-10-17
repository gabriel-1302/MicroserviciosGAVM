"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken.role === 'admin') {
      setIsAdmin(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isAdmin) {
    return <p>Redirigiendo...</p>; // O un spinner de carga
  }

  return <Dashboard onLogout={handleLogout} />;
}
