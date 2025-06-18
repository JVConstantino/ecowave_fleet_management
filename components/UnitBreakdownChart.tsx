
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChartDataPoint } from '../types';
import { CHART_UNIT_COLORS } from '../constants';

interface UnitBreakdownChartProps {
  data: ChartDataPoint[];
  title: string; // Title is now handled by Card, but prop might be used for specific context if needed elsewhere
}

const UnitBreakdownChart: React.FC<UnitBreakdownChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Sem dados disponíveis para o gráfico de unidades.</div>;
  }

  // Use directly imported components

  return (
    <div className="h-80 md:h-96 w-full"> {/* Increased height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}> {/* Adjusted margins for vertical */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} label={{ value: 'Consumo (m³)', position: 'insideBottom', offset: -10, fill: '#6b7280', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} width={100} interval={0} /> {/* Adjusted width and interval for better label display */}
          <Tooltip 
             formatter={(value: number) => [`${value.toFixed(2)} m³`, "Consumo"]}
             labelStyle={{ color: '#374151', fontWeight: 'bold' }}
             contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          />
          {/* Legend can be removed if colors directly map to units and units are on Y-axis */}
          {/* <Legend wrapperStyle={{paddingTop: '15px'}}/> */}
          <Bar dataKey="value" name="Consumo por Unidade" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_UNIT_COLORS[index % CHART_UNIT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UnitBreakdownChart;