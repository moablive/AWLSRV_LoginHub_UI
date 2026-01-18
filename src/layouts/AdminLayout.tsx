import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* LADO ESQUERDO: Sidebar Fixa */}
      <div className="flex-shrink-0 z-20">
        <Sidebar />
      </div>

      {/* LADO DIREITO: Conteúdo Variável */}
      <main className="flex-1 overflow-y-auto relative focus:outline-none scroll-smooth">
        <div className="w-full h-full p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};