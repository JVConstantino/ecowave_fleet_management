
import React from 'react';
import { CondominiumInfo, UserRole, ChartDataPoint } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import ConsumptionChart from '../ConsumptionChart'; 
import { 
    getTankLevelHistory, 
    getFinancialSummary,
    getConcessionairePressureHistory,
    getInternalPressureHistory,
    getPumpEnergyHistory
} from '../../services/waterDataService';

interface ReportsPageProps {
  selectedCondominium: CondominiumInfo; 
  userRole: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ selectedCondominium, userRole }) => {
  const [superiorTankHistoryData, setSuperiorTankHistoryData] = React.useState<ChartDataPoint[]>([]);
  const [inferiorTankHistoryData, setInferiorTankHistoryData] = React.useState<ChartDataPoint[]>([]);
  const [waterFinancialData, setWaterFinancialData] = React.useState<ChartDataPoint[]>([]);
  const [concessionairePressureData, setConcessionairePressureData] = React.useState<ChartDataPoint[]>([]);
  const [internalPressureData, setInternalPressureData] = React.useState<ChartDataPoint[]>([]);
  const [pumpEnergyKWhData, setPumpEnergyKWhData] = React.useState<ChartDataPoint[]>([]);
  const [pumpEnergyCostData, setPumpEnergyCostData] = React.useState<ChartDataPoint[]>([]);
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchReportData = async () => {
      if (!selectedCondominium) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const [
            superiorTankData,
            inferiorTankData,
            finData,
            concessionairePressure,
            internalPressure,
            pumpKWh,
            pumpCost
        ] = await Promise.all([
          getTankLevelHistory(selectedCondominium.id, 'superior'),
          getTankLevelHistory(selectedCondominium.id, 'inferior'),
          getFinancialSummary(selectedCondominium.id, 'last6Months'),
          getConcessionairePressureHistory(selectedCondominium.id),
          getInternalPressureHistory(selectedCondominium.id),
          getPumpEnergyHistory(selectedCondominium.id, 'kwh'),
          getPumpEnergyHistory(selectedCondominium.id, 'cost')
        ]);
        setSuperiorTankHistoryData(superiorTankData);
        setInferiorTankHistoryData(inferiorTankData);
        setWaterFinancialData(finData);
        setConcessionairePressureData(concessionairePressure);
        setInternalPressureData(internalPressure);
        setPumpEnergyKWhData(pumpKWh);
        setPumpEnergyCostData(pumpCost);

      } catch (err) {
        console.error("Failed to load report data:", err);
        setError("Falha ao carregar dados para os relatórios. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [selectedCondominium]);

  const renderChart = (
    title: string, 
    data: ChartDataPoint[], 
    chartIsLoading: boolean, 
    yAxisLabel: string, 
    tooltipSuffix: string, 
    tooltipPrefix: string = "",
    seriesName: string,
    color: string,
    chartType: 'line' | 'bar' = 'line'
  ) => (
    <Card title={title}> 
      {chartIsLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>
      ) : data.length > 0 ? (
        <ConsumptionChart 
          data={data} 
          type={chartType}
          color={color} 
          yAxisLabel={yAxisLabel}
          tooltipValueSuffix={tooltipSuffix}
          tooltipValuePrefix={tooltipPrefix}
          tooltipLegendName={seriesName.split(" ")[0]} // e.g. "Nível" from "Nível do Reservatório"
          seriesName={seriesName}
        />
      ) : (
        <p className="text-gray-500 text-center py-4">Sem dados disponíveis para este relatório.</p>
      )}
    </Card>
  );


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-gray-800">
        Central de Relatórios: {selectedCondominium.name}
      </h2>

      {error && !isLoading && ( // Show general error if not loading individual charts
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderChart("Nível do Reservatório Superior", superiorTankHistoryData, isLoading, "Nível (%)", " %", "", "Nível Superior", "#3b82f6")}
        {renderChart("Nível do Reservatório Inferior", inferiorTankHistoryData, isLoading, "Nível (%)", " %", "", "Nível Inferior", "#10b981")}
        
        {renderChart("Pressão da Rede da Concessionária", concessionairePressureData, isLoading, "Pressão (PSI)", " PSI", "", "Pressão Concessionária", "#ef4444")}
        {renderChart("Pressão da Rede Interna", internalPressureData, isLoading, "Pressão (PSI)", " PSI", "", "Pressão Interna", "#f97316")}

        {renderChart("Consumo de Energia da Bomba (KWh)", pumpEnergyKWhData, isLoading, "Energia (KWh)", " KWh", "", "Energia Bomba", "#8b5cf6", "bar")}
        {renderChart("Custo de Energia da Bomba (R$)", pumpEnergyCostData, isLoading, "Custo (R$)", "", "R$ ", "Custo Bomba", "#d946ef", "bar")}
        
        {renderChart("Custo de Água (Últimos 6 Meses)", waterFinancialData, isLoading, "Custo (R$)", "", "R$ ", "Custo Água", "#06b6d4", "bar")}
      </div>
      
      <Card title="Mais Informações">
        <ul className="list-disc list-inside text-gray-500 mt-3 space-y-1 text-sm">
          <li>Os gráficos de histórico exibem os últimos pontos de dados disponíveis (até 300 pontos).</li>
          <li>O custo de água é baseado no consumo total e no preço por m³ configurado para este cliente.</li>
          <li>O custo de energia da bomba é baseado no consumo em KWh e no preço por KWh configurado.</li>
        </ul>
        { (userRole === 'superAdmin' || userRole === 'condoAdminCompany') && (
            <p className="mt-4 text-sm text-gray-500 italic">
                Administrador visualizando relatórios para: {selectedCondominium.name} (ID: {selectedCondominium.id})
            </p>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;
