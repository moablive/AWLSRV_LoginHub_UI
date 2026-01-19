// src/types/user.types.ts

/**
 * 1. Interface base do Usuário
 * Representa o objeto como ele vem do Banco de Dados/API (GET)
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  
  // O 'master' existe apenas na lógica do Frontend (Login via .env)
  // ou se você tiver um superadmin no banco.
  role: 'master' | 'admin' | 'usuario'; 
  
  // Essencial para lógica condicional (Super Admin = null)
  empresa_id?: string | null; 
  
  status?: 'ativo' | 'inativo';
  
  // Banco geralmente retorna null se estiver vazio, 
  // mas o formulário pode enviar undefined/string vazia.
  telefone?: string | null;   
  
  last_login?: string | null;
}

/**
 * 2. Resposta da API de Login
 * Usada no authService
 */
export interface LoginResponse {
  token: string;
  usuario: User;
  // A empresa vem junto para facilitar o contexto no Frontend
  empresa?: {
    id: string;
    nome: string;
    status: 'ativo' | 'inativo';
  };
}

/**
 * 3. Resultado do processamento de Auth
 * Usada pelo hook ou service para decidir o redirecionamento
 */
export interface AuthResult {
  redirect: string;
}

/**
 * 4. Payload para CRIAR usuário (POST)
 * Note que 'master' não pode ser criado via API comum
 */
export interface CreateUserDTO {
  nome: string;
  email: string;
  password: string; // Obrigatória na criação
  empresa_id: string; 
  role: 'admin' | 'usuario';
  telefone?: string;
}

/**
 * 5. Payload para EDITAR usuário (PUT)
 * Campos opcionais pois o usuário pode editar apenas um dado
 */
export interface UpdateUserPayload {
  nome: string;
  email: string;
  telefone?: string; 
  password?: string; // Opcional (só envia se for trocar a senha)
  role?: 'admin' | 'usuario'; 
  status?: 'ativo' | 'inativo'; // Útil se for implementar bloqueio
}

/**
 * 6. Props para Componentes (Modais)
 */
export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback para recarregar a lista (refetch)
  companyId: string;     // ID da empresa contexto
}