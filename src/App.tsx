import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas Públicas
import Login from './pages/Login';

// Páginas do Cliente (Tenant)
import Dashboard from './pages/Dashboard';

// Layout e Páginas do Super Admin (Infraestrutura)
import SuperAdminLayout from './layouts/SuperAdminLayout';
import CompanyList from './pages/super-admin/CompanyList';
import CreateCompany from './pages/super-admin/CreateCompany';
import CompanyUsers from './pages/super-admin/CompanyUsers';

// 🛡️ Guardiões de Rota
import ProtectedRoute from './router/ProtectedRoute';
import SuperAdminRoute from './router/SuperAdminRoute';

function App() {
  return (
    <Routes>
      {/* 1. ROTA PÚBLICA (Login) */}
      <Route path="/" element={<Login />} />

      {/* 2. ROTAS DO CLIENTE (JWT) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* 3. ROTAS DE INFRAESTRUTURA (Master Key) */}
      <Route element={<SuperAdminRoute />}>
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          {/* Redirecionamento automático: entrou em /super-admin -> vai para /super-admin/empresas */}
          <Route index element={<Navigate to="empresas" replace />} />
          
          <Route path="empresas" element={<CompanyList />} />
          <Route path="nova-empresa" element={<CreateCompany />} />
          <Route path="empresa/:id/usuarios" element={<CompanyUsers />} />
        </Route>
      </Route>

      {/* 4. ROTA DE ERRO (Volta pro login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;