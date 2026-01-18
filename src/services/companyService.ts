import api from './api';
import type { Company, CreateCompanyDTO, CreateCompanyResponse, UpdateCompanyDTO } from '../types';

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

  create: async (payload: CreateCompanyDTO): Promise<CreateCompanyResponse> => {
    const { data } = await api.post<CreateCompanyResponse>(BASE_URL, payload);
    return data;
  },

  update: async (id: string, payload: UpdateCompanyDTO): Promise<Company> => {
    const { data } = await api.put<Company>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  toggleStatus: async (id: string, status: 'ativo' | 'inativo'): Promise<Company> => {
    const { data } = await api.patch<{ message: string; empresa: Company }>(
      `${BASE_URL}/${id}/status`,
      { status }
    );
    return data.empresa;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};