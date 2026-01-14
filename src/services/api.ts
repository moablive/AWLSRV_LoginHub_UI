import axios from 'axios';
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
  (config) => {
    const token = localStorage.getItem('awl_token');
    const masterKey = import.meta.env.VITE_MASTER_KEY;

    // REGRA 1: Se for rota administrativa, anexa a Master Key
    // Isso permite criar empresas sem ter um usuário no banco ainda
    if (config.url?.includes('/admin') && masterKey) {
      config.headers['x-api-key'] = masterKey; 
    }

    // REGRA 2: Se tiver token logado, anexa o Bearer Token
    // Isso serve para autenticar usuários comuns
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =================================================================
// 2. INTERCEPTOR DE RESPOSTA (Retorno)
// =================================================================
api.interceptors.response.use(
  (response) => response, // Se der tudo certo (200, 201), só passa
  (error) => {
    
    // Se o erro for de RESPOSTA (o servidor respondeu algo)
    if (error.response) {
      const { status } = error.response;

      // 401 = Token Expirado ou Inválido
      if (status === 401) {
        // Evita loop infinito se já estivermos na tela de login
        if (!window.location.pathname.includes('/login')) {
          console.warn('Sessão expirada. Redirecionando para login...');
          authService.logout(); // Limpa tudo e manda pro login
        }
      }

      // 403 = Proibido (Tentou acessar área admin sem ser admin)
      if (status === 403) {
        console.error('Acesso negado: Você não tem permissão para este recurso.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;