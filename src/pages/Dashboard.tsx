import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { superAdminService } from '../services/superAdminService'; 
import { authService } from '../services/authService';
import type { Company } from '../types'; 

// IMPORTAR A MODAL
import { LogoutModal } from '../components/shared/LogoutModal/LogoutModal';

export function Dashboard() {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // NOVO: Estado para controlar a modal de logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- CÁLCULOS ---
  const totalGlobalUsers = companies.reduce((acc, company) => {
    return acc + (company.total_admins || 0) + (company.total_users || 0);
  }, 0);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.listCompanies(); 
      setCompanies(data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ATUALIZADOS ---
  
  // 1. Apenas abre a modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // 2. Ação real de sair (passada para a modal)
  const confirmLogout = () => {
    authService.logout();
  };

  const handleDeleteCompany = async (id: string) => {
    // Aqui ainda mantemos o confirm padrão por segurança, ou você pode criar uma modal de delete
    console.log('Delete:', id);
    alert('Funcionalidade de exclusão em breve.');
  };

  return (
    <div className="container-fluid p-4">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">IdP (Identity Provider)</h2>
          <p className="text-muted mb-0">Gestão Centralizada de Tenants (Empresas)</p>
        </div>
        
        <div className="d-flex gap-2">
          {/* Botão Logout chama a função que abre a modal */}
          <button 
            className="btn btn-outline-danger d-flex align-items-center gap-2" 
            onClick={handleLogoutClick}
            title="Sair do sistema"
          >
            <i className="bi bi-box-arrow-right"></i> Sair
          </button>

          <button 
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" 
            onClick={() => navigate('/admin/companies/new')}
          >
            <i className="bi bi-plus-circle-fill"></i> Nova Empresa
          </button>
        </div>
      </div>

      {/* METRICAS RÁPIDAS (Cards) */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                <i className="bi bi-building fs-3"></i>
              </div>
              <div>
                <h6 className="card-title mb-0 opacity-75">Total de Empresas</h6>
                <h3 className="fw-bold mb-0">{companies.length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white text-dark h-100 border-start border-4 border-info">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3 text-info">
                <i className="bi bi-people-fill fs-3"></i>
              </div>
              <div>
                <h6 className="card-title mb-0 text-muted">Usuários Totais</h6>
                <h3 className="fw-bold mb-0">{totalGlobalUsers}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE EMPRESAS */}
      <div className="card shadow border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 text-secondary">Visão Geral</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Empresa / Contato</th>
                  <th>Documento (CNPJ)</th>
                  <th>Status</th>
                  <th>Composição de Usuários</th>
                  <th>Criação</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="spinner-border text-primary mb-2" role="status"></div>
                      <div className="text-muted">Carregando dados...</div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <p className="text-muted">Nenhuma empresa encontrada.</p>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/admin/companies/new')}>
                        Cadastrar a Primeira
                      </button>
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-building text-secondary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{company.nome}</div>
                            <div className="small text-muted">{company.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="text-muted font-monospace">{company.documento}</td>
                      
                      <td>
                        <span className={`badge rounded-pill ${company.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {company.status?.toUpperCase() || 'ATIVO'}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <span className="badge bg-warning text-dark border border-warning d-flex align-items-center gap-1" title="Administradores">
                            <i className="bi bi-shield-lock-fill"></i>
                            {company.total_admins || 0}
                          </span>
                          <span className="badge bg-light text-dark border d-flex align-items-center gap-1" title="Usuários Comuns">
                            <i className="bi bi-person-fill text-secondary"></i>
                            {company.total_users || 0}
                          </span>
                        </div>
                      </td>

                      <td className="text-muted small">
                        {company.created_at ? new Date(company.created_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      
                      <td className="text-end pe-4">
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            title="Gerenciar Usuários"
                            onClick={() => navigate(`/admin/companies/${company.id}/users`)}
                          >
                            <i className="bi bi-people-fill"></i> Gerenciar
                          </button>
                          
                          <button 
                            className="btn btn-sm btn-outline-danger ms-1"
                            title="Excluir Empresa"
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- INSERIR MODAL DE LOGOUT AQUI NO FINAL --- */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
      
    </div>
  );
}