import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { authService } from '../services/authService';

export const Sidebar = () => {
  const linkClass = "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 mb-1";
  const activeClass = "bg-blue-600 text-white shadow-md";
  const inactiveClass = "text-gray-400 hover:bg-white/5 hover:text-white";

  return (
    <aside className="w-64 h-full bg-[#111827] flex flex-col border-r border-gray-800 shadow-xl">
      
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          
          {/* ✅ ALTERADO: Agora exibe o favicon.svg */}
          <img 
            src="/favicon.svg" 
            alt="Logo LoginHub" 
            className="w-8 h-8 object-contain" // Mantém proporção e define tamanho
          />

          <span className="text-xl font-bold text-white tracking-wide">
            LoginHub
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Principal
        </p>
        
        <NavLink to="/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/companies" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <BuildingOfficeIcon className="h-5 w-5" />
          <span>Empresas</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-800 bg-[#0f1523]">
        <button 
          onClick={() => authService.logout()} 
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-semibold group"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:text-white transition-colors" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};