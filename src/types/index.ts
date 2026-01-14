// ==========================================
// 1. RE-EXPORTS (Módulos Específicos)
// ==========================================
// Disponibiliza User, Company, CreateCompanyDTO, etc. para toda a aplicação
export * from './company.types';
export * from './user.types';

// Importamos tipos específicos apenas para usar dentro deste arquivo (nas respostas abaixo)
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
// 3. TIPOS DE AUTENTICAÇÃO (Auth)
// ==========================================

/**
 * Usado para tipagem de formulário de login admin (opcional)
 */
export interface AdminLoginForm {
  masterKey: string;
}

/**
 * Payload enviado no POST /auth/login (Usuário Comum)
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Resposta exata do Backend (API) ao logar com sucesso
 */
export interface LoginResponse {
  token: string;
  usuario: User;      // Dados do usuário logado
  empresa: Company;   // Dados da empresa a qual ele pertence
}

/**
 * Interface para o retorno do Service de Auth no Frontend
 * IMPORTANTE: É usado no authService.ts para saber para onde redirecionar
 */
export interface AuthResult {
  redirect: string;
}

/**
 * Usado apenas no Frontend para tipar a Session do Super Admin
 */
export interface SuperAdminSession {
  isMaster: boolean;
  timestamp: number;
}