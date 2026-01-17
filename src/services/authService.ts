import api from './api';
import type { LoginResponse, User, AuthResult } from '../types';

export const authService = {
  /**
   * Realiza login (Super Admin via Env ou Usuário via API)
   */
  login: async (email: string, password: string): Promise<AuthResult> => {
    
    // 1. Verificação Super Admin (Master Key)
    const masterKey = import.meta.env.VITE_MASTER_KEY;

    if (masterKey && password === masterKey) {
      sessionStorage.setItem('is_super_admin', 'true');
      localStorage.removeItem('awl_token'); // Remove token para ativar x-api-key no interceptor

      const adminUser: User = { 
        id: 'master-root', 
        nome: 'Super Administrator', 
        email, 
        role: 'master', 
        empresa_id: null 
      };
      
      localStorage.setItem('awl_user', JSON.stringify(adminUser));
      return { redirect: '/companies' }; 
    }

    // 2. Login Padrão (API)
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    
    localStorage.setItem('awl_token', data.token);
    localStorage.setItem('awl_user', JSON.stringify(data.usuario));
    
    if (data.empresa) {
        localStorage.setItem('awl_empresa', JSON.stringify(data.empresa));
    }
    
    sessionStorage.removeItem('is_super_admin');
    return { redirect: '/dashboard' }; 
  },

  logout: () => {
    localStorage.removeItem('awl_token');
    localStorage.removeItem('awl_user');
    localStorage.removeItem('awl_empresa');
    sessionStorage.removeItem('is_super_admin');
    
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('awl_token');
    const isSuperAdmin = sessionStorage.getItem('is_super_admin') === 'true';
    return !!token || isSuperAdmin;
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('awl_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
};