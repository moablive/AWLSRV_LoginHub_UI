import api from './api';
import type { User, CreateUserDTO, UpdateUserDTO } from '../types';

const ADMIN_BASE_URL = '/admin/users';

export const userService = {
  /**
   * Lista TODOS os usuários do sistema (Visão Global do Super Admin)
   * Endpoint: GET /admin/users
   */
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>(ADMIN_BASE_URL);
    return data;
  },

  /**
   * Lista usuários de uma empresa específica
   * Endpoint: GET /admin/companies/:id/users
   */
  getByCompanyId: async (companyId: string): Promise<User[]> => {
    const { data } = await api.get<User[]>(`/admin/companies/${companyId}/users`);
    return data;
  },

  /**
   * Cria um novo usuário
   * Endpoint: POST /admin/users
   */
  create: async (payload: CreateUserDTO): Promise<User> => {
    const { data } = await api.post<User>(ADMIN_BASE_URL, payload);
    return data;
  },

  /**
   * Atualiza um usuário existente
   * Endpoint: PUT /admin/users/:id
   */
  update: async (id: string, payload: UpdateUserDTO): Promise<User> => {
    const { data } = await api.put<User>(`${ADMIN_BASE_URL}/${id}`, payload);
    return data;
  },

  /**
   * Remove um usuário
   * Endpoint: DELETE /admin/users/:id
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`${ADMIN_BASE_URL}/${id}`);
  }
};