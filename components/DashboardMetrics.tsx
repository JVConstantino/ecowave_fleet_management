
import React from 'react';
import { OverallMetrics } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface DashboardMetricsProps {
  metrics: OverallMetrics | null;
  loading: boolean;
}

const MetricItem: React.FC<{ title: string; value: string | number; unit?: string; change?: number; icon?: React.ReactNode }> = ({ title, value, unit, change, icon }) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const changeColor = isPositive ? 'text-red-500' : isNegative ? 'text-green-500' : 'text-gray-500';
  const changeIcon = isPositive ? '▲' : isNegative ? '▼' : '';

  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center text-sm text-gray-500 mb-1">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {value} <span className="text-sm font-normal text-gray-600">{unit}</span>
      </div>
      {change !== undefined && (
        <div className={`text-sm font-medium ${changeColor} mt-1`}>
          {changeIcon} {Math.abs(change).toFixed(1)}% {isPositive ? "aumento" : isNegative ? "redução" : "estável"} vs mês anterior
        </div>
      )}
    </div>
  );
};

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, loading }) => {
  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="text-center py-8 text-gray-500">Não foi possível carregar as métricas.</div>
      </Card>
    );
  }

  const WaterBillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>;
  const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>;
  const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.243-3.72a9.094 9.094 0 0 1-3.741.479A3 3 0 0 1 13.18 6.095m6.44 8.293V16.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricItem title="Consumo Mês Atual" value={metrics.totalCurrentMonth} unit="m³" change={metrics.comparisonPercentage} icon={<WaterBillIcon />} />
      <MetricItem title="Média Diária (Atual)" value={metrics.averageDailyCurrentMonth} unit="m³/dia" icon={<CalendarIcon />} />
      <MetricItem title="Consumo Mês Anterior" value={metrics.totalPreviousMonth} unit="m³" icon={<WaterBillIcon />} />
      <MetricItem title="Unidades Ativas" value={metrics.activeUnits} unit="" icon={<UsersIcon />} />
    </div>
  );
};

export default DashboardMetrics;
