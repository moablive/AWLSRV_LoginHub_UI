import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]); // Lista para a tabela
  const [loading, setLoading] = useState(true);

  // 1. Carrega dados ao abrir a tela
  useEffect(() => {
    // Recupera quem está logado do LocalStorage
    const storedUser = localStorage.getItem('awl_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Busca a lista de usuários da empresa (GET /users)
    // Nota: Certifique-se de ter criado essa rota GET no backend ou a lista virá vazia
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Vamos assumir que existe um endpoint GET /users para listar os membros da empresa
      const response = await api.get('/users'); 
      setUsersList(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Função de Logout Integrada ao Backend
  const handleLogout = async () => {
    try {
      // Avisa o backend (opcional, mas boa prática)
      await api.post('/auth/logout');
    } catch (err) {
      console.warn("Backend offline ou erro no logout, limpando localmente...", err);
    } finally {
      // Limpeza Obrigatória
      localStorage.removeItem('awl_token');
      localStorage.removeItem('awl_user');
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* --- HEADER --- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
            <h1>📊 Painel de Controle</h1>
            <p style={{ opacity: 0.7 }}>
              Olá, <strong>{currentUser?.nome}</strong> ({currentUser?.role})
            </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ width: 'auto', background: '#d63031', padding: '10px 20px' }}
        >
          Sair do Sistema
        </button>
      </header>

      {/* --- TABELA DE USUÁRIOS --- */}
      <section className="card" style={{ background: '#242424', padding: '1.5rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3>👥 Usuários da Empresa</h3>
            {currentUser?.role === 'admin' && (
                <button style={{ width: 'auto', fontSize: '0.9rem' }}>+ Novo Usuário</button>
            )}
        </div>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ padding: '10px' }}>Nome</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Função</th>
                <th style={{ padding: '10px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length > 0 ? (
                usersList.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px' }}>{user.nome}</td>
                    <td style={{ padding: '10px' }}>{user.email}</td>
                    <td style={{ padding: '10px' }}>
                        <span style={{ 
                            background: user.role === 'admin' ? '#6c5ce7' : '#00b894',
                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                        }}>
                            {user.role}
                        </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                        <button style={{ width: 'auto', padding: '5px 10px', background: 'transparent', border: '1px solid #555' }}>Editar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                        Nenhum usuário encontrado (ou API de listagem pendente).
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}