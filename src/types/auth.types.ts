// O User logado pode ter campos a mais ou a menos que o User da listagem, 
// mas geralmente tentamos manter iguais.
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  
  // Importante: O backend retorna 'role' ou 'nivel_acesso'? 
  // Baseado nos seus snippets anteriores, o DTO usa 'role'.
  role: 'master' | 'admin' | 'usuario'; 
  
  // Se o usuário for Super Admin, empresa_id pode ser null
  empresa_id?: string | null; 
  
  status?: 'ativo' | 'inativo';
}

export interface LoginResponse {
  token: string;
  usuario: User;
  // Opcional pois o Super Admin (Master) não tem empresa vinculada
  empresa?: {
    id: string;
    nome: string;
    status: 'ativo' | 'inativo';
  };
}