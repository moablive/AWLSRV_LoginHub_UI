import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'; 

import { authService } from '../services/authService';
import type { LoginDTO } from '../types';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginDTO>();

  const onSubmit = async (data: LoginDTO): Promise<void> => {
    setLoginError(null);
    try {
      // 1. Lógica Master Key:
      // O campo de e-mail foi removido da UI. 
      // Enviamos um valor interno fixo apenas para satisfazer a API/Service,
      // pois o Backend validará a Master Key independentemente do e-mail.
      const hiddenMasterEmail = 'master@infra.local';

      // Enviamos a senha digitada (que é a Master Key) e o e-mail oculto
      const result = await authService.login(hiddenMasterEmail, data.password);
      
      navigate(result.redirect);
      
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setLoginError('Master Key inválida. Acesso negado.');
        } else if (error.code === 'ERR_NETWORK') {
          setLoginError('Erro de conexão com o servidor.');
        } else {
          setLoginError(`Erro: ${error.message || 'Falha na requisição'}`);
        }
      } else if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        {/* CABEÇALHO */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            LoginHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesso Administrativo (Master Key)
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* INPUT SENHA / MASTER KEY (ÚNICO CAMPO) */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Master Key</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Insira a Master Key"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* FEEDBACK DE ERRO */}
          {loginError && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Falha na Autenticação</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{loginError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTÃO SUBMIT */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          &copy; 2026 LoginHub Infrastructure. Acesso restrito ao Super Admin.
        </p>
      </div>
    </div>
  );
}