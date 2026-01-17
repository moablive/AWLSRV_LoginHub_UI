import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  PlusIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

import { companyService } from '../services/companyService'; 
import { authService } from '../services/authService';
import { LogoutModal } from '../components/shared/LogoutModal/LogoutModal';
import type { Company } from '../types'; 

export function Dashboard() {
  const navigate = useNavigate();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await companyService.getAll(); 
      setCompanies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.')) {
        try {
            await companyService.delete(id);
            setCompanies(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            // CORREÇÃO: Usamos o 'error' no console para o linter não reclamar
            console.error('Falha no delete:', error);
            alert('Erro ao excluir empresa.');
        }
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.documento.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            LoginHub <span className="text-gray-400 font-light text-xl">| Manager</span>
          </h1>
          <p className="text-gray-500 mt-1">Gestão Centralizada de Tenants e Infraestrutura</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
            Sair
          </button>

          <button 
            onClick={() => navigate('/companies/new')} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md text-sm font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            Nova Empresa
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <BuildingOfficeIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Empresas Ativas</p>
              <h3 className="text-2xl font-bold text-gray-900">{companies.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
              <UsersIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Usuários Totais</p>
              <h3 className="text-2xl font-bold text-gray-900">-</h3> 
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Tenants Cadastrados</h3>
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Cadastro
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                      Nenhuma empresa encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{company.nome}</div>
                            <div className="text-sm text-gray-500">{company.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.documento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          company.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.data_cadastro ? new Date(company.data_cadastro).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/admin/companies/${company.id}/users`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Gerenciar Usuários"
                        >
                          <UsersIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir Empresa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => authService.logout()}
      />
      
    </div>
  );
}