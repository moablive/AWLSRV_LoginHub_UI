import api from './api';
import type { LoginResponse, LoginCredentials, User } from '../types/index';

export const authService = {
  /**
   * Realiza o login do usuário (Admin de Empresa ou Funcionário)
   * Endpoint: POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Verifica se existe a Master Key no ambiente (para exibir o botão secreto)
   */
  hasMasterKey: (): boolean => {
    return !!import.meta.env.VITE_MASTER_KEY;
  },

  /**
   * Utilitário para Logout
   * Limpa tokens e dados do usuário do navegador
   */
  logout: () => {
    localStorage.removeItem('awl_token');
    localStorage.removeItem('awl_user');
    sessionStorage.removeItem('is_super_admin');
    window.location.href = '/'; // Força redirecionamento
  },

  /**
   * Recupera o usuário salvo no LocalStorage (se houver)
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('awl_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
};