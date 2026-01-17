import api from './api';
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../types';

const BASE_URL = '/admin/companies';

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    const { data } = await api.get<Company[]>(BASE_URL);
    return data;
  },

  getById: async (id: string): Promise<Company> => {
    const { data } = await api.get<Company>(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (payload: CreateCompanyDTO): Promise<Company> => {
    const { data } = await api.post<Company>(BASE_URL, payload);
    return data;
  },

  update: async (id: string, payload: UpdateCompanyDTO): Promise<Company> => {
    const { data } = await api.put<Company>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  toggleStatus: async (id: string, status: 'ativo' | 'inativo'): Promise<void> => {
    await api.patch(`${BASE_URL}/${id}/status`, { status });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};