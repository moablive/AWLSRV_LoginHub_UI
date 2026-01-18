import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Services
import { authService } from '../services/authService';

// Layout (Sidebar + Container Principal)
import { AdminLayout } from '../layouts/AdminLayout';

// Páginas
import { Login } from '../pages/Login'; 
import { Dashboard } from '../pages/Dashboard';
import { CreateCompany } from '../pages/Companies/CreateCompany'; // Ajustado path conforme passos anteriores
import { CompanyUsers } from '../pages/CompanyUsers/CompanyUsers'; // Ajustado path

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
      
      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* --- ÁREA ADMINISTRATIVA (PROTEGIDA) --- */}
      <Route element={<ProtectedRoute />}>
        
        {/* Envolvemos as páginas no Layout para mostrar a Sidebar */}
        <Route element={<AdminLayout />}>
          
          {/* Dashboard (Lista de Empresas) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Truque: Se o login mandar para /companies, joga para o dashboard */}
          <Route path="/companies" element={<Navigate to="/dashboard" replace />} />
          
          {/* Cadastro de Nova Empresa */}
          <Route path="/companies/new" element={<CreateCompany />} />
          
          {/* Gerenciamento de Usuários (Rota dinâmica) */}
          <Route path="/admin/companies/:id/users" element={<CompanyUsers />} />

        </Route>

      </Route>

      {/* Rota 404 (Fallback) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}