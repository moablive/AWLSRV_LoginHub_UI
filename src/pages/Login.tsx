import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import type { ApiErrorResponse,LoginCredentials } from '../types/index';


export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();
  const [loginError, setLoginError] = useState('');

  // Verifica se existe Master Key no .env para mostrar o atalho
  const isMasterAdmin = authService.hasMasterKey();

  const onSubmit = async (data: LoginCredentials) => {
    setLoginError('');
    try {
      // 1. Chama a API
      const response = await authService.login(data);

      // 2. Salva Token e User no LocalStorage
      localStorage.setItem('awl_token', response.token);
      localStorage.setItem('awl_user', JSON.stringify(response.user));

      // 3. Redireciona para o Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      
      // Tratamento tipado do erro
      const error = err as AxiosError<ApiErrorResponse>;
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Falha no acesso. Verifique seu e-mail e senha.';
      
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 AWL LoginHub</h1>
        <p className="subtitle">Identifique-se para acessar o ecossistema.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Email */}
          <div className="form-group">
            <label>E-mail Corporativo</label>
            <input 
              {...register("email", { required: "E-mail é obrigatório" })} 
              type="email" 
              placeholder="admin@empresa.com"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          {/* Campo Senha */}
          <div className="form-group">
            <label>Senha</label>
            <input 
              {...register("password", { required: "Senha é obrigatória" })} 
              type="password" 
              placeholder="••••••••"
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          {/* Mensagem de Erro Geral */}
          {loginError && <div className="alert-error">{loginError}</div>}

          {/* Botão de Entrar */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>

        {/* Área Super Admin (Só aparece se tiver Master Key no .env) */}
        {isMasterAdmin && (
          <div className="master-area">
            <hr />
            <p>🔧 Modo Desenvolvimento / Master</p>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/super-admin')}
            >
              Acessar Painel Super Admin (Master Key)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}