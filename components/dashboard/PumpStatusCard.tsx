
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { PumpStatus } from '../../types';

interface PumpStatusCardProps {
  pumpStatus: PumpStatus | null;
  isLoading: boolean;
  error?: string | null;
  onTogglePump: (currentState: boolean) => Promise<void>;
  isTogglingPump: boolean;
}

const PowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
  </svg>
);

const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.123 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9a.75.75 0 0 1-.75.75H5.625a.75.75 0 0 1-.75-.75V7.5m7.5 0V9A.75.75 0 0 0 15 9.75h2.625a.75.75 0 0 0 .75-.75V7.5m0 0H18M5.625 7.5H3.375m18 0H18.375M3.375 7.5A2.25 2.25 0 0 0 1.125 9.75v9.75c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-9.75A2.25 2.25 0 0 0 3.375 7.5Zm15 0A2.25 2.25 0 0 1 20.625 9.75v9.75c0 .621-.504 1.125-1.125 1.125h-1.5c.621 0 1.125.504 1.125 1.125v-9.75A2.25 2.25 0 0 1 18.375 7.5Z" />
    </svg>
);


const PumpStatusCard: React.FC<PumpStatusCardProps> = ({ pumpStatus, isLoading, error, onTogglePump, isTogglingPump }) => {
  if (isLoading && !pumpStatus) { // Initial load
    return (
      <Card title="Status da Bomba">
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Status da Bomba">
        <p className="text-red-500 text-center py-4">{error}</p>
      </Card>
    );
  }

  if (!pumpStatus) {
    return (
      <Card title="Status da Bomba">
        <p className="text-gray-500 text-center py-4">Dados da bomba indisponíveis.</p>
      </Card>
    );
  }

  const handleToggle = () => {
    onTogglePump(pumpStatus.isActive);
  };

  return (
    <Card title="Status da Bomba" className="flex flex-col justify-between">
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm flex items-center"><GaugeIcon className="mr-2 text-blue-500" />Pressão:</span>
          <span className="font-semibold text-gray-800 text-lg">{pumpStatus.pressurePSI.toFixed(1)} PSI</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Status:</span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            pumpStatus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {pumpStatus.isActive ? 'Ligada' : 'Desligada'}
          </span>
        </div>
         <div className="text-xs text-gray-500">
            Última alteração: {new Date(pumpStatus.lastChanged).toLocaleString('pt-BR')}
        </div>
      </div>
      <Button
        onClick={handleToggle}
        isLoading={isTogglingPump}
        variant={pumpStatus.isActive ? 'danger' : 'primary'}
        className="w-full mt-auto"
        leftIcon={<PowerIcon />}
        disabled={isTogglingPump || isLoading} // disable if main data is still loading too
      >
        {isTogglingPump ? (pumpStatus.isActive ? 'Desligando...' : 'Ligando...') : (pumpStatus.isActive ? 'Desligar Bomba' : 'Ligar Bomba')}
      </Button>
    </Card>
  );
};

export default PumpStatusCard;
