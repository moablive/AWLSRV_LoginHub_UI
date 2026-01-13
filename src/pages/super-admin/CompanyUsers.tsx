import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { superAdminService } from '../../services/superAdminService';
import type { CreateUserDTO, User, ApiErrorResponse } from '../../types';

export default function CompanyUsers() {
  // Tipagem do ID vindo da URL
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  // Estados locais
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Configuração do Formulário
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserDTO>({
    defaultValues: { role: 'usuario' } // Valor padrão para o select
  });

  // 1. Função para carregar usuários (GET)
  const fetchUsers = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoadingList(true);
      const data = await superAdminService.listUsersByCompany(id);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: 'Erro ao carregar lista de usuários.' });
    } finally {
      setIsLoadingList(false);
    }
  }, [id]);

  // Carrega ao montar a tela
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 2. Função para criar usuário (POST)
  const onAddUser = async (data: CreateUserDTO) => {
    if (!id) return;
    setFeedback(null);
    setIsCreating(true);

    try {
      // Injeta o ID da empresa (vindo da URL) no payload
      const payload: CreateUserDTO = {
        ...data,
        empresa_id: id
      };

      await superAdminService.createUser(payload);

      setFeedback({ type: 'success', msg: `Usuário "${data.nome}" adicionado com sucesso!` });
      reset(); // Limpa o formulário
      fetchUsers(); // Recarrega a lista automaticamente

    } catch (err) {
      console.error(err);
      const error = err as AxiosError<ApiErrorResponse>;
      const msg = error.response?.data?.error || 
                  error.response?.data?.message || 
                  'Erro ao criar usuário.';
      setFeedback({ type: 'error', msg });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      {/* Cabeçalho / Voltar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/super-admin/empresas')} 
          className="btn-text"
          style={{ padding: 0 }}
        >
          ← Voltar para Lista de Empresas
        </button>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>Empresa ID: {id}</span>
      </div>
      
      <h2 style={{ marginBottom: '20px' }}>Gerenciar Usuários</h2>

      {feedback && (
        <div className={`alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {feedback.msg}
        </div>
      )}
      
      <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* === FORMULÁRIO DE ADIÇÃO === */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>➕ Novo Usuário</h3>
          <p className="subtitle" style={{ marginBottom: '1rem' }}>Adicione um acesso a esta empresa.</p>
          
          <form onSubmit={handleSubmit(onAddUser)}>
            <div className="form-group">
              <label>Nome Completo</label>
              <input 
                {...register("nome", { required: "Nome é obrigatório" })} 
                className="input-field" 
                placeholder="Ex: João Silva"
              />
              {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>

            <div className="form-group">
              <label>E-mail de Acesso</label>
              <input 
                {...register("email", { required: "E-mail é obrigatório" })} 
                type="email" 
                className="input-field" 
                placeholder="joao@empresa.com"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Senha Provisória</label>
              <input 
                {...register("password", { required: "Senha é obrigatória", minLength: 6 })} 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
              />
              {errors.password && <span className="error">Mínimo 6 caracteres</span>}
            </div>

            <div className="form-group">
              <label>Nível de Permissão</label>
              <select {...register("role")} className="input-field">
                <option value="usuario">Usuário Padrão</option>
                <option value="admin">Admin da Empresa</option>
              </select>
            </div>

            <div className="form-group">
              <label>Telefone (Opcional)</label>
              <input {...register("telefone")} className="input-field" placeholder="(00) 00000-0000" />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isCreating}>
              {isCreating ? 'Salvando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        </div>

        {/* === LISTA DE USUÁRIOS EXISTENTES === */}
        <div className="card">
          <h3>👥 Usuários Ativos</h3>
          
          {isLoadingList ? (
            <p style={{ color: '#666', padding: '20px' }}>Carregando usuários...</p>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum usuário cadastrado nesta empresa além do dono.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome / E-mail</th>
                  <th>Nível</th>
                  <th>Telefone</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.nome}</strong><br/>
                      <small style={{ color: '#64748b' }}>{u.email}</small>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        background: u.role === 'admin' ? '#e0e7ff' : '#f1f5f9',
                        color: u.role === 'admin' ? '#4338ca' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.telefone || '-'}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}