
import React, { useState, useEffect, useCallback } from 'react';
import { CondoAdminCompanyInfo } from '../../types';
import { getCondoAdminCompanies, addCondoAdminCompany } from '../../services/waterDataService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const BriefcaseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.441-2.264 2.666-1.072.178-2.176.259-3.268.259H9.272c-1.092 0-2.196-.081-3.268-.259-1.3-.225-2.264-1.353-2.264-2.666v-4.075m14.016-7.859V5.161c0-1.313-.964-2.441-2.264-2.666a23.493 23.493 0 0 0-3.268-.259H9.272c-1.092 0-2.196.081-3.268-.259C4.704 2.72 3.74 3.848 3.74 5.161v1.13m16.522 0v1.13m-16.522 0v4.075M3.75 9.336c0 .527.18.991.492 1.353m15.516-1.353c.312-.362.492-.826.492-1.353M7.5 12.375c0 .621.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125V9.375m-9 3v-.375c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v.375m-9 0h9" />
  </svg>
);

const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


interface SuperAdminManagementProps {
    onViewCondominiumsForAdminCompany: (adminCompany: CondoAdminCompanyInfo) => void;
    // Potentially add onManageAdminCompanyDetails in the future
}

const SuperAdminManagement: React.FC<SuperAdminManagementProps> = ({ onViewCondominiumsForAdminCompany }) => {
  const [adminCompanies, setAdminCompanies] = useState<CondoAdminCompanyInfo[]>([]);
  const [newAdminCompanyName, setNewAdminCompanyName] = useState('');
  const [newAdminCompanyEmail, setNewAdminCompanyEmail] = useState('');
  const [newAdminCompanyResponsible, setNewAdminCompanyResponsible] = useState('');
  
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchAdminCompanies = useCallback(async () => {
    setIsLoadingCompanies(true);
    setError(null);
    try {
      const fetchedCompanies = await getCondoAdminCompanies();
      setAdminCompanies(fetchedCompanies);
    } catch (err) {
      console.error("Failed to fetch admin companies:", err);
      setError("Falha ao carregar a lista de administradoras.");
    } finally {
      setIsLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminCompanies();
  }, [fetchAdminCompanies]);

  const handleAddAdminCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminCompanyName.trim() || !newAdminCompanyEmail.trim()) {
      setAddError("Nome da administradora e email são obrigatórios.");
      return;
    }
    setIsAddingCompany(true);
    setAddError(null);
    try {
      const newCompany = await addCondoAdminCompany(newAdminCompanyName, newAdminCompanyEmail, newAdminCompanyResponsible);
      setAdminCompanies(prevCompanies => [...prevCompanies, newCompany].sort((a,b) => a.name.localeCompare(b.name)));
      setNewAdminCompanyName('');
      setNewAdminCompanyEmail('');
      setNewAdminCompanyResponsible('');
    } catch (err: any) {
      console.error("Failed to add admin company:", err);
      setAddError(err.message || "Falha ao cadastrar a administradora.");
    } finally {
      setIsAddingCompany(false);
    }
  };

  return (
    <Card title="Gerenciamento de Administradoras de Condomínio (Super Admin)" titleClassName="bg-gray-50">
      <div className="space-y-6">
        <form onSubmit={handleAddAdminCompany} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Nova Administradora</h3>
          <div>
            <label htmlFor="adminCompanyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Administradora
            </label>
            <input
              type="text"
              id="adminCompanyName"
              value={newAdminCompanyName}
              onChange={(e) => setNewAdminCompanyName(e.target.value)}
              placeholder="Ex: Gestão Premium Ltda."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isAddingCompany}
            />
          </div>
           <div>
            <label htmlFor="adminCompanyEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email do Administrador Principal
            </label>
            <input
              type="email"
              id="adminCompanyEmail"
              value={newAdminCompanyEmail}
              onChange={(e) => setNewAdminCompanyEmail(e.target.value)}
              placeholder="admin@gestaopremium.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isAddingCompany}
            />
          </div>
           <div>
            <label htmlFor="adminCompanyResponsible" className="block text-sm font-medium text-gray-700 mb-1">
              Pessoa Responsável (Opcional)
            </label>
            <input
              type="text"
              id="adminCompanyResponsible"
              value={newAdminCompanyResponsible}
              onChange={(e) => setNewAdminCompanyResponsible(e.target.value)}
              placeholder="Nome do contato principal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isAddingCompany}
            />
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <Button type="submit" isLoading={isAddingCompany} disabled={isAddingCompany || !newAdminCompanyName.trim() || !newAdminCompanyEmail.trim()} leftIcon={<PlusIcon />}>
            Cadastrar Administradora
          </Button>
        </form>

        <hr />

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <BriefcaseIcon className="mr-2 text-gray-600"/>
            Administradoras Cadastradas
            </h4>
          {isLoadingCompanies ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : error ? (
            <p className="text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          ) : adminCompanies.length === 0 ? (
            <p className="text-gray-500">Nenhuma administradora cadastrada.</p>
          ) : (
            <ul className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
              {adminCompanies.map((company) => (
                <li key={company.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-700">{company.name}</p>
                    <p className="text-xs text-gray-500">ID: {company.id}</p>
                    <p className="text-xs text-gray-500">Email Admin: {company.adminUserEmail}</p>
                    {company.responsiblePerson && <p className="text-xs text-gray-500">Responsável: {company.responsiblePerson}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-shrink-0">
                    {/* Placeholder for future "Manage Admin Company Details" button */}
                    {/* <Button variant="secondary" size="sm" leftIcon={<CogIcon />} disabled>Gerenciar Detalhes</Button> */}
                    <Button 
                      onClick={() => onViewCondominiumsForAdminCompany(company)} 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<EyeIcon />}
                      aria-label={`Ver condomínios de ${company.name}`}
                    >
                      Ver Condomínios
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

export default SuperAdminManagement;
