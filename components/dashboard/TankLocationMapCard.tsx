
import React from 'react';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { TankLocation } from '../../types';

interface TankLocationMapCardProps {
  tankLocation: TankLocation | null;
  isLoading: boolean;
  error?: string | null;
}

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);


const TankLocationMapCard: React.FC<TankLocationMapCardProps> = ({ tankLocation, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card title="Localização da Caixa D'água">
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Localização da Caixa D'água">
        <p className="text-red-500 text-center py-4">{error}</p>
      </Card>
    );
  }

  if (!tankLocation) {
    return (
      <Card title="Localização da Caixa D'água">
        <p className="text-gray-500 text-center py-4">Dados de localização indisponíveis.</p>
      </Card>
    );
  }

  return (
    <Card title="Localização da Caixa D'água">
      <div className="space-y-3">
        <div 
            className="h-32 w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500 border border-gray-300"
            aria-label="Placeholder de mapa"
        >
          <MapPinIcon className="w-10 h-10 text-blue-400" />
          <span className="ml-2 text-sm">(Simulação de Mapa)</span>
        </div>
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Endereço:</span> {tankLocation.address}
          </p>
          <p className="text-xs text-gray-500">
            Lat: {tankLocation.latitude.toFixed(6)}, Lon: {tankLocation.longitude.toFixed(6)}
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps?q=${tankLocation.latitude},${tankLocation.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center"
        >
          Ver no Google Maps <MapPinIcon className="w-4 h-4 ml-1" />
        </a>
      </div>
    </Card>
  );
};

export default TankLocationMapCard;
