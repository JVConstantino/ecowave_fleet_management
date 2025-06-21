
import React, { useState } from 'react';
import SimpleNav from './SimpleNav';
import Button from './ui/Button';
import Card from './ui/Card';
import { APP_NAME } from '../constants';
import { UserRole } from '../types'; // Import UserRole

interface LoginPageProps {
  onLogin: (identifier: string, pass: string, role: Exclude<UserRole, null>) => void; // Role cannot be null here
  onNavigateToHome: () => void;
  loginError: string | null;
  isLoading: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToHome, loginError, isLoading }) => {
  const [identifier, setIdentifier] = useState(''); // Email or Condo ID
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Exclude<UserRole, null>>('condominiumUser'); // Default to condominiumUser

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password, role);
  };

  const getIdentifierLabel = () => {
    switch (role) {
      case 'superAdmin':
        return 'Email do Super Administrador';
      case 'condoAdminCompany':
        return 'Email da Administradora';
      case 'condominiumUser':
        return 'ID do Cliente/Condomínio';
      default:
        return 'Identificador';
    }
  };
  
  const getIdentifierPlaceholder = () => {
     switch (role) {
      case 'superAdmin':
        return 'superadmin@exemplo.com';
      case 'condoAdminCompany':
        return 'admin@suaadministradora.com';
      case 'condominiumUser':
        return 'Ex: cliente-123 ou apto-101';
      default:
        return 'Seu identificador';
    }
  };

  const getIdentifierType = () => {
    return (role === 'superAdmin' || role === 'condoAdminCompany') ? 'email' : 'text';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-50 to-sky-100">
      <SimpleNav onAccessPanelClick={() => { /* Already on login or related page */ }} showAccessButton={false} />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card title="Acesso ao Painel" className="w-full max-w-md shadow-xl" bodyClassName="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
                Tipo de Acesso
              </label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => {
                    setRole(e.target.value as Exclude<UserRole, null>);
                    setIdentifier(''); // Clear identifier on role change
                    setPassword('');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="condominiumUser">Síndico / Cliente</option> 
                <option value="condoAdminCompany">Administradora de Condomínio</option>
                <option value="superAdmin">Super Administrador</option>
              </select>
            </div>

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                {getIdentifierLabel()}
              </label>
              <input
                type={getIdentifierType()}
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder={getIdentifierPlaceholder()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{loginError}</p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full" variant="primary" size="lg">
              Entrar
            </Button>
          </form>
          <div className="text-center">
            <Button onClick={onNavigateToHome} variant="ghost" size="sm">
              Voltar para Home
            </Button>
          </div>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-gray-600">
         © {new Date().getFullYear()} {APP_NAME}. Acesso seguro.
      </footer>
    </div>
  );
};

export default LoginPage;
