import api from './api'; // Usando sua instância configurada com interceptors
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../types/company.types';

const BASE_URL = '/admin/companies';

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    const { data } = await api.get<Company[]>(BASE_URL);
    return data;
  },

  create: async (payload: CreateCompanyDTO) => {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  },

  // Preparado para quando você criar a rota PUT no backend
  update: async (id: string, payload: UpdateCompanyDTO) => {
    const { data } = await api.put(`${BASE_URL}/${id}`, payload);
    return data;
  },

  // Preparado para quando você criar a rota DELETE no backend
  delete: async (id: string) => {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    return data;
  }
};