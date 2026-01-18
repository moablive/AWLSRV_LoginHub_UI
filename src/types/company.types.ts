export interface Company {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone?: string;
  status: 'ativo' | 'inativo';
  data_cadastro?: string | Date; 
  total_usuarios?: number;
}

// Payload para criar empresa (Combina Empresa + Admin Inicial)
export interface CreateCompanyDTO {
  // Dados da Empresa
  nome: string;
  documento: string;
  email: string;
  telefone?: string;

  // Dados do Admin Inicial
  admin_nome: string;
  admin_email: string;
  password: string;
  admin_telefone?: string;
}

// Payload para editar apenas dados da empresa
export interface UpdateCompanyDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  documento?: string;
  status?: 'ativo' | 'inativo';
}


export interface CreateCompanyResponse {
  empresaId: string;
  nome: string;
  documento: string;
  email: string;
  adminEmail: string;
  message: string;
}