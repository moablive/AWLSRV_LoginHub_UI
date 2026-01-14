export type CompanyStatus = 'ativo' | 'inativo' | 'bloqueado';

export interface Company {
  id: string;
  nome: string;
  documento: string; // CNPJ ou CPF
  email: string;     // Email corporativo
  telefone?: string;
  status: CompanyStatus;
  
  // Metadados de Data
  created_at?: string;

  // --- NOVOS CAMPOS PARA ESTATÍSTICAS ---
  // Estes campos devem vir calculados do Backend (SQL Count)
  total_admins?: number;  // Quantidade de usuários com role = 'admin'
  total_users?: number;   // Quantidade de usuários com role = 'usuario'
  
  // Opcional: Total geral (soma dos dois acima)
  total_usuarios?: number; 
}

/**
 * DTO Híbrido: Cria Empresa + Admin Inicial
 * Endpoint: POST /admin/companies
 */
export interface CreateCompanyDTO {
  // --- Parte 1: Empresa ---
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  
  // --- Parte 2: Admin Inicial ---
  admin_nome: string;
  admin_email: string;
  password: string;       // Senha do admin
  admin_telefone: string;
}

export interface UpdateCompanyDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: CompanyStatus;
}