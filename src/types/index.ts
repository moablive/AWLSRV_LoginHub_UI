// Tipagem para erros da API
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// ==========================================
// 1. ENUMS E TIPOS AUXILIARES
// ==========================================

// Os papéis definidos no banco de dados (tabela usuarios)
export type UserRole = 'admin' | 'usuario';

// ==========================================
// 2. MODELOS DE DADOS (O que o Front vê)
// ==========================================

// Representação do Usuário logado (Sem senha, sem dados inúteis)
export interface User {
  id: string;
  empresa_id: string;
  role: UserRole;
  nome: string;
  email: string;
  telefone?: string;
  // Opcional: Data de criação para exibir no perfil
  created_at?: string; 
}

// Representação básica de uma Empresa (Para listagens)
export interface Company {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone?: string;
  status?: boolean; // Se você implementar bloqueio no futuro
}

// ==========================================
// 3. DTOs (Data Transfer Objects - O que enviamos)
// ==========================================

/**
 * Payload para Login
 * Endpoint: POST /auth/login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Payload para Criar Nova Empresa (Painel Super Admin)
 * Endpoint: POST /admin/companies
 * NOTA: Mantivemos snake_case (ex: empresa_nome) pois o 
 * Controller do Backend espera exatamente essas chaves.
 */
export interface CreateCompanyDTO {
  // --- Dados da Empresa ---
  empresa_nome: string;
  empresa_documento: string; // CNPJ/CPF
  empresa_email: string;
  empresa_telefone: string;

  // --- Dados do Admin Inicial ---
  admin_nome: string;
  admin_email: string;
  admin_password: string; // A senha trafega apenas aqui
  admin_telefone: string;
}

/**
 * Payload para Criar Usuário em uma Empresa já existente
 * Endpoint: POST /users (ou rota similar administrativa)
 */
export interface CreateUserDTO {
  empresa_id: string; // Obrigatório vincular
  role: UserRole;
  nome: string;
  email: string;
  password: string;
  telefone: string;
}

// ==========================================
// 4. RESPOSTAS DA API
// ==========================================

// Resposta do Login
export interface LoginResponse {
  token: string;
  user: User;
}

// Resposta Padrão de Sucesso/Erro
export interface ApiResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
}


export interface LoginCredentials {
  email: string;
  password: string;
}
