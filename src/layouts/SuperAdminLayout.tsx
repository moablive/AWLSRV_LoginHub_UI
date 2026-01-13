import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import '../styles/admin-layout.css'; // Importe o CSS criado acima

export default function SuperAdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa credenciais locais
    localStorage.removeItem('awl_token');
    sessionStorage.removeItem('is_super_admin');
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="brand">
          <span>🛡️</span> AWL Infra
        </div>

        <nav className="nav-menu">
          {/* Opção 1: Listar Clientes */}
          <NavLink 
            to="/super-admin/empresas" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <span>🏢</span> Empresas
          </NavLink>

          {/* Opção 2: Nova Empresa */}
          <NavLink 
            to="/super-admin/nova-empresa" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <span>➕</span> Nova Empresa
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="nav-item logout-btn">
          <span>🚪</span> Sair
        </button>
      </aside>

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="main-content">
        <Outlet /> {/* Aqui serão renderizadas as páginas filhas */}
      </main>
    </div>
  );
}