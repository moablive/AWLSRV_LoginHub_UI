import React, { useEffect } from 'react';
import './LogoutModal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="awl-logout-overlay" onClick={onClose}>
      <div className="awl-logout-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Ícone de Porta/Saída */}
        <div className="logout-icon-container">
          <i className="bi bi-box-arrow-right"></i>
        </div>

        <h4 className="fw-bold text-dark mb-2">Sair do Sistema?</h4>
        <p className="text-muted small mb-0">
          Você terá que fazer login novamente para acessar o painel administrativo.
        </p>

        <div className="logout-actions">
          <button 
            className="btn btn-cancel flex-grow-1 rounded-pill py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          
          <button 
            className="btn btn-confirm-logout flex-grow-1 rounded-pill py-2"
            onClick={onConfirm}
          >
            Sim, Sair
          </button>
        </div>

      </div>
    </div>
  );
};