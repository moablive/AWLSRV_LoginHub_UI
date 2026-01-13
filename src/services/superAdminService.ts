import axios from 'axios';
import type { 
  CreateCompanyDTO, 
  CreateUserDTO, 
  Company, 
  User
} from '../types';

// Configuração Base
const API_URL = import.meta.env.VITE_API_URL;
const MASTER_KEY = import.meta.env.VITE_MASTER_KEY;

// Verifica se a chave existe (segurança em tempo de desenvolvimento)
if (!MASTER_KEY) {
  console.warn('⚠️ AVISO: VITE_MASTER_KEY não foi encontrada no .env. O Painel Super Admin não funcionará.');
}

// Criação da instância Axios dedicada à Infraestrutura (Sem Token Bearer)
const apiMaster = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-master-key': MASTER_KEY 
  }
});

export const superAdminService = {

  // =================================================
  // GESTÃO DE EMPRESAS (TENANTS)
  // =================================================

  /**
   * 1. Listar Todas as Empresas
   * Rota: GET /admin/companies
   * (Agora consome o backend real, sem mocks)
   */
  async listCompanies(): Promise<Company[]> {
    const { data } = await apiMaster.get<Company[]>('/admin/companies');
    return data;
  },

  /**
   * 2. Criar Nova Empresa (Tenant)
   * Rota: POST /admin/companies
   */
  async createCompany(payload: CreateCompanyDTO) {
    const { data } = await apiMaster.post('/admin/companies', payload);
    return data;
  },

  // =================================================
  // GESTÃO DE USUÁRIOS
  // =================================================

  /**
   * 3. Listar Usuários de uma Empresa Específica
   * Rota: GET /admin/companies/:id/users
   */
  async listUsersByCompany(empresaId: string): Promise<User[]> {
    const { data } = await apiMaster.get<User[]>(`/admin/companies/${empresaId}/users`);
    return data;
  },

  /**
   * 4. Adicionar Usuário em uma Empresa
   * Rota: POST /admin/users
   */
  async createUser(payload: CreateUserDTO) {
    const { data } = await apiMaster.post('/admin/users', payload);
    return data;
  }
};