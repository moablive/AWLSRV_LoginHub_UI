import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- IMPORTAÇÃO DAS PÁGINAS ---
import { Login } from '../pages/Login'; 
import { Dashboard } from '../pages/Dashboard';

// Novos componentes administrativos
import { CreateCompany } from '../pages/super-admin/CreateCompany';
import { CompanyUsers } from '../pages/super-admin/CompanyUsers';

// ============================================================================
// 1. COMPONENTES DE PROTEÇÃO (GUARDS)
// ============================================================================

/**
 * Proteção Nível 1: Autenticação Básica
 * Verifica se o usuário tem token e dados salvos.
 */
function ProtectedRoute() {
  const token = localStorage.getItem('awl_token');
  const user = localStorage.getItem('awl_user');

  if (!token || !user) {
    // Limpeza de segurança
    localStorage.removeItem('awl_token');
    localStorage.removeItem('awl_user');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

/**
 * Proteção Nível 2: Acesso Super Admin (Master)
 * Verifica a flag de sessão específica do painel master.
 */
function SuperAdminRoute() {
  const isMaster = sessionStorage.getItem('is_super_admin');

  if (isMaster !== 'true') {
    return <Navigate to="/" replace />; // Ou para uma página de "Acesso Negado"
  }

  return <Outlet />;
}

// ============================================================================
// 2. DEFINIÇÃO DAS ROTAS
// ============================================================================

export function AppRoutes() {
  return (
    <Routes>
      {/* --- ROTA PÚBLICA --- */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* --- ROTAS PROTEGIDAS --- */}
      {/* Camada 1: O usuário precisa estar logado */}
      <Route element={<ProtectedRoute />}>
        
        {/* Camada 2: O usuário precisa ser Master (Super Admin) */}
        <Route element={<SuperAdminRoute />}>
          
          {/* Dashboard Principal (Lista de Empresas) */}
          <Route path="/admin" element={<Dashboard />} />
          
          {/* Criar Nova Empresa */}
          <Route path="/admin/companies/new" element={<CreateCompany />} />
          
          {/* Gerenciar Usuários da Empresa (Dynamic Route com ID) */}
          <Route path="/admin/companies/:id/users" element={<CompanyUsers />} />
          
        </Route>

        {/* Futura Área do Usuário Comum (Tenant)
           <Route path="/home" element={<HomeUsuario />} />
        */}

      </Route>

      {/* Rota de Fallback (Qualquer endereço errado volta para o login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}