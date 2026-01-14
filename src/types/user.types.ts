export type UserRole = 'admin' | 'usuario' | 'master'; // 'master' é apenas frontend (session)

export interface User {
  id: string;
  empresa_id: string; // FK obrigatória
  nome: string;
  email: string;
  role: UserRole;
  telefone?: string;
  
  // Datas (O backend pode retornar snake_case ou camelCase, padronize aqui)
  created_at?: string; 
  updated_at?: string;
}

export interface CreateUserDTO {
  // Obrigatórios para criar via API
  empresa_id: string; 
  role: UserRole;
  nome: string;
  email: string;
  password: string; // Obrigatória na criação
  telefone?: string;
}

export interface UpdateUserDTO {
  nome?: string;
  role?: UserRole;
  telefone?: string;
  password?: string; // Opcional na edição
}