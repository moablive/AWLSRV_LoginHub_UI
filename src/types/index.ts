export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
}

// ==========================================
// 2. ENUMS E AUXILIARES
// ==========================================

// Os papéis definidos no banco de dados (tabela niveis_acesso -> slug)
export type UserRole = 'admin' | 'usuario';


// Usuário logado ou listado
export interface User {
  id: string;
  empresa_id: string;
  role: UserRole;
  nome: string;
  email: string;
  telefone?: string;
  created_at?: string; 
}

// Empresa (Usado na lista do Super Admin)
export interface Company {
  id: string;
  nome: string;
  documento: string; // CNPJ/CPF
  email: string;
  telefone?: string;
  status?: string;   // 'ativo' | 'inativo'
  created_at?: string;
  
  // Campo calculado pela query SQL (contagem de funcionários)
  total_usuarios?: number; 
}

/**
 * Payload para Login
 * Endpoint: POST /auth/login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

// Alias para manter compatibilidade com componentes antigos
export type LoginCredentials = LoginDTO;

/**
 * Payload para Criar Nova Empresa (Tenant)
 * Endpoint: POST /admin/companies
 * * NOTA: Campos limpos (sem prefixo empresa_) para alinhar com o Backend
 */
export interface CreateCompanyDTO {
  // --- Dados da Empresa ---
  nome: string;       
  documento: string;  
  email: string;      
  telefone: string;

  // --- Dados do Admin Inicial ---
  admin_nome: string;
  admin_email: string;
  password: string;       
  admin_telefone: string;
}

/**
 * Payload para Criar Usuário
 * Endpoint: POST /admin/users
 */
export interface CreateUserDTO {
  empresa_id: string;
  role: UserRole;
  nome: string;
  email: string;
  password: string;
  telefone?: string; 
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MasterLoginForm {
  masterKey: string;
}
