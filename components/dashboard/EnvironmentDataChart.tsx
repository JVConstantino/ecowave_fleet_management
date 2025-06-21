
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../types';
import Spinner from '../ui/Spinner';
import { TEMP_CHART_COLOR, HUMIDITY_CHART_COLOR } from '../../constants';

interface EnvironmentDataChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload; // Access the full data point
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200" role="tooltip">
        <p className="text-sm font-semibold text-gray-700 mb-1">{`Horário: ${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }} className="text-xs">
            {`${pld.name}: ${pld.value !== undefined ? pld.value.toFixed(1) : 'N/A'} ${pld.dataKey === 'temperature' ? '°C' : '%'}`}
          </p>
        ))}
        {dataPoint.fullDate && (
           <p className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100">
             {new Date(dataPoint.fullDate).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric'})}
           </p>
        )}
      </div>
    );
  }
  return null;
};


const EnvironmentDataChart: React.FC<EnvironmentDataChartProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80 md:h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro ao carregar dados do ambiente: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Sem dados de temperatura e umidade disponíveis.</div>;
  }

  return (
    <div className="h-80 md:h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            yAxisId="temp" 
            orientation="left" 
            stroke={TEMP_CHART_COLOR} 
            tick={{ fontSize: 10, fill: TEMP_CHART_COLOR }}
            label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: TEMP_CHART_COLOR, fontSize: 12, dx: -5 }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <YAxis 
            yAxisId="humidity" 
            orientation="right" 
            stroke={HUMIDITY_CHART_COLOR} 
            tick={{ fontSize: 10, fill: HUMIDITY_CHART_COLOR }}
            label={{ value: 'Umidade (%)', angle: -90, position: 'insideRight', fill: HUMIDITY_CHART_COLOR, fontSize: 12, dx: 5 }}
             domain={[0, 100]} // Humidity is 0-100%
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{paddingTop: '15px'}} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Temperatura"
            stroke={TEMP_CHART_COLOR}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5 }}
            connectNulls // Connect lines even if there are null values in between
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            name="Umidade"
            stroke={HUMIDITY_CHART_COLOR}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnvironmentDataChart;
