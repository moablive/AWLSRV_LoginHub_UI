import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/superAdminService';
import type { Company } from '../../types';

export default function CompanyList() {
  const navigate = useNavigate();
  
  // Estados para controlar os dados e o carregamento
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os dados assim que a tela carrega
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.listCompanies();
      setCompanies(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar a lista de empresas.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading-state">Carregando empresas...</div>;
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Gerenciar Empresas</h2>
          <p className="subtitle">Listagem de Tenants ativos no sistema</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/super-admin/nova-empresa')}
        >
          + Nova Empresa
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma empresa encontrada.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Documento</th>
              <th>Contato</th>
              <th>Usuários</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((empresa) => (
              <tr key={empresa.id}>
                <td>
                  <strong>{empresa.nome}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    ID: {empresa.id.slice(0, 8)}...
                  </div>
                </td>
                <td>{empresa.documento}</td>
                <td>
                  {empresa.email}
                  <br/>
                  <small>{empresa.telefone}</small>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {/* Mostra o total vindo da query SQL ou 0 */}
                  <span className="badge-neutral">
                    {empresa.total_usuarios || 0}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    backgroundColor: empresa.status === 'ativo' ? '#dcfce7' : '#fee2e2',
                    color: empresa.status === 'ativo' ? '#166534' : '#991b1b',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {empresa.status || 'INATIVO'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-small"
                    onClick={() => navigate(`/super-admin/empresa/${empresa.id}/usuarios`)}
                    style={{ 
                      cursor: 'pointer', 
                      padding: '6px 12px', 
                      background: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    👤 Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}