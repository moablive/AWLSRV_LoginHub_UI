import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { MasterLoginForm } from '../types/index'

export default function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<MasterLoginForm>();

  const onSubmit = async (data: MasterLoginForm) => {
    setErrorMsg('');
    
    // Simula um pequeno delay para UX (opcional)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Busca a chave real no arquivo .env
    const envMasterKey = import.meta.env.VITE_MASTER_KEY;

    // 2. Validação Rígida
    if (data.masterKey === envMasterKey) {
      // SUCESSO: A chave bateu.
      // Opcional: Salvar em sessionStorage para persistir a sessão durante o uso
      sessionStorage.setItem('is_super_admin', 'true');
      
      // Redireciona para a área de infraestrutura
      navigate('/super-admin');
    } else {
      // ERRO
      setErrorMsg('Acesso Negado: Chave Mestra inválida.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ borderColor: '#d97706' }}> {/* Cor de alerta/admin */}
        
        <h1>🛡️ Infraestrutura</h1>
        <p className="subtitle">Painel de Provisionamento (Master Access)</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Campo Único: Master Key */}
          <div className="form-group">
            <label>Master Key</label>
            <input 
              {...register("masterKey", { required: true })} 
              type="password" 
              placeholder="Insira a chave de infraestrutura..."
              autoFocus
            />
          </div>

          {/* Mensagem de Erro */}
          {errorMsg && (
            <div className="alert-error" style={{ textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {/* Botão de Entrar */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-warning" // Classe visual sugerida para diferenciar de login comum
          >
            {isSubmitting ? 'Verificando...' : 'Acessar Sistema'}
          </button>
        </form>
        
        <div className="master-area">
          <hr />
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            Este acesso não gera tokens de usuário.<br/>
            Uso exclusivo para manutenção.
          </p>
        </div>

      </div>
    </div>
  );
}