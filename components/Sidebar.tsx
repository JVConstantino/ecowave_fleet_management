
import React from 'react';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

// Icons (Heroicons)
const ShieldCheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // For SuperAdmin
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // For CondoAdminCompany
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.441-2.264 2.666-1.072.178-2.176.259-3.268.259H9.272c-1.092 0-2.196-.081-3.268-.259-1.3-.225-2.264-1.353-2.264-2.666v-4.075m14.016-7.859V5.161c0-1.313-.964-2.441-2.264-2.666a23.493 23.493 0 0 0-3.268-.259H9.272c-1.092 0-2.196.081-3.268-.259C4.704 2.72 3.74 3.848 3.74 5.161v1.13m16.522 0v1.13m-16.522 0v4.075M3.75 9.336c0 .527.18.991.492 1.353m15.516-1.353c.312-.362.492-.826.492-1.353M7.5 12.375c0 .621.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125V9.375m-9 3v-.375c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v.375m-9 0h9" />
    </svg>
);


const HomeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const BuildingOfficeIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // For Condominium Management
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12.75h6m-6 6h6M6.75 6.75h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Z" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const UserCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // For Client/Condo details
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


const ChevronDoubleLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
  </svg>
);
const ChevronDoubleRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
  </svg>
);

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  isSidebarOpen: boolean;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isSidebarOpen, disabled = false }) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 space-x-3 rounded-md transition-colors duration-200
                  ${isActive ? 'bg-blue-600 text-white shadow-md' : disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'}
                  ${!isSidebarOpen ? 'justify-center' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      title={isSidebarOpen ? undefined : label}
      disabled={disabled || !onClick}
    >
      <span className={`${isActive ? 'text-white' : disabled ? 'text-gray-400' : 'text-blue-500'}`}>{icon}</span>
      {isSidebarOpen && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
    </button>
  </li>
);

// Updated AuthenticatedAppView to include new views for different roles
export type AuthenticatedAppView = 
  'superAdminManagement' | // SuperAdmin: Manage CondoAdminCompanies
  'condominiumManagement' | // CondoAdminCompany: Manage their Condominiums; SuperAdmin: Manage selected AdminCompany's Condominiums
  'dashboard' | // All roles, context-dependent
  'reports' | // All roles, context-dependent
  'clientDetails'; // For CondoAdminCompany/SuperAdmin to manage details of a specific Condominium

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  userRole: UserRole;
  currentView: AuthenticatedAppView; 
  
  // Navigation Callbacks
  navigateToSuperAdminManagement: () => void;
  navigateToCondominiumManagement: () => void; // Context-aware: for logged-in CondoAdminCompany or selected by SuperAdmin
  navigateToDashboardView: () => void; 
  navigateToReportsView: () => void;
  navigateToClientDetailsView?: () => void;
  
  // Contextual information
  isAdminCompanySelectedBySuperAdmin: boolean;
  isCondominiumSelected: boolean; // True if a specific condominium is selected (by any higher role)
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  userRole,
  currentView,
  navigateToSuperAdminManagement,
  navigateToCondominiumManagement,
  navigateToDashboardView,
  navigateToReportsView,
  navigateToClientDetailsView,
  isAdminCompanySelectedBySuperAdmin,
  isCondominiumSelected,
}) => {
  
  return (
    <aside
      className={`bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out fixed top-0 left-0 h-full z-40 pt-16`} 
      style={{ width: isSidebarOpen ? '16rem' : '4.5rem' }} 
    >
      <div className="flex items-center justify-start p-3 border-b border-gray-200 h-16"> 
        {isSidebarOpen && (
           <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-800 text-lg whitespace-nowrap">{APP_NAME}</span>
          </div>
        )}
      </div>

      <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
        <ul>
          {userRole === 'superAdmin' && (
            <>
              <NavItem
                icon={<ShieldCheckIcon />}
                label="Gerenciar Admin. de Cond."
                isActive={currentView === 'superAdminManagement'}
                onClick={navigateToSuperAdminManagement}
                isSidebarOpen={isSidebarOpen}
              />
              <NavItem
                icon={<BuildingOfficeIcon />}
                label="Condomínios da Admin. Sel."
                isActive={currentView === 'condominiumManagement' && isAdminCompanySelectedBySuperAdmin}
                onClick={navigateToCondominiumManagement}
                isSidebarOpen={isSidebarOpen}
                disabled={!isAdminCompanySelectedBySuperAdmin}
              />
               <NavItem
                icon={<UserCircleIcon />}
                label="Detalhes do Condomínio"
                isActive={currentView === 'clientDetails' && isCondominiumSelected}
                onClick={navigateToClientDetailsView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected || !navigateToClientDetailsView || !isAdminCompanySelectedBySuperAdmin}
              />
              <NavItem
                icon={<HomeIcon />}
                label="Painel do Condomínio"
                isActive={currentView === 'dashboard' && isCondominiumSelected}
                onClick={navigateToDashboardView} 
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected || !isAdminCompanySelectedBySuperAdmin}
              />
              <NavItem
                icon={<ChartBarIcon />}
                label="Relatórios do Condomínio"
                isActive={currentView === 'reports' && isCondominiumSelected}
                onClick={navigateToReportsView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected || !isAdminCompanySelectedBySuperAdmin}
              />
            </>
          )}

          {userRole === 'condoAdminCompany' && (
            <>
              <NavItem
                icon={<BuildingOfficeIcon />}
                label="Meus Condomínios"
                isActive={currentView === 'condominiumManagement'}
                onClick={navigateToCondominiumManagement}
                isSidebarOpen={isSidebarOpen}
              />
               <NavItem
                icon={<UserCircleIcon />}
                label="Detalhes do Condomínio"
                isActive={currentView === 'clientDetails' && isCondominiumSelected}
                onClick={navigateToClientDetailsView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected || !navigateToClientDetailsView}
              />
              <NavItem
                icon={<HomeIcon />}
                label="Painel do Condomínio"
                isActive={currentView === 'dashboard' && isCondominiumSelected}
                onClick={navigateToDashboardView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected}
              />
              <NavItem
                icon={<ChartBarIcon />}
                label="Relatórios do Condomínio"
                isActive={currentView === 'reports' && isCondominiumSelected}
                onClick={navigateToReportsView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondominiumSelected}
              />
            </>
          )}

          {userRole === 'condominiumUser' && ( 
            <>
            <NavItem
              icon={<HomeIcon />}
              label="Meu Painel"
              isActive={currentView === 'dashboard'}
              onClick={navigateToDashboardView}
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={<ChartBarIcon />}
              label="Meus Relatórios"
              isActive={currentView === 'reports'}
              onClick={navigateToReportsView}
              isSidebarOpen={isSidebarOpen}
            />
            </>
          )}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onToggleSidebar}
          className={`w-full flex items-center p-2 space-x-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ${!isSidebarOpen ? 'justify-center' : ''}`}
          title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isSidebarOpen ? <ChevronDoubleLeftIcon className="text-gray-500 w-5 h-5" /> : <ChevronDoubleRightIcon className="text-gray-500 w-5 h-5" />}
          {isSidebarOpen && <span className="font-medium text-xs">Recolher</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
