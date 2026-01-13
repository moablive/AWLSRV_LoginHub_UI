import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { superAdminService } from '../../services/superAdminService';
import type { CreateCompanyDTO, ApiErrorResponse } from '../../types';

export default function CreateCompany() {
  const navigate = useNavigate();
  
  // 1. CORREÇÃO: Removemos o 'any' usando o Generic <CreateCompanyDTO>
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCompanyDTO>();
  
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // 2. CORREÇÃO: Função tipada corretamente
  const onSubmit = async (data: CreateCompanyDTO) => {
    setFeedback(null);
    try {
      // Chama a API real
      await superAdminService.createCompany(data);
      
      setFeedback({ type: 'success', msg: 'Empresa criada com sucesso! Redirecionando...' });
      
      // Aguarda 1.5s para o usuário ler a mensagem antes de voltar para a lista
      setTimeout(() => {
        navigate('/super-admin/empresas');
      }, 1500);

    } catch (err) {
      console.error(err);
      const error = err as AxiosError<ApiErrorResponse>;
      const msg = error.response?.data?.error || 
                  error.response?.data?.message || 
                  'Erro ao criar empresa.';
      
      setFeedback({ type: 'error', msg });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Nova Empresa (Tenant)</h2>
          <p className="subtitle">Preencha os dados para provisionar um novo ambiente.</p>
        </div>
        <button onClick={() => navigate('/super-admin/empresas')} className="btn-text">
          Cancelar
        </button>
      </div>

      {feedback && (
        <div className={`alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        
        <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* COLUNA 1: DADOS DA EMPRESA */}
          <div>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>🏢 Dados da Empresa</h3>
            
            <div className="form-group">
              <label>Nome Fantasia</label>
              <input 
                {...register("nome", { required: "Nome é obrigatório" })} 
                className="input-field" 
                placeholder="Ex: Astral Tech Ltda"
              />
              {errors.nome && <span className="error">{errors.nome.message}</span>}
            </div>

            <div className="form-group">
              <label>CNPJ / Documento</label>
              <input 
                {...register("documento", { required: "Documento é obrigatório" })} 
                className="input-field" 
                placeholder="00.000.000/0001-00"
              />
              {errors.documento && <span className="error">{errors.documento.message}</span>}
            </div>

            <div className="form-group">
              <label>E-mail Corporativo</label>
              <input 
                {...register("email", { required: "E-mail da empresa é obrigatório" })} 
                type="email"
                className="input-field" 
                placeholder="contato@empresa.com"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Telefone Comercial</label>
              <input 
                {...register("telefone", { required: "Telefone é obrigatório" })} 
                className="input-field" 
                placeholder="(00) 0000-0000"
              />
              {errors.telefone && <span className="error">{errors.telefone.message}</span>}
            </div>
          </div>

          {/* COLUNA 2: DADOS DO ADMIN */}
          <div>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>👤 Admin Inicial</h3>
            
            <div className="form-group">
              <label>Nome do Responsável</label>
              <input 
                {...register("admin_nome", { required: "Nome do admin é obrigatório" })} 
                className="input-field" 
                placeholder="Ex: João Silva"
              />
              {errors.admin_nome && <span className="error">{errors.admin_nome.message}</span>}
            </div>

            <div className="form-group">
              <label>E-mail de Login (Admin)</label>
              <input 
                {...register("admin_email", { required: "Login é obrigatório" })} 
                type="email" 
                className="input-field" 
                placeholder="joao@empresa.com"
              />
              {errors.admin_email && <span className="error">{errors.admin_email.message}</span>}
            </div>

            <div className="form-group">
              <label>Senha Inicial</label>
              <input 
                {...register("password", { required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
              />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>Telefone do Admin</label>
              <input 
                {...register("admin_telefone", { required: "Telefone do admin é obrigatório" })} 
                className="input-field" 
                placeholder="(00) 90000-0000"
              />
              {errors.admin_telefone && <span className="error">{errors.admin_telefone.message}</span>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ padding: '12px 24px', fontSize: '1rem' }}
          >
            {isSubmitting ? 'Criando...' : '✅ Confirmar e Criar Tenant'}
          </button>
        </div>

      </form>
    </div>
  );
}