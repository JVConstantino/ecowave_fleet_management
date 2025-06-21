
import React, { useState, useEffect, useCallback } from 'react';
import { CondominiumInfo, CondoAdminCompanyInfo } from '../../types'; // CondoAdminCompanyInfo might be needed for context
import { getCondominiumsByManagingCompanyId, addCondominiumClient } from '../../services/waterDataService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const BuildingOfficeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12.75h6m-6 6h6M6.75 6.75h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Z" />
  </svg>
);

const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m18 0h-1.5m-1.5-1.5a7.5 7.5 0 0 0-11.964-6.474M6.026 19.5A7.5 7.5 0 0 0 12 19.5m6-1.5a7.5 7.5 0 0 0-11.964 6.474M12 6.75v.008v.008V12m0 6.75v.008v.008V12m0-5.25h.008H12m0 5.25h.008H12m5.25-.008a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);


interface CondominiumManagementProps {
  managingCompanyContext: CondoAdminCompanyInfo; // The CondoAdminCompany whose condominiums are being managed
  onViewCondominiumDashboard: (condominium: CondominiumInfo) => void;
  onManageCondominiumDetails: (condominium: CondominiumInfo) => void;
  titleOverride?: string; // Optional title, e.g. "Meus Condomínios" or "Condomínios de [Admin Company Name]"
}

const CondominiumManagement: React.FC<CondominiumManagementProps> = ({ 
    managingCompanyContext, 
    onViewCondominiumDashboard, 
    onManageCondominiumDetails,
    titleOverride
}) => {
  const [condominiums, setCondominiums] = useState<CondominiumInfo[]>([]);
  const [newCondominiumName, setNewCondominiumName] = useState('');
  const [isLoadingCondominiums, setIsLoadingCondominiums] = useState(true);
  const [isAddingCondominium, setIsAddingCondominium] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchCondominiums = useCallback(async () => {
    if (!managingCompanyContext) return;
    setIsLoadingCondominiums(true);
    setError(null);
    try {
      const fetchedCondominiums = await getCondominiumsByManagingCompanyId(managingCompanyContext.id);
      setCondominiums(fetchedCondominiums);
    } catch (err) {
      console.error("Failed to fetch condominiums:", err);
      setError("Falha ao carregar a lista de condomínios.");
    } finally {
      setIsLoadingCondominiums(false);
    }
  }, [managingCompanyContext]);

  useEffect(() => {
    fetchCondominiums();
  }, [fetchCondominiums]);

  const handleAddCondominium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondominiumName.trim()) {
      setAddError("O nome do condomínio é obrigatório.");
      return;
    }
    if (!managingCompanyContext) {
        setAddError("Contexto da administradora não encontrado.");
        return;
    }
    setIsAddingCondominium(true);
    setAddError(null);
    try {
      const newCondo = await addCondominiumClient(newCondominiumName, managingCompanyContext.id);
      setCondominiums(prevCondos => [...prevCondos, newCondo].sort((a,b) => a.name.localeCompare(b.name)));
      setNewCondominiumName('');
    } catch (err: any) {
      console.error("Failed to add condominium:", err);
      setAddError(err.message || "Falha ao cadastrar o condomínio.");
    } finally {
      setIsAddingCondominium(false);
    }
  };
  
  const cardTitle = titleOverride || `Gerenciamento de Condomínios (${managingCompanyContext?.name || 'N/A'})`;

  return (
    <Card title={cardTitle} titleClassName="bg-gray-50">
      <div className="space-y-6">
        <form onSubmit={handleAddCondominium} className="space-y-4">
          <div>
            <label htmlFor="condominiumName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Novo Condomínio
            </label>
            <input
              type="text"
              id="condominiumName"
              value={newCondominiumName}
              onChange={(e) => setNewCondominiumName(e.target.value)}
              placeholder="Ex: Residencial Flores do Campo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isAddingCondominium}
              aria-describedby={addError ? "condominium-name-error" : undefined}
            />
          </div>
          {addError && <p id="condominium-name-error" className="text-sm text-red-600">{addError}</p>}
          <Button type="submit" isLoading={isAddingCondominium} disabled={isAddingCondominium || !newCondominiumName.trim()} leftIcon={<PlusIcon />}>
            Cadastrar Condomínio
          </Button>
        </form>

        <hr />

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <BuildingOfficeIcon className="mr-2 text-gray-600"/>
            Condomínios Cadastrados
            </h4>
          {isLoadingCondominiums ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : error ? (
            <p className="text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          ) : condominiums.length === 0 ? (
            <p className="text-gray-500">Nenhum condomínio cadastrado para esta administradora.</p>
          ) : (
            <ul className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
              {condominiums.map((condo) => (
                <li key={condo.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-700">{condo.name}</p>
                    <p className="text-xs text-gray-500">ID: {condo.id}</p>
                    {condo.registrationDate && (
                       <p className="text-xs text-gray-500">Registrado em: {new Date(condo.registrationDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-shrink-0">
                     <Button 
                        onClick={() => onManageCondominiumDetails(condo)} 
                        variant="secondary" 
                        size="sm" 
                        leftIcon={<CogIcon />}
                        aria-label={`Gerenciar detalhes do condomínio ${condo.name}`}
                      >
                        Gerenciar Detalhes
                      </Button>
                    <Button 
                      onClick={() => onViewCondominiumDashboard(condo)} 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<EyeIcon />}
                      aria-label={`Ver painel do condomínio ${condo.name}`}
                    >
                      Ver Painel
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CondominiumManagement;
