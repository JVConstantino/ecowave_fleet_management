
import React from 'react';
import { APP_NAME } from '../constants';
import { AuthenticatedUser, UserRole, SuperAdminUserInfo, CondoAdminCompanyInfo, CondominiumInfo } from '../types';
import Button from './ui/Button';
import { AuthenticatedAppView } from './Sidebar'; 

interface HeaderProps {
  isAuthenticated: boolean;
  user: AuthenticatedUser;
  userRole: UserRole;
  onLogout: () => void;
  authenticatedAppView: AuthenticatedAppView;
  selectedAdminCompanyName?: string | null;
  selectedCondominiumName?: string | null; 
}

const WaterDropIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.438-11.562a.75.75 0 00-1.06-1.06L5.625 10.124l2.122 2.121.707-.707-1.415-1.414 4.4-4.398zM14.376 10a4.376 4.376 0 00-8.214-2.163.75.75 0 001.23.837 2.876 2.876 0 015.528 1.485A3.626 3.626 0 0110 14.375a.75.75 0 000 1.5A5.126 5.126 0 0014.375 10z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ 
    isAuthenticated, 
    user, 
    userRole, 
    onLogout, 
    authenticatedAppView, 
    selectedAdminCompanyName,
    selectedCondominiumName 
}) => {
  let mainTitle = APP_NAME;
  let subTitle: string | null = null;

  if (isAuthenticated && user) {
    switch (userRole) {
      case 'superAdmin':
        const superAdminUser = user as SuperAdminUserInfo;
        if (authenticatedAppView === 'superAdminManagement') {
          subTitle = "Painel Super Admin";
        } else if (authenticatedAppView === 'condominiumManagement' && selectedAdminCompanyName) {
          subTitle = `Gerenciando Condomínios de: ${selectedAdminCompanyName}`;
        } else if (authenticatedAppView === 'clientDetails' && selectedAdminCompanyName && selectedCondominiumName) {
          subTitle = `Detalhes: ${selectedCondominiumName} (Admin: ${selectedAdminCompanyName})`;
        } else if ((authenticatedAppView === 'dashboard' || authenticatedAppView === 'reports') && selectedAdminCompanyName && selectedCondominiumName) {
          const viewLabel = authenticatedAppView === 'dashboard' ? 'Painel' : 'Relatórios';
          subTitle = `${viewLabel}: ${selectedCondominiumName} (Admin: ${selectedAdminCompanyName})`;
        } else {
          subTitle = superAdminUser.name;
        }
        break;
      
      case 'condoAdminCompany':
        const adminCompanyUser = user as CondoAdminCompanyInfo;
        if (authenticatedAppView === 'condominiumManagement') {
          subTitle = `Meus Condomínios: ${adminCompanyUser.name}`;
        } else if (authenticatedAppView === 'clientDetails' && selectedCondominiumName) {
          subTitle = `Detalhes: ${selectedCondominiumName} (${adminCompanyUser.name})`;
        } else if ((authenticatedAppView === 'dashboard' || authenticatedAppView === 'reports') && selectedCondominiumName) {
          const viewLabel = authenticatedAppView === 'dashboard' ? 'Painel' : 'Relatórios';
          subTitle = `${viewLabel}: ${selectedCondominiumName} (${adminCompanyUser.name})`;
        } else {
          subTitle = adminCompanyUser.name;
        }
        break;

      case 'condominiumUser':
        const condoUser = user as CondominiumInfo;
        if (authenticatedAppView === 'dashboard') {
          subTitle = condoUser.name;
        } else if (authenticatedAppView === 'reports') {
          subTitle = `Relatórios: ${condoUser.name}`;
        } else {
          subTitle = condoUser.name; 
        }
        break;
    }
  }


  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md fixed top-0 left-0 right-0 z-50 h-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <WaterDropIcon className="text-blue-300" />
            <h1 className="text-2xl font-bold tracking-tight">{mainTitle}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {subTitle && (
              <div className="text-sm font-medium hidden sm:block truncate max-w-xs md:max-w-md lg:max-w-lg" title={subTitle}>
                {subTitle}
              </div>
            )}
            {isAuthenticated && (
              <Button onClick={onLogout} variant="ghost" size="sm" className="text-white hover:bg-blue-700" leftIcon={<LogoutIcon />}>
                Sair
              </Button>
            )}
          </div>
        </div>
         {subTitle && (
            <div className="sm:hidden text-xs font-medium text-center pb-2 -mt-2 truncate" title={subTitle}>
              {subTitle}
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
