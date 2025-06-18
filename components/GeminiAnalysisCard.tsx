import React, { useState, useCallback } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getWaterSavingTip, getConsumptionAnalysis } from '../services/geminiService';
import { OverallMetrics, WaterDataForGemini } from '../types';

interface GeminiAnalysisCardProps {
  metrics: OverallMetrics | null;
}

const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-4.5 0m4.5 0v.75A2.25 2.25 0 0 1 13.5 21h-3a2.25 2.25 0 0 1-2.25-2.25V18.75m1.06-6.06A7.5 7.5 0 0 1 18 12.75v-2.522c0-2.846-1.873-5.385-4.586-6.326a11.978 11.978 0 0 0-6.828 0C3.873 4.843 2 7.383 2 10.228v2.522A7.5 7.5 0 0 1 7.44 18.75-12.06 12.06 0 0 1 3.75 16.5m14.5 0v.75a3.75 3.75 0 0 1-7.5 0v-.75m7.5 0a3.75 3.75 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
);

const WandIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-2.065.922A3 3 0 0 1 6.53 16.5H6.5a3 3 0 0 0-2.096.878m1.424.044L3.75 21M9.53 16.122l2.312-3.083m0 0L10.5 12.5m1.342.539L15 11.25m1.5 6.75L15 11.25m0 0l2.312-3.083M15 11.25L16.29 9m3.356 2.091c.21-.21.405-.44.582-.68C20.655 9.873 21 9.202 21 8.5c0-2.01-.585-3.802-1.597-5.221C18.718 2.292 17.72 2.01 16.5 2.01c-.996 0-1.957.228-2.868.647M12 12.75V3.75M15 11.25L10.5 6M15 11.25L19.5 15.75" />
</svg>
);


const GeminiAnalysisCard: React.FC<GeminiAnalysisCardProps> = ({ metrics }) => {
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchTip = useCallback(async () => {
    setIsLoadingTip(true);
    setError(null);
    setTip(null);
    try {
      const fetchedTip = await getWaterSavingTip();
      setTip(fetchedTip);
    } catch (err) {
      setError("Falha ao buscar dica.");
      console.error(err);
    } finally {
      setIsLoadingTip(false);
    }
  }, []);

  const handleFetchAnalysis = useCallback(async () => {
    if (!metrics) {
        setError("Dados de métricas não disponíveis para análise.");
        return;
    }
    setIsLoadingAnalysis(true);
    setError(null);
    setAnalysis(null);
    try {
        const dataForGemini: WaterDataForGemini = {
            currentMonthTotal: metrics.totalCurrentMonth,
            previousMonthTotal: metrics.totalPreviousMonth,
            averageDaily: metrics.averageDailyCurrentMonth,
        };
      const fetchedAnalysis = await getConsumptionAnalysis(dataForGemini);
      setAnalysis(fetchedAnalysis);
    } catch (err) {
      setError("Falha ao buscar análise de consumo.");
      console.error(err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [metrics]);

  return (
    <Card title="Análises e Dicas com IA">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-semibold text-gray-700 flex items-center"><LightbulbIcon className="mr-2 text-yellow-500" /> Dica Rápida de Economia</h4>
            <Button onClick={handleFetchTip} isLoading={isLoadingTip} size="sm" variant="ghost">
              Nova Dica
            </Button>
          </div>
          {isLoadingTip && <div className="flex justify-center p-4"><Spinner /></div>}
          {tip && <p className="text-gray-600 bg-blue-50 p-3 rounded-md text-sm">{tip}</p>}
          {!isLoadingTip && !tip && !error && <p className="text-gray-500 text-sm">Clique em "Nova Dica" para receber uma sugestão de economia de água.</p>}
        </div>
        
        <hr className="border-gray-200"/>

        <div>
          <div className="flex justify-between items-center mb-2">
             <h4 className="text-md font-semibold text-gray-700 flex items-center"><WandIcon className="mr-2 text-purple-500"/> Análise de Consumo (IA)</h4>
            <Button onClick={handleFetchAnalysis} isLoading={isLoadingAnalysis} size="sm" variant="ghost" disabled={!metrics}>
              Analisar Consumo
            </Button>
          </div>
          {isLoadingAnalysis && <div className="flex justify-center p-4"><Spinner /></div>}
          {analysis && <p className="text-gray-600 bg-purple-50 p-3 rounded-md text-sm whitespace-pre-wrap">{analysis}</p>}
          {!isLoadingAnalysis && !analysis && !error && <p className="text-gray-500 text-sm">Clique em "Analisar Consumo" para uma análise baseada nos seus dados atuais.</p>}
           {!metrics && !isLoadingAnalysis && <p className="text-sm text-yellow-600">Dados de métricas ainda não carregados. Aguarde ou atualize.</p>}
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
    </Card>
  );
};

export default GeminiAnalysisCard;