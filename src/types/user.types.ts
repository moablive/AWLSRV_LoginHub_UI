// Interface base do Usuário (usada em Auth, Listagens, etc)
export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'master' | 'admin' | 'usuario'; 
  empresa_id?: string | null; // Pode ser null se for Super Admin
  status?: 'ativo' | 'inativo';
  telefone?: string;
  last_login?: string;
}

// Payload para criar usuário
export interface CreateUserDTO {
  nome: string;
  email: string;
  password?: string; // Opcional se a lógica for gerar senha automática
  empresa_id: string; 
  role: 'admin' | 'usuario';
  telefone?: string;
}

// Payload para editar usuário
export interface UpdateUserDTO {
  nome?: string;
  email?: string;
  role?: 'admin' | 'usuario';
  telefone?: string;
  password?: string; // Opcional (reset de senha)
}