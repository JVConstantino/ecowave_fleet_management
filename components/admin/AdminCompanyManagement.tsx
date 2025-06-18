
import React, { useState, useEffect, useCallback } from 'react';
import { CondominiumInfo } from '../../types'; // Type name remains CondominiumInfo for now
import { getCompanies, addCompany } from '../../services/waterDataService';
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


interface AdminCompanyManagementProps {
    onViewCompanyDashboard: (company: CondominiumInfo) => void;
}

const AdminCompanyManagement: React.FC<AdminCompanyManagementProps> = ({ onViewCompanyDashboard }) => {
  const [companies, setCompanies] = useState<CondominiumInfo[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoadingCompanies(true);
    setError(null);
    try {
      const fetchedCompanies = await getCompanies();
      setCompanies(fetchedCompanies);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setError("Falha ao carregar a lista de clientes.");
    } finally {
      setIsLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      setAddError("O nome do cliente é obrigatório.");
      return;
    }
    setIsAddingCompany(true);
    setAddError(null);
    try {
      const newCompany = await addCompany(newCompanyName); // addCompany now means addClient
      setCompanies(prevCompanies => [...prevCompanies, newCompany].sort((a,b) => a.name > b.name ? 1 : -1));
      setNewCompanyName('');
    } catch (err: any) {
      console.error("Failed to add company:", err);
      setAddError(err.message || "Falha ao cadastrar o cliente.");
    } finally {
      setIsAddingCompany(false);
    }
  };

  return (
    <Card title="Gerenciamento de Clientes (Admin)" titleClassName="bg-gray-50">
      <div className="space-y-6">
        <form onSubmit={handleAddCompany} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Novo Cliente
            </label>
            <input
              type="text"
              id="companyName"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Ex: Empresa Exemplo Ltda"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isAddingCompany}
              aria-describedby={addError ? "company-name-error" : undefined}
            />
          </div>
          {addError && <p id="company-name-error" className="text-sm text-red-600">{addError}</p>}
          <Button type="submit" isLoading={isAddingCompany} disabled={isAddingCompany || !newCompanyName.trim()} leftIcon={<PlusIcon />}>
            Cadastrar Cliente
          </Button>
        </form>

        <hr />

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <BuildingOfficeIcon className="mr-2 text-gray-600"/>
            Clientes Cadastrados
            </h4>
          {isLoadingCompanies ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : error ? (
            <p className="text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {companies.map((company) => (
                <li key={company.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{company.name}</p>
                    <p className="text-xs text-gray-500">ID: {company.id}</p>
                    {company.registrationDate && (
                       <p className="text-xs text-gray-500">Registrado em: {new Date(company.registrationDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <Button 
                    onClick={() => onViewCompanyDashboard(company)} 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 sm:mt-0 sm:ml-4"
                    leftIcon={<EyeIcon />}
                    aria-label={`Ver painel do cliente ${company.name}`}
                  >
                    Ver Painel
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdminCompanyManagement;