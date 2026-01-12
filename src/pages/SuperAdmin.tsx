import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../services/api';
import type { CreateCompanyDTO } from '../types';

// Tipagem para o feedback visual
interface Feedback {
  type: 'success' | 'error';
  message: string;
}

// Tipagem para erros da API
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export default function SuperAdmin() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCompanyDTO>();
  
  // Estado para feedback visual (Sucesso ou Erro)
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onSubmit = async (data: CreateCompanyDTO) => {
    setFeedback(null);
    try {
      // O interceptor do api.ts detecta "/admin" e injeta a x-master-key automaticamente
      await api.post('/admin/companies', data);
      
      setFeedback({ 
        type: 'success', 
        message: `✅ Sucesso! A empresa "${data.empresa_nome}" foi provisionada.` 
      });
      
      reset(); // Limpa o formulário
      window.scrollTo(0, 0);

    } catch (err) {
      console.error(err);
      
      // Tratamento tipado do erro
      const error = err as AxiosError<ApiErrorResponse>;
      const msg = error.response?.data?.error || 
                  error.response?.data?.message || 
                  'Erro desconhecido ao criar empresa.';
      
      setFeedback({ type: 'error', message: `❌ Falha: ${msg}` });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="admin-container">
      <div className="login-card admin-card">
        <header className="admin-header">
            <h2>🤵🏻 Painel Master</h2>
            <p>Provisionamento de Novos Clientes (Tenants)</p>
        </header>

        {/* Feedback de Erro/Sucesso */}
        {feedback && (
          <div className={`alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            
            {/* COLUNA 1: DADOS DA EMPRESA */}
            <div className="column">
              <h3>🏢 Empresa</h3>
              
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input 
                  {...register("empresa_nome", { required: "Nome é obrigatório" })} 
                  placeholder="Ex: Astral Tech" 
                />
                {errors.empresa_nome && <span className="error">{errors.empresa_nome.message}</span>}
              </div>

              <div className="form-group">
                <label>Documento (CNPJ/CPF)</label>
                <input 
                  {...register("empresa_documento", { required: "Documento é obrigatório" })} 
                  placeholder="00.000.000/0001-00" 
                />
                {errors.empresa_documento && <span className="error">{errors.empresa_documento.message}</span>}
              </div>

              <div className="form-group">
                <label>E-mail da Empresa</label>
                <input 
                  {...register("empresa_email", { required: "Email corporativo obrigatório" })} 
                  type="email" 
                  placeholder="contato@astraltech.com" 
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input {...register("empresa_telefone")} placeholder="(00) 00000-0000" />
              </div>
            </div>

            {/* COLUNA 2: DADOS DO ADMIN */}
            <div className="column">
              <h3>👤 Admin Inicial</h3>
              
              <div className="form-group">
                <label>Nome do Dono</label>
                <input 
                  {...register("admin_nome", { required: "Nome do admin é obrigatório" })} 
                  placeholder="Ex: Moab" 
                />
              </div>

              <div className="form-group">
                <label>Login (E-mail Pessoal)</label>
                <input 
                  {...register("admin_email", { required: "Login é obrigatório" })} 
                  type="email" 
                  placeholder="moab@astraltech.com" 
                />
              </div>

              <div className="form-group">
                <label>Senha Inicial</label>
                <input 
                  {...register("admin_password", { required: "Senha inicial obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres"} })} 
                  type="password" 
                  placeholder="••••••••" 
                />
                {errors.admin_password && <span className="error">{errors.admin_password.message}</span>}
              </div>

              <div className="form-group">
                <label>Telefone do Dono</label>
                <input {...register("admin_telefone")} placeholder="(00) 00000-0000" />
              </div>
            </div>

          </div>

          <div className="actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
              ← Voltar ao Login
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Provisionando...' : '🚀 Criar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}