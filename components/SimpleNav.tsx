
import React from 'react';
import { APP_NAME } from '../constants';
import Button from './ui/Button';

interface SimpleNavProps {
  onAccessPanelClick: () => void;
  showAccessButton?: boolean;
}

const WaterDropIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.438-11.562a.75.75 0 00-1.06-1.06L5.625 10.124l2.122 2.121.707-.707-1.415-1.414 4.4-4.398zM14.376 10a4.376 4.376 0 00-8.214-2.163.75.75 0 001.23.837 2.876 2.876 0 015.528 1.485A3.626 3.626 0 0110 14.375a.75.75 0 000 1.5A5.126 5.126 0 0014.375 10z" clipRule="evenodd" />
  </svg>
);

const SimpleNav: React.FC<SimpleNavProps> = ({ onAccessPanelClick, showAccessButton = true }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <WaterDropIcon className="text-blue-600" />
            <span className="font-bold text-xl text-gray-800">{APP_NAME}</span>
          </div>
          {showAccessButton && (
            <Button onClick={onAccessPanelClick} variant="primary" size="md">
              Acesso ao Painel
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleNav;