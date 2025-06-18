
import React from 'react';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

// Icons (Heroicons)
const HomeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const BuildingOfficeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12.75h6m-6 6h6M6.75 6.75h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Zm6-11.25h.75v.75h-.75V6.75Zm0 6h.75v.75h-.75V12.75Zm0 6h.75v.75h-.75V18.75Z" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
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
  onClick: () => void;
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
      disabled={disabled}
    >
      <span className={`${isActive ? 'text-white' : disabled ? 'text-gray-400' : 'text-blue-500'}`}>{icon}</span>
      {isSidebarOpen && <span className="font-medium text-sm">{label}</span>}
    </button>
  </li>
);

export type AuthenticatedAppView = 'admin' | 'dashboard' | 'reports';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  userRole: UserRole;
  currentView: AuthenticatedAppView; 
  navigateToAdminPanel: () => void;
  navigateToDashboardView: () => void; 
  navigateToReportsView: () => void;
  isCondoSelectedByAdmin: boolean; // True if admin has selected a condo from their list
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  userRole,
  currentView,
  navigateToAdminPanel,
  navigateToDashboardView,
  navigateToReportsView,
  isCondoSelectedByAdmin
}) => {
  // Adjusting labels based on new app name context
  const adminPanelLabel = "Gerenciar Clientes";
  const clientDashboardLabel = "Painel do Cliente";
  const clientReportsLabel = "Relatórios do Cliente";
  const myDashboardLabel = "Meu Painel";
  const myReportsLabel = "Meus Relatórios";


  return (
    <aside
      className={`bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out fixed top-0 left-0 h-full z-40 pt-16`} 
      style={{ width: isSidebarOpen ? '16rem' : '4.5rem' }} 
    >
      <div className="flex items-center justify-start p-3 border-b border-gray-200 h-16"> 
        {isSidebarOpen && (
           <div className="flex items-center space-x-2">
            {/* Icon removed from here */}
            <span className="font-bold text-gray-800 text-lg whitespace-nowrap">{APP_NAME}</span>
          </div>
        )}
      </div>

      <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
        <ul>
          {userRole === 'condominium' && ( // 'condominium' role here means a client/unit
            <>
            <NavItem
              icon={<HomeIcon />}
              label={myDashboardLabel}
              isActive={currentView === 'dashboard'}
              onClick={navigateToDashboardView}
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={<ChartBarIcon />}
              label={myReportsLabel}
              isActive={currentView === 'reports'}
              onClick={navigateToReportsView}
              isSidebarOpen={isSidebarOpen}
            />
            </>
          )}
          {userRole === 'admin' && (
            <>
              <NavItem
                icon={<BuildingOfficeIcon />}
                label={adminPanelLabel}
                isActive={currentView === 'admin'}
                onClick={navigateToAdminPanel}
                isSidebarOpen={isSidebarOpen}
              />
              <NavItem
                icon={<HomeIcon />}
                label={clientDashboardLabel}
                isActive={currentView === 'dashboard' && isCondoSelectedByAdmin}
                onClick={navigateToDashboardView} 
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondoSelectedByAdmin}
              />
              <NavItem
                icon={<ChartBarIcon />}
                label={clientReportsLabel}
                isActive={currentView === 'reports' && isCondoSelectedByAdmin}
                onClick={navigateToReportsView}
                isSidebarOpen={isSidebarOpen}
                disabled={!isCondoSelectedByAdmin}
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
