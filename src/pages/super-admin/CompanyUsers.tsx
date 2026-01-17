import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import { 
  UserPlusIcon, 
  ArrowLeftIcon, 
  UsersIcon, 
  TrashIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import { userService } from '../../services/userService';
import { companyService } from '../../services/companyService';
import { masks } from '../../utils/masks';
import type { User, CreateUserDTO, Company } from '../../types';
import { SuccessModal } from '../../components/shared/SuccessModal/SuccessModal';

export const CompanyUsers = () => {
  const { id: empresaId } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm<CreateUserDTO>();

  const fetchData = useCallback(async () => {
    if (!empresaId) return;
    try {
      const [usersData, companyData] = await Promise.all([
        userService.getByCompanyId(empresaId),
        companyService.getById(empresaId)
      ]);
      
      setUsers(usersData);
      setCompany(companyData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('telefone', masks.phone(e.target.value));
  };

  const onAddUser = async (data: CreateUserDTO) => {
    if (!empresaId) return;
    try {
      await userService.create({
        ...data,
        empresa_id: empresaId,
        telefone: data.telefone 
      });
      
      setShowFormModal(false);
      setShowSuccessModal(true);
      reset(); 
      fetchData(); 
      
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Erro ao criar usuário.';
        alert(msg);
      } else {
        alert('Erro inesperado ao criar usuário.');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await userService.delete(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        // CORREÇÃO: Uso da variável 'error' para satisfazer o ESLint
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao excluir usuário. Verifique o console.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* CABEÇALHO */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar para Empresas
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            Gestão de Usuários
          </h1>
          <p className="text-gray-500 mt-1">
            Empresa: <span className="font-semibold text-gray-800">{company?.nome || 'Carregando...'}</span>
          </p>
        </div>
        
        <button 
          onClick={() => setShowFormModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-sm font-medium"
        >
          <UserPlusIcon className="h-5 w-5" />
          Novo Usuário
        </button>
      </div>

      {/* LISTAGEM */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Sincronizando dados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acesso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        Nenhum usuário vinculado a esta empresa.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <ShieldCheckIcon className="h-3 w-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Usuário
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.telefone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition"
                            title="Remover Usuário"
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
          )}
        </div>
      </div>

      {/* MODAL FORMULÁRIO */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowFormModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <form onSubmit={handleSubmit(onAddUser)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlusIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Adicionar Novo Usuário
                      </h3>
                      <div className="mt-4 space-y-4">
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                          <input 
                            {...register('nome', { required: true })} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                            placeholder="Ex: João da Silva"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">E-mail de Acesso</label>
                          <input 
                            type="email"
                            {...register('email', { required: true })} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                            placeholder="joao@empresa.com"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Senha Provisória</label>
                            <input 
                              type="password"
                              {...register('password', { required: true })} 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                              placeholder="******"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
                            <select 
                              {...register('role')} 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="usuario">Usuário Padrão</option>
                              <option value="admin">Admin da Empresa</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Telefone</label>
                          <input 
                            {...register('telefone')}
                            onChange={handlePhoneChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Salvar Usuário
                  </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowFormModal(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Usuário Criado"
        message="O usuário foi adicionado com sucesso e já pode acessar o sistema."
        buttonText="Continuar"
      />
    </div>
  );
};