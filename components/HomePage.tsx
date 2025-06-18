import React from 'react';
import SimpleNav from './SimpleNav';
import { APP_NAME } from '../constants';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

const ConstructionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-24 h-24 md:w-32 md:h-32 text-blue-500 ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C52.7614 15 55 17.2386 55 20V30H45V20C45 17.2386 47.2386 15 50 15Z" fill="currentColor" opacity="0.6"/>
    <path d="M50 85C47.2386 85 45 82.7614 45 80V70H55V80C55 82.7614 52.7614 85 50 85Z" fill="currentColor" opacity="0.6"/>
    <path d="M15 50C15 47.2386 17.2386 45 20 45H30V55H20C17.2386 55 15 52.7614 15 50Z" fill="currentColor" opacity="0.6"/>
    <path d="M85 50C85 52.7614 82.7614 55 80 55H70V45H80C82.7614 45 85 47.2386 85 50Z" fill="currentColor" opacity="0.6"/>
    
    <path d="M25.75 32.5C27.25 31 29.25 30 31.5 30H38.5C40.75 30 42.75 31 44.25 32.5L50 38.25L55.75 32.5C57.25 31 59.25 30 61.5 30H68.5C70.75 30 72.75 31 74.25 32.5L78.5 36.75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
       <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M21.5 63.25L25.75 67.5C27.25 69 29.25 70 31.5 70H38.5C40.75 70 42.75 69 44.25 67.5L50 61.75L55.75 67.5C57.25 69 59.25 70 61.5 70H68.5C70.75 70 72.75 69 74.25 67.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 2; 0 0" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M67.5 74.25C69 72.75 70 70.75 70 68.5V61.5C70 59.25 69 57.25 67.5 55.75L61.75 50L67.5 44.25C69 42.75 70 40.75 70 38.5V31.5C70 29.25 69 27.25 67.5 25.75L63.25 21.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <animateTransform attributeName="transform" type="translate" values="0 0; 2 0; 0 0" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M32.5 25.75C31 27.25 30 29.25 30 31.5V38.5C30 40.75 31 42.75 32.5 44.25L38.25 50L32.5 55.75C31 57.25 30 59.25 30 61.5V68.5C30 70.75 31 72.75 32.5 74.25L36.75 78.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <animateTransform attributeName="transform" type="translate" values="0 0; -2 0; 0 0" dur="1.5s" repeatCount="indefinite" />
    </path>
    <circle cx="50" cy="50" r="10" fill="currentColor">
        <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      <SimpleNav onAccessPanelClick={onNavigateToLogin} />
      
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <ConstructionIcon />
        <h1 className="mt-8 text-3xl sm:text-4xl font-bold text-gray-700">
          Página Inicial em Construção
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Estamos trabalhando para trazer a você uma nova experiência com o {APP_NAME}. 
          Em breve, nosso portal estará repleto de funcionalidades para otimizar sua gestão.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Enquanto isso, você pode acessar o painel de gestão através do botão no menu superior.
        </p>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} {APP_NAME}. Inovação em Gestão.
      </footer>
    </div>
  );
};

export default HomePage;
