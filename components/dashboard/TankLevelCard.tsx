
import React from 'react';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { TankLevel } from '../../types';

interface TankLevelCardProps {
  tankLevel: TankLevel | null;
  isLoading: boolean;
  error?: string | null;
}

const WaterLevelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z" />
    </svg>
);


const TankLevelCard: React.FC<TankLevelCardProps> = ({ tankLevel, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card title="Nível da Caixa D'água">
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Nível da Caixa D'água">
        <p className="text-red-500 text-center py-4">{error}</p>
      </Card>
    );
  }

  if (!tankLevel) {
    return (
      <Card title="Nível da Caixa D'água">
        <p className="text-gray-500 text-center py-4">Dados de nível indisponíveis.</p>
      </Card>
    );
  }

  const levelColor = tankLevel.levelPercentage < 20 ? 'bg-red-500' : tankLevel.levelPercentage < 50 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <Card title="Nível da Caixa D'água" className="flex flex-col justify-between">
      <div className='mb-auto'>
        <div className="flex items-baseline justify-center my-4">
          <span className="text-5xl font-bold text-gray-800">{tankLevel.levelPercentage.toFixed(0)}</span>
          <span className="text-2xl text-gray-600">%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ease-out ${levelColor}`}
            style={{ width: `${tankLevel.levelPercentage}%` }}
            role="progressbar"
            aria-valuenow={tankLevel.levelPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Nível da caixa d'água: ${tankLevel.levelPercentage}%`}
          ></div>
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center mt-3">
        <WaterLevelIcon className="inline mr-1 w-4 h-4" />
        Última atualização: {new Date(tankLevel.lastUpdated).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
      </div>
    </Card>
  );
};

export default TankLevelCard;
