import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Services
import { authService } from '../services/authService';

// Layout (Sidebar + Container Principal)
import { AdminLayout } from '../layouts/AdminLayout';

// Páginas
import { Login } from '../pages/Login'; 
import { Dashboard } from '../pages/Dashboard';
import { CreateCompany } from '../pages/CreateCompany'; 
import { CompanyUsers } from '../pages/CompanyUsers'; 

// ============================================================================
// 1. GUARDS (Proteção de Rotas)
// ============================================================================

/**
 * Verifica se está autenticado (seja via Token OU via Master Key)
 */
function ProtectedRoute() {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    // Redireciona para login se não tiver permissão
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// ============================================================================
// 2. DEFINIÇÃO DAS ROTAS
// ============================================================================

export function AppRoutes() {
  return (
    <Routes>
      
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirecionamento da raiz -> Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* --- ÁREA ADMINISTRATIVA (PROTEGIDA) --- */}
      <Route element={<ProtectedRoute />}>
        
        {/* Envolvemos as páginas no Layout para mostrar a Sidebar */}
        <Route element={<AdminLayout />}>
          
          {/* Dashboard (Lista de Empresas) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Fallback: Se o login ou usuário acessar /companies, joga para o dashboard */}
          <Route path="/companies" element={<Navigate to="/dashboard" replace />} />
          
          {/* Cadastro de Nova Empresa */}
          <Route path="/companies/new" element={<CreateCompany />} />
          
          {/* Rota: /companies/123/users */}
          <Route path="/companies/:id/users" element={<CompanyUsers />} />

        </Route>

      </Route>

      {/* Rota 404 (Fallback) -> Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}