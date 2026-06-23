import './styles/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnunciosProvider } from './context/AnunciosContext';
import App from './App';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Feed from './pages/Feed';
import Perfil from './pages/Perfil';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/feed',
        element: <Feed />
      },
      {
        path: '/cadastro',
        element: <Cadastro />

      },
      {
        path: '/perfil',
        element: <Perfil />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnunciosProvider>
      <RouterProvider router={router} />
    </AnunciosProvider>
  </React.StrictMode>
);
