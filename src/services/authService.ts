import api from './api';
import type { LoginResponse, LoginCredentials } from '../types/index';

export const authService = {
  // Login padrão para obter JWT
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  // Método utilitário para checar se a Master Key está ativa
  hasMasterKey: (): boolean => {
    return !!import.meta.env.VITE_MASTER_KEY;
  }
};