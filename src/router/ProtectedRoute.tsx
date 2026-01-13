import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('awl_token');
  const user = localStorage.getItem('awl_user');

  // Validação Dupla: Precisa ter Token E dados do usuário
  if (!token || !user) {
    // Limpa resquícios para evitar estado inconsistente
    localStorage.removeItem('awl_token');
    localStorage.removeItem('awl_user');
    
    return <Navigate to="/" replace />;
  }

  // Renderiza as rotas filhas (Dashboard, etc)
  return <Outlet />;
}