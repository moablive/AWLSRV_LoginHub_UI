import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { AdminLoginForm } from '../types';

export function Login() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Configuração do Formulário
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AdminLoginForm>();

  const onSubmit = async (data: AdminLoginForm) => {
    setFeedback(null);
    
    // Pequeno delay para feedback visual (UX)
    await new Promise(resolve => setTimeout(resolve, 600));

    // 1. Busca a chave do ambiente
    const envKey = import.meta.env.VITE_MASTER_KEY;

    // 2. Validação da Chave Mestra
    if (data.masterKey && data.masterKey === envKey) {
      console.log("✅ Login Master: Credenciais validadas com sucesso.");
      
      // -----------------------------------------------------------------------
      // ETAPA CRÍTICA: Configuração da Sessão
      // -----------------------------------------------------------------------
      
      // A. Define a flag para o 'SuperAdminRoute' (Nível 2 - Acesso /admin)
      sessionStorage.setItem('is_super_admin', 'true'); 
      
      // B. Define Tokens Dummy para o 'ProtectedRoute' (Nível 1 - Acesso Geral)
      // Se não fizermos isso, o Router acha que não estamos logados e bloqueia.
      localStorage.setItem('awl_token', 'master-infra-session'); 
      localStorage.setItem('awl_user', JSON.stringify({ 
        id: 'master', 
        nome: 'Super Administrator', 
        role: 'master',
        email: 'infra@loginhub.local'
      }));

      // 3. Redirecionamento
      navigate('/admin'); 

    } else {
      console.error("❌ Login Master: Chave incorreta.");
      setFeedback({ 
        type: 'error', 
        msg: 'Acesso Negado: A chave informada está incorreta.' 
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0 overflow-hidden" style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* CABEÇALHO */}
        <div className="card-header text-center py-4 bg-dark text-warning">
          <h1 className="h4 mb-0 fw-bold d-flex justify-content-center align-items-center gap-2">
            <i className="bi bi-shield-lock-fill"></i> LoginHub
          </h1>
          <p className="mb-0 small opacity-75 mt-1 text-white">
            Painel de Infraestrutura
          </p>
        </div>
        
        {/* CORPO */}
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">CHAVE MESTRA (MASTER KEY)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-key-fill text-secondary"></i>
                </span>
                <input 
                  {...register("masterKey", { required: true })} 
                  type="password" 
                  className="form-control border-start-0 ps-0 shadow-none" 
                  placeholder="••••••••••••••••"
                  autoFocus
                />
              </div>
            </div>

            {/* FEEDBACK DE ERRO */}
            {feedback && (
              <div className="alert alert-danger py-2 small text-center mb-3 border-0 bg-danger bg-opacity-10 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {feedback.msg}
              </div>
            )}

            {/* BOTÃO */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn w-100 py-2 fw-bold btn-dark text-warning"
            >
              {isSubmitting ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Acessando...</span>
              ) : (
                'Acessar Painel'
              )}
            </button>

          </form>
        </div>
        
        {/* RODAPÉ */}
        <div className="card-footer bg-light text-center py-3 border-top">
           <small className="text-muted fst-italic" style={{ fontSize: '0.7rem' }}>
             Ambiente Seguro • Acesso Monitorado
           </small>
        </div>

      </div>
    </div>
  );
}