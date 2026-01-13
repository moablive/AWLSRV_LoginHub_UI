import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { superAdminService } from '../services/superAdminService'; // Use o service dedicado
import type { CreateCompanyDTO, ApiErrorResponse } from '../types';

// Tipagem para o feedback visual
interface Feedback {
  type: 'success' | 'error';
  message: string;
}

export default function SuperAdmin() {
  const navigate = useNavigate();
  
  // O useForm agora valida contra as chaves corretas: nome, documento, email, password...
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCompanyDTO>();
  
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onSubmit = async (data: CreateCompanyDTO) => {
    setFeedback(null);
    try {
      // Chama o serviço dedicado ao Super Admin
      await superAdminService.createCompany(data);
      
      setFeedback({ 
        type: 'success', 
        message: `✅ Sucesso! A empresa "${data.nome}" foi provisionada.` // data.nome (novo padrão)
      });
      
      reset(); 
      window.scrollTo(0, 0);

    } catch (err) {
      console.error(err);
      
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
                {/* CORREÇÃO: "empresa_nome" -> "nome" */}
                <input 
                  {...register("nome", { required: "Nome é obrigatório" })} 
                  placeholder="Ex: Astral Tech" 
                />
                {errors.nome && <span className="error">{errors.nome.message}</span>}
              </div>

              <div className="form-group">
                <label>Documento (CNPJ/CPF)</label>
                {/* CORREÇÃO: "empresa_documento" -> "documento" */}
                <input 
                  {...register("documento", { required: "Documento é obrigatório" })} 
                  placeholder="00.000.000/0001-00" 
                />
                {errors.documento && <span className="error">{errors.documento.message}</span>}
              </div>

              <div className="form-group">
                <label>E-mail da Empresa</label>
                {/* CORREÇÃO: "empresa_email" -> "email" */}
                <input 
                  {...register("email", { required: "Email corporativo obrigatório" })} 
                  type="email" 
                  placeholder="contato@astraltech.com" 
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Telefone</label>
                {/* CORREÇÃO: "empresa_telefone" -> "telefone" */}
                <input {...register("telefone")} placeholder="(00) 00000-0000" />
              </div>
            </div>

            {/* COLUNA 2: DADOS DO ADMIN */}
            <div className="column">
              <h3>👤 Admin Inicial</h3>
              
              <div className="form-group">
                <label>Nome do Dono</label>
                {/* Este campo permaneceu igual no DTO */}
                <input 
                  {...register("admin_nome", { required: "Nome do admin é obrigatório" })} 
                  placeholder="Ex: Moab" 
                />
                {errors.admin_nome && <span className="error">{errors.admin_nome.message}</span>}
              </div>

              <div className="form-group">
                <label>Login (E-mail Pessoal)</label>
                {/* Este campo permaneceu igual no DTO */}
                <input 
                  {...register("admin_email", { required: "Login é obrigatório" })} 
                  type="email" 
                  placeholder="moab@astraltech.com" 
                />
                {errors.admin_email && <span className="error">{errors.admin_email.message}</span>}
              </div>

              <div className="form-group">
                <label>Senha Inicial</label>
                {/* CORREÇÃO: "admin_password" -> "password" */}
                <input 
                  {...register("password", { 
                    required: "Senha inicial obrigatória", 
                    minLength: { value: 6, message: "Mínimo 6 caracteres"} 
                  })} 
                  type="password" 
                  placeholder="••••••••" 
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
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