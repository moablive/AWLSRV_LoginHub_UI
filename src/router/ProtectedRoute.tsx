import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('awl_token');

  // Se não tem token, redireciona para Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tem token, renderiza a página solicitada (Dashboard, etc)
  return children;
}