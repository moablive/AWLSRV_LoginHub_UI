import { Navigate, Outlet } from 'react-router-dom';

export default function SuperAdminRoute() {
  // Verifica a flag que definimos no Login.tsx
  const isMaster = sessionStorage.getItem('is_super_admin');

  if (isMaster !== 'true') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}