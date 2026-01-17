export interface Company {
  id: string;
  nome: string;
  documento: string; // CNPJ ou CPF
  email: string;     // E-mail de contato da empresa
  telefone?: string;
  status: 'ativo' | 'inativo'; // Union type é melhor que string solta
  data_cadastro?: string;
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