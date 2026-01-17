import axios, { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// =================================================================
// 1. INTERCEPTOR DE REQUISIÇÃO (Saída)
// =================================================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // CORREÇÃO: Removemos o 'any' e usamos a tipagem correta do Axios
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    const token = localStorage.getItem('awl_token');
    const masterKey = import.meta.env.VITE_MASTER_KEY;
    
    // Verifica se é uma rota administrativa
    const isAdminRoute = config.url?.includes('/admin');

    // LÓGICA DE AUTENTICAÇÃO HIERÁRQUICA:
    
    // 1. Prioridade Máxima: Se tem usuário logado, usamos o Token.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } 
    // 2. Fallback de "Bootstrap": Rota admin sem token + Chave Mestra
    else if (isAdminRoute && masterKey) {
      config.headers['x-api-key'] = masterKey; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =================================================================
// 2. INTERCEPTOR DE RESPOSTA (Retorno)
// =================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response) {
      const { status } = error.response;

      // 401: Token Expirado, Inválido ou Ausente
      if (status === 401) {
        if (!window.location.pathname.includes('/login')) {
          console.warn('Sessão expirada ou inválida. Redirecionando...');
          authService.logout(); 
        }
      }

      // 403: Proibido
      if (status === 403) {
        console.error('⛔ Acesso negado: Nível de permissão insuficiente.');
      }
      
      // 500: Erro de Servidor
      if (status >= 500) {
        console.error('🔥 Erro interno do servidor. Contate o suporte.');
      }
    } else {
      // Erro de conexão
      console.error('🚨 Erro de conexão: O backend parece estar offline.');
    }
    
    return Promise.reject(error);
  }
);

export default api;