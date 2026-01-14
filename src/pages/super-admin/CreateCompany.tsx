import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/superAdminService';
import type { CreateCompanyDTO, ApiErrorResponse } from '../../types'; 
import { SuccessModal } from '../../components/shared/SuccessModal/SuccessModal'; // Importe a modal
import { AxiosError } from 'axios';

export const CreateCompany = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCompanyDTO>();
  const navigate = useNavigate();

  // Estado para controlar a Modal
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: CreateCompanyDTO) => {
    try {
      await superAdminService.createCompany(data);
      // Sucesso: Abre a modal
      setShowSuccess(true);
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      console.error(err);
      alert(`Erro: ${err.response?.data?.message || 'Falha ao criar empresa'}`);
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    navigate('/admin'); // Redireciona para o Dashboard principal
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 Nova Empresa (Tenant)</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">
              
              {/* COLUNA 1: DADOS DA EMPRESA */}
              <div className="col-md-6 border-end">
                <h5 className="text-primary mb-3">Dados Corporativos</h5>
                
                <div className="mb-3">
                  <label className="form-label">Nome da Empresa</label>
                  <input 
                    {...register('nome', { required: 'Nome é obrigatório' })} 
                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                    placeholder="Ex: Padaria Tech Ltda" 
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Documento (CNPJ/CPF)</label>
                  <input 
                    {...register('documento', { required: 'Documento é obrigatório' })} 
                    className="form-control"
                    placeholder="Apenas números" 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">E-mail Corporativo</label>
                  <input 
                    type="email"
                    {...register('email', { required: true })} 
                    className="form-control"
                    placeholder="contato@empresa.com" 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Telefone</label>
                  <input 
                    {...register('telefone', { required: true })} 
                    className="form-control"
                    placeholder="(00) 0000-0000" 
                  />
                </div>
              </div>

              {/* COLUNA 2: DADOS DO ADMIN INICIAL */}
              <div className="col-md-6">
                <h5 className="text-warning mb-3">Admin Inicial (Dono)</h5>
                
                <div className="mb-3">
                  <label className="form-label">Nome do Admin</label>
                  <input 
                    {...register('admin_nome', { required: true })} 
                    className="form-control"
                    placeholder="Nome completo do responsável" 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">E-mail de Login</label>
                  <input 
                    type="email"
                    {...register('admin_email', { required: true })} 
                    className="form-control"
                    placeholder="admin@empresa.com" 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Senha Inicial</label>
                  <input 
                    type="password"
                    {...register('password', { required: true, minLength: 6 })} 
                    className="form-control"
                    placeholder="******" 
                  />
                  <small className="text-muted">Mínimo 6 caracteres</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Telefone (Celular)</label>
                  <input 
                    {...register('admin_telefone', { required: true })} 
                    className="form-control" 
                  />
                </div>
              </div>
            </div>

            <hr className="my-4" />
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : '🚀 Provisionar Tenant'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- INTEGRAÇÃO DA MODAL DE SUCESSO --- */}
      <SuccessModal 
        isOpen={showSuccess}
        onClose={handleCloseModal}
        title="Empresa Criada!"
        message="A empresa e o usuário admin foram provisionados com sucesso. O cliente já pode logar."
        buttonText="Voltar ao Painel"
      />
    </div>
  );
};