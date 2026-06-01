import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="app-layout">
      {/* Menu de navegação global visível em todas as páginas */}
      <Navbar />

      {/* Onde o React Router vai injetar a página física ativa na URL */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

