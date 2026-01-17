// ==========================================
// 1. RE-EXPORTS (Centralizador)
// ==========================================
export * from './company.types';
export * from './user.types'; // Agora exporta 'User' corretamente

// Imports para uso interno neste arquivo
import type { User } from './user.types';
import type { Company } from './company.types';

// ==========================================
// 2. TIPOS GERAIS DE API
// ==========================================
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==========================================
// 3. TIPOS DE AUTENTICAÇÃO
// ==========================================
export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;      
  empresa?: Company;   
}

export interface AuthResult {
  redirect: string;
}

export interface SuperAdminSession {
  isMaster: boolean;
  timestamp: number;
}