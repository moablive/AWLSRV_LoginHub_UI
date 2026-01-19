// src/types/company.types.ts

// 1. Interface base da Empresa (Listagem/GET)
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

// 2. Payload para CRIAR empresa (POST)
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

// 3. Payload para EDITAR empresa (PUT)
export interface UpdateCompanyDTO {
  nome: string;      // Obrigatório para o SQL
  email: string;     // Obrigatório para o SQL
  documento: string; // Obrigatório para o SQL
  telefone?: string; // Opcional
}

// 4. Resposta de sucesso na criação
export interface CreateCompanyResponse {
  empresaId: string;
  nome: string;
  documento: string;
  email: string;
  adminEmail: string;
  message: string;
}