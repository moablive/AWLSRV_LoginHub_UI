import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios'; 

// Services e Types
import { superAdminService } from '../../services/superAdminService';
import type { User, CreateUserDTO, ApiErrorResponse } from '../../types';

// Componentes Visuais
import { SuccessModal } from '../../components/shared/SuccessModal/SuccessModal';

export const CompanyUsers = () => {
  const { id: empresaId } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  // Estados de Dados
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Formulário (Removido 'errors' pois não estamos usando msg de erro visual nos inputs deste modal simples)
  const { register, handleSubmit, reset } = useForm<CreateUserDTO>();

  // Lógica de Carregamento (Memoizada com useCallback para usar no useEffect e no reload)
  const fetchUsers = useCallback(async () => {
    if (!empresaId) return;
    try {
      // setLoading(true) opcional aqui, dependendo se quer piscar a tela no reload
      const data = await superAdminService.getUsersByCompany(empresaId);
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários', error);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Carregamento Inicial
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Dependência correta agora

  const onAddUser = async (data: CreateUserDTO) => {
    if (!empresaId) return;
    try {
      await superAdminService.createUser({
        ...data,
        empresa_id: empresaId
      });
      
      // 1. Fecha o modal de formulário
      setShowFormModal(false);
      
      // 2. Abre o modal de sucesso (Bonito)
      setShowSuccessModal(true);
      
      // 3. Limpa e Recarrega
      reset(); 
      fetchUsers(); 
      
    } catch (error) {
      // Tratamento de Erro Tipado
      const err = error as AxiosError<ApiErrorResponse>;
      const msg = err.response?.data?.message || 'Erro desconhecido ao adicionar usuário.';
      alert(`Erro: ${msg}`);
    }
  };

  return (
    <div className="container mt-4">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">👥 Gestão de Usuários</h2>
          <small className="text-muted">Empresa ID: {empresaId}</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>Voltar</button>
          <button className="btn btn-success" onClick={() => setShowFormModal(true)}>+ Novo Usuário</button>
        </div>
      </div>

      {/* LISTAGEM */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Carregando usuários...</p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Nome</th>
                  <th>E-mail</th>
                  <th>Role</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center p-4 text-muted">Nenhum usuário encontrado nesta empresa.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-bold ps-4">{user.nome}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-warning text-dark' : 'bg-info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL DE FORMULÁRIO (Bootstrap Native) --- */}
      {showFormModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Adicionar Usuário</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit(onAddUser)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Nome Completo</label>
                    <input {...register('nome', { required: true })} className="form-control" placeholder="Ex: João da Silva" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">E-mail de Acesso</label>
                    <input type="email" {...register('email', { required: true })} className="form-control" placeholder="joao@empresa.com" />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">Senha Provisória</label>
                      <input type="password" {...register('password', { required: true })} className="form-control" placeholder="******" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small">Nível de Acesso</label>
                      <select {...register('role')} className="form-select">
                        <option value="usuario">Usuário Padrão</option>
                        <option value="admin">Admin da Empresa</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Telefone</label>
                    <input {...register('telefone')} className="form-control" placeholder="(00) 0000-0000" />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar Usuário</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE SUCESSO (Novo Componente) --- */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Usuário Adicionado!"
        message="O usuário foi vinculado à empresa com sucesso e já pode realizar login."
        buttonText="Continuar Gerenciando"
        autoCloseDuration={4000} // Fecha sozinho em 4s se quiser
      />
    </div>
  );
};