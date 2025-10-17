"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/login/', {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      
      if (decodedToken.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/'); // Redirige a la página principal para usuarios no-admin
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1 className="login-brand">Gateway</h1>
          <p className="login-slogan">Tu pasaporte a experiencias inolvidables.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Tu nombre de usuario"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Tu contraseña"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button button-primary login-button">Iniciar sesión</button>
        </form>
      </div>
      <footer className="login-footer">
        <p>&copy; 2025 Gateway. Todos los derechos reservados.</p>
        <nav>
          <a href="#">Términos de Servicio</a>
          <span>&bull;</span>
          <a href="#">Política de Privacidad</a>
        </nav>
      </footer>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: var(--background);
          padding: 2rem;
        }
        .login-form {
          background-color: var(--card);
          padding: 3rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          width: 100%;
          max-width: 420px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.6s ease-out;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-brand {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 0.5rem;
          background: -webkit-linear-gradient(45deg, #FAFAFA, #A1A1AA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-slogan {
          color: var(--muted-foreground);
          font-size: 1rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .form-control {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: var(--radius);
          background-color: var(--input);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary);
        }
        .login-button {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
          margin-top: 1rem;
          transition: all 0.2s ease;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(250, 250, 250, 0.1);
        }
        .error-message {
          color: var(--destructive);
          text-align: center;
          margin-bottom: 1rem;
        }
        .login-footer {
          position: absolute;
          bottom: 2rem;
          text-align: center;
          color: var(--muted-foreground);
          font-size: 0.8rem;
        }
        .login-footer nav {
          margin-top: 0.5rem;
        }
        .login-footer a {
          color: var(--muted-foreground);
          transition: color 0.2s;
        }
        .login-footer a:hover {
          color: var(--foreground);
        }
        .login-footer span {
          margin: 0 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
