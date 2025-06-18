
import React from 'react';
import { CondominiumInfo, UserRole, ChartDataPoint } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import ConsumptionChart from '../ConsumptionChart'; // Re-use for financial/tank level charts
import { getTankLevelHistory, getFinancialSummary } from '../../services/waterDataService';

interface ReportsPageProps {
  selectedCondominium: CondominiumInfo; // Type remains, but represents a client
  userRole: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ selectedCondominium, userRole }) => {
  const [tankHistoryData, setTankHistoryData] = React.useState<ChartDataPoint[]>([]);
  const [financialData, setFinancialData] = React.useState<ChartDataPoint[]>([]);
  const [isLoadingTankHistory, setIsLoadingTankHistory] = React.useState(true);
  const [isLoadingFinancial, setIsLoadingFinancial] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchReportData = async () => {
      if (!selectedCondominium) return;
      
      setIsLoadingTankHistory(true);
      setIsLoadingFinancial(true);
      setError(null);

      try {
        const [tankData, finData] = await Promise.all([
          getTankLevelHistory(selectedCondominium.id),
          getFinancialSummary(selectedCondominium.id, 'last6Months')
        ]);
        setTankHistoryData(tankData);
        setFinancialData(finData);
      } catch (err) {
        console.error("Failed to load report data:", err);
        setError("Falha ao carregar dados para os relatórios. Tente novamente mais tarde.");
      } finally {
        setIsLoadingTankHistory(false);
        setIsLoadingFinancial(false);
      }
    };

    fetchReportData();
  }, [selectedCondominium]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-gray-800">
        Central de Relatórios: {selectedCondominium.name}
      </h2>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card title="Histórico do Nível do Reservatório (Últimos Pontos)"> 
        {isLoadingTankHistory ? (
          <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>
        ) : tankHistoryData.length > 0 ? (
          <ConsumptionChart 
            data={tankHistoryData} 
            type="line"
            dataKey="value"
            xAxisDataKey="name"
            color="#8884d8" 
            yAxisLabel="Nível (%)"
            tooltipValueSuffix=" %"
            tooltipLegendName="Nível"
            seriesName="Nível do Reservatório"
          />
        ) : (
          <p className="text-gray-500 text-center py-4">Sem dados de histórico de nível disponíveis.</p>
        )}
      </Card>

      <Card title="Resumo Financeiro (Últimos 6 Meses)">
        {isLoadingFinancial ? (
          <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>
        ) : financialData.length > 0 ? (
          <ConsumptionChart 
            data={financialData} 
            type="bar" 
            dataKey="value"
            xAxisDataKey="name"
            color="#82ca9d" 
            yAxisLabel="Custo (R$)"
            tooltipValuePrefix="R$ "
            tooltipValueSuffix=""
            tooltipLegendName="Custo"
            seriesName="Custo Mensal"
          />
        ) : (
          <p className="text-gray-500 text-center py-4">Sem dados financeiros disponíveis.</p>
        )}
      </Card>
      
      <Card title="Outros Relatórios">
        <p className="text-gray-600">
          Mais relatórios e visualizações detalhadas estarão disponíveis em breve, incluindo:
        </p>
        <ul className="list-disc list-inside text-gray-500 mt-3 space-y-1">
          <li>Comparativos de consumo/desempenho entre diferentes períodos.</li>
          <li>Análise por unidade/veículo com filtros de data.</li>
          <li>Picos de consumo/eventos e alertas.</li>
          <li>Relatório de acionamento de recursos.</li>
        </ul>
        {userRole === 'admin' && (
            <p className="mt-4 text-sm text-gray-500 italic">
                Administrador visualizando relatórios para: {selectedCondominium.name} (ID: {selectedCondominium.id})
            </p>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;