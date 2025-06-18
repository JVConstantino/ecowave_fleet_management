
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { CHART_PRIMARY_COLOR } from '../constants';

interface ConsumptionChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  dataKey?: string;
  xAxisDataKey?: string;
  color?: string;
  yAxisLabel: string;
  tooltipValuePrefix?: string;
  tooltipValueSuffix: string;
  tooltipLegendName: string;
  seriesName: string;
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ 
    data, 
    type = 'line', 
    dataKey = 'value', 
    xAxisDataKey = 'name',
    color = CHART_PRIMARY_COLOR,
    yAxisLabel,
    tooltipValuePrefix = '',
    tooltipValueSuffix,
    tooltipLegendName,
    seriesName
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Sem dados disponíveis para o gráfico.</div>;
  }
  
  // Use directly imported components
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div className="h-80 md:h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}> {/* Adjusted left margin slightly for Y-axis label */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xAxisDataKey} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: -5, fill: '#6b7280', fontSize: 14, dy:40 }} // Adjusted offset & dy for better positioning
          />
          <Tooltip 
            formatter={(value: number) => [`${tooltipValuePrefix}${value.toFixed(type === 'line' ? 1 : 2)}${tooltipValueSuffix}`, tooltipLegendName]}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            itemStyle={{ color: color }}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{paddingTop: '15px'}} />
          <DataComponent 
            type="monotone" 
            dataKey={dataKey} 
            name={seriesName}
            stroke={type === 'line' ? color : undefined} 
            fill={type === 'bar' ? color : undefined} 
            strokeWidth={type === 'line' ? 2 : undefined}
            barSize={type === 'bar' ? 20 : undefined}
            dot={type === 'line' ? { r: 4, strokeWidth: 2 } : false}
            activeDot={type === 'line' ? { r: 6 } : undefined}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;