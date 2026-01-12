import axios from 'axios';

// Cria a instância do Axios com a URL base definida no .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Antes de cada request sair, esse código roda para injetar as credenciais
api.interceptors.request.use(
  (config) => {
    // Busca credenciais no armazenamento local e no .env
    const token = localStorage.getItem('awl_token');
    const masterKey = import.meta.env.VITE_MASTER_KEY;

    // REGRA 1: Rotas de Super Admin (Criação de Empresas)
    // Se a URL contém '/admin', injeta a Master Key no header específico
    if (config.url?.includes('/admin') && masterKey) {
      config.headers['x-master-key'] = masterKey;
    }

    // REGRA 2: Rotas Protegidas Padrão
    // Se existe um token de usuário logado, injeta o cabeçalho Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA (Opcional, mas recomendado) ---
// Se o backend retornar 401 (Token Expirado/Inválido), limpa o storage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Evita limpar se for erro de login inicial (401 proposital)
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('awl_token');
        localStorage.removeItem('awl_user');
        window.location.href = '/'; // Redireciona para login
      }
    }
    return Promise.reject(error);
  }
);

export default api;