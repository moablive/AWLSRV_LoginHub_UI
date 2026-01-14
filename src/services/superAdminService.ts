import api from './api';
import type { CreateCompanyDTO, CreateUserDTO, User, Company } from '../types';

export const superAdminService = {

  
  createCompany: async (payload: CreateCompanyDTO) => {
    const { data } = await api.post('/admin/companies', payload);
    return data;
  },


  getUsersByCompany: async (id: string): Promise<User[]> => {
    const { data } = await api.get<User[]>(`/admin/companies/${id}/users`);
    return data;
  },


  createUser: async (payload: CreateUserDTO) => {
    const { data } = await api.post('/admin/users', payload);
    return data;
  },

  listCompanies: async (): Promise<Company[]> => {
    const { data } = await api.get('/admin/companies');
    return data;
  },
};