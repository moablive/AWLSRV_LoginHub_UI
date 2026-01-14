import api from './api';
import type { LoginResponse } from '../types';

// Interface para o resultado da AÇÃO de logar
interface AuthResult {
  redirect: string;
}

export const authService = {
  /**
   * Gerencia o login unificado (Super Admin ou Usuário Comum)
   */
  login: async (email: string, password: string): Promise<AuthResult> => {
    
    // ------------------------------------------------------------------
    // 1. VERIFICAÇÃO SUPER ADMIN (Local / Master Key)
    // ------------------------------------------------------------------
    const masterKey = import.meta.env.VITE_MASTER_KEY;

    if (masterKey && password === masterKey) {
      console.log('🔑 Acesso Super Admin autenticado via Key local.');

      sessionStorage.setItem('is_super_admin', 'true');
      
      // Tokens dummy para passar pelo ProtectedRoute
      localStorage.setItem('awl_token', 'master-session-token'); 
      localStorage.setItem('awl_user', JSON.stringify({ 
        id: 'master', 
        nome: 'Super Administrator', 
        role: 'master' 
      }));
      
      return { redirect: '/admin' };
    }

    // ------------------------------------------------------------------
    // 2. LOGIN USUÁRIO COMUM (Via API Backend)
    // ------------------------------------------------------------------
    
    // REMOVIDO: O try/catch inútil. 
    // Se o api.post falhar, o erro sobe automaticamente para o componente.
    
    const { data } = await api.post<LoginResponse>('/auth/login', { 
      email, 
      password 
    });
    
    // Se chegou aqui, a API retornou 200 OK.
    localStorage.setItem('awl_token', data.token);
    localStorage.setItem('awl_user', JSON.stringify(data.usuario));
    localStorage.setItem('awl_empresa', JSON.stringify(data.empresa));
    
    // Garante que não há resquício de sessão de super admin
    sessionStorage.removeItem('is_super_admin');

    return { redirect: '/home' }; 
  },

  /**
   * Limpa todas as sessões e redireciona para login
   */
  logout: () => {
    console.log('🚪 Efetuando logout...');
    localStorage.removeItem('awl_token');
    localStorage.removeItem('awl_user');
    localStorage.removeItem('awl_empresa');
    sessionStorage.removeItem('is_super_admin');
    
    window.location.href = '/login';
  }
};