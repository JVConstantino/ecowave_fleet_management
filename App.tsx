
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import ConsumptionChart from './components/ConsumptionChart';
import UnitBreakdownChart from './components/UnitBreakdownChart';
import GeminiAnalysisCard from './components/GeminiAnalysisCard';
import AdminCompanyManagement from './components/admin/AdminCompanyManagement';
import Card from './components/ui/Card';
import Spinner from './components/ui/Spinner';
import Button from './components/ui/Button';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Sidebar, { AuthenticatedAppView } from './components/Sidebar'; 
import PumpStatusCard from './components/dashboard/PumpStatusCard';
import TankLevelCard from './components/dashboard/TankLevelCard';
import TankLocationMapCard from './components/dashboard/TankLocationMapCard';
import ReportsPage from './components/reports/ReportsPage'; 

import { 
    OverallMetrics, 
    ChartDataPoint, 
    CondominiumInfo, 
    UserRole, 
    AuthenticatedUser, 
    AdminUserInfo,
    PumpStatus,
    TankLevel,
    TankLocation
} from './types';
import { 
    getOverallMetrics, 
    getMonthlyConsumptionTrend, 
    getUnitBreakdownCurrentMonth, 
    getCompanyById,
    getPumpStatus,
    getTankLevel,
    getTankLocation,
    setPumpActiveState
} from './services/waterDataService';
import { APP_NAME, MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD, MOCK_CONDO_PASSWORD } from './constants';

type AppScreen = 'home' | 'login' | 'authenticatedApp';

const RefreshIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const App: React.FC = () => {
  const [appScreen, setAppScreen] = useState<AppScreen>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loggedInUser, setLoggedInUser] = useState<AuthenticatedUser>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const [authenticatedAppView, setAuthenticatedAppView] = useState<AuthenticatedAppView>('admin'); 
  const [selectedCondominium, setSelectedCondominium] = useState<CondominiumInfo | null>(null); // Renaming this var later might be good if "Condominium" changes
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); 
  
  // Dashboard Data States
  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<ChartDataPoint[]>([]);
  const [unitBreakdown, setUnitBreakdown] = useState<ChartDataPoint[]>([]);
  const [pumpStatus, setPumpStatus] = useState<PumpStatus | null>(null);
  const [tankLevel, setTankLevel] = useState<TankLevel | null>(null);
  const [tankLocation, setTankLocation] = useState<TankLocation | null>(null);
  
  const [isLoadingDashboardData, setIsLoadingDashboardData] = useState<boolean>(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isTogglingPump, setIsTogglingPump] = useState<boolean>(false);


  const clearDashboardData = useCallback(() => {
    setMetrics(null);
    setMonthlyTrend([]);
    setUnitBreakdown([]);
    setPumpStatus(null);
    setTankLevel(null);
    setTankLocation(null);
    setDashboardError(null);
  }, []);

  const fetchDashboardData = useCallback(async (clientId: string) => { // Renamed condominiumId to clientId for clarity
    if (!clientId) return;

    setIsLoadingDashboardData(true);
    clearDashboardData(); 
    setDashboardError(null); 
    try {
      const [
        metricsData, 
        trendData, 
        breakdownData,
        pumpStatusData,
        tankLevelData,
        tankLocationData
      ] = await Promise.all([
        getOverallMetrics(clientId),
        getMonthlyConsumptionTrend(clientId),
        getUnitBreakdownCurrentMonth(clientId),
        getPumpStatus(clientId),
        getTankLevel(clientId),
        getTankLocation(clientId),
      ]);
      
      setMetrics(metricsData);
      setMonthlyTrend(trendData);
      setUnitBreakdown(breakdownData);
      setPumpStatus(pumpStatusData);
      setTankLevel(tankLevelData);
      setTankLocation(tankLocationData);

    } catch (err) {
      console.error(`Failed to fetch dashboard data for ${clientId}:`, err);
      setDashboardError("Não foi possível carregar todos os dados do painel. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoadingDashboardData(false);
    }
  }, [clearDashboardData]);

  const handleLogin = useCallback(async (identifier: string, pass: string, role: 'admin' | 'condominium') => { // 'condominium' role here means client/unit
    setIsLoginLoading(true);
    setLoginError(null);
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (role === 'admin') {
      if (identifier === MOCK_ADMIN_EMAIL && pass === MOCK_ADMIN_PASSWORD) {
        const adminUser: AdminUserInfo = { id: 'admin001', name: 'Administrador', type: 'admin' };
        setIsAuthenticated(true);
        setUserRole('admin');
        setLoggedInUser(adminUser);
        setAuthenticatedAppView('admin'); 
        setSelectedCondominium(null); 
        clearDashboardData();
        setAppScreen('authenticatedApp');
      } else {
        setLoginError('Credenciais de administrador inválidas.');
      }
    } else if (role === 'condominium') { // This is client/unit login
      const client = await getCompanyById(identifier); // Assuming getCompanyById finds a "client"
      if (client && pass === MOCK_CONDO_PASSWORD) {
        setIsAuthenticated(true);
        setUserRole('condominium'); // This role represents a client/unit user
        setLoggedInUser(client);
        setSelectedCondominium(client); 
        setAuthenticatedAppView('dashboard'); 
        fetchDashboardData(client.id);
        setAppScreen('authenticatedApp');
      } else {
        setLoginError('ID do Cliente/Unidade ou senha inválidos.');
      }
    }
    setIsLoginLoading(false);
  }, [fetchDashboardData, clearDashboardData]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setLoggedInUser(null);
    setSelectedCondominium(null);
    clearDashboardData();
    setAppScreen('login'); 
  }, [clearDashboardData]);

  const navigateToLogin = useCallback(() => setAppScreen('login'), []);
  const navigateToHome = useCallback(() => setAppScreen('home'), []);

  const handleViewClientDashboardFromAdmin = useCallback((client: CondominiumInfo) => { 
    if (userRole !== 'admin') return; 
    setSelectedCondominium(client);
    setAuthenticatedAppView('dashboard');
    fetchDashboardData(client.id);
  }, [userRole, fetchDashboardData]);

  const handleBackToAdminPanel = () => { 
    if (userRole !== 'admin') return;
    setAuthenticatedAppView('admin');
  };

  const handleNavigateToDashboardView = () => {
    if (userRole === 'condominium' && loggedInUser && 'id' in loggedInUser) { // Client/Unit user
        if (selectedCondominium?.id !== loggedInUser.id || authenticatedAppView !== 'dashboard') {
            setSelectedCondominium(loggedInUser as CondominiumInfo); 
            setAuthenticatedAppView('dashboard');
            fetchDashboardData(loggedInUser.id);
        } else if (authenticatedAppView === 'dashboard') { 
            fetchDashboardData(loggedInUser.id);
        }
    } else if (userRole === 'admin' && selectedCondominium) {
        if (authenticatedAppView !== 'dashboard') {
           setAuthenticatedAppView('dashboard');
        }
        fetchDashboardData(selectedCondominium.id);
    }
  };
  
  const handleNavigateToReportsView = useCallback(() => {
    if (userRole === 'condominium' && loggedInUser && 'id' in loggedInUser) { // Client/Unit user
        setSelectedCondominium(loggedInUser as CondominiumInfo);
        setAuthenticatedAppView('reports');
    } else if (userRole === 'admin' && selectedCondominium) {
        setAuthenticatedAppView('reports');
    } else if (userRole === 'admin' && !selectedCondominium) {
        setAuthenticatedAppView('reports'); 
    }
  }, [userRole, loggedInUser, selectedCondominium]);


  const handleRefreshDashboard = () => {
    if (selectedCondominium && authenticatedAppView === 'dashboard') { 
      fetchDashboardData(selectedCondominium.id);
    }
  };

  const handleTogglePump = async (currentPumpState: boolean) => {
    if (!selectedCondominium || !pumpStatus) return;
    setIsTogglingPump(true);
    setDashboardError(null);
    try {
        const newPumpStatus = await setPumpActiveState(selectedCondominium.id, !currentPumpState);
        setPumpStatus(newPumpStatus);
    } catch (error) {
        console.error("Failed to toggle pump state:", error);
        setDashboardError("Falha ao acionar o recurso. Tente novamente."); // Generic message
    } finally {
        setIsTogglingPump(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (appScreen === 'home') {
    return <HomePage onNavigateToLogin={navigateToLogin} />;
  }

  if (appScreen === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigateToHome={navigateToHome} loginError={loginError} isLoading={isLoginLoading} />;
  }

  if (appScreen === 'authenticatedApp' && isAuthenticated && loggedInUser) {
    const isClientSelectedByAdmin = userRole === 'admin' && !!selectedCondominium;

    return (
      <div className="min-h-screen flex flex-col">
        <Header 
            isAuthenticated={isAuthenticated}
            user={loggedInUser}
            userRole={userRole}
            onLogout={handleLogout}
            authenticatedAppView={authenticatedAppView}
            selectedCondominiumName={ // Name remains "condominium" for now, as data structure is CondominiumInfo
                (userRole === 'admin' && (authenticatedAppView === 'dashboard' || authenticatedAppView === 'reports')) 
                ? selectedCondominium?.name 
                : undefined
            }
        />
        <div className="flex flex-1 pt-16"> 
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={toggleSidebar}
                userRole={userRole}
                currentView={authenticatedAppView}
                navigateToAdminPanel={handleBackToAdminPanel}
                navigateToDashboardView={handleNavigateToDashboardView}
                navigateToReportsView={handleNavigateToReportsView}
                isCondoSelectedByAdmin={isClientSelectedByAdmin} // Renamed for clarity
            />
            <main 
              className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out"
              style={{ marginLeft: isSidebarOpen ? '16rem' : '4.5rem' }} 
            >
              {userRole === 'admin' && authenticatedAppView === 'admin' && (
                <AdminCompanyManagement onViewCompanyDashboard={handleViewClientDashboardFromAdmin} />
              )}

              {authenticatedAppView === 'dashboard' && selectedCondominium && (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                      {userRole === 'admin' && ( 
                        <Button onClick={handleBackToAdminPanel} variant="ghost" size="sm" leftIcon={<ArrowLeftIcon />} className="mb-2 sm:mb-0 hidden sm:flex">
                            Voltar para Gerenciamento
                        </Button>
                      )}
                      <h2 className="text-2xl font-semibold text-gray-700 mt-1">
                        Painel: {selectedCondominium.name}
                      </h2>
                    </div>
                    <Button onClick={handleRefreshDashboard} isLoading={isLoadingDashboardData} leftIcon={<RefreshIcon/>}>
                        Atualizar Dados do Painel
                    </Button>
                  </div>

                  {dashboardError && (
                    <Card className="mb-6 bg-red-50 border border-red-200">
                      <p className="text-red-700 font-medium">{dashboardError}</p>
                    </Card>
                  )}

                  <DashboardMetrics metrics={metrics} loading={isLoadingDashboardData && !metrics} />
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="Tendência de Consumo Mensal (Últimos 30 dias)" className="lg:col-span-2">
                      {isLoadingDashboardData && !monthlyTrend.length ? <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div> : 
                        <ConsumptionChart 
                            data={monthlyTrend} 
                            yAxisLabel="Consumo (m³)" // This label might need to be generic or configurable if it's not always water
                            tooltipValueSuffix=" m³"
                            tooltipLegendName="Consumo"
                            seriesName="Consumo Mensal"
                        />}
                    </Card>
                    <GeminiAnalysisCard metrics={metrics} />
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PumpStatusCard 
                        pumpStatus={pumpStatus} 
                        isLoading={isLoadingDashboardData && !pumpStatus}
                        onTogglePump={handleTogglePump}
                        isTogglingPump={isTogglingPump}
                    />
                    <TankLevelCard 
                        tankLevel={tankLevel} 
                        isLoading={isLoadingDashboardData && !tankLevel} 
                    />
                    <TankLocationMapCard 
                        tankLocation={tankLocation} 
                        isLoading={isLoadingDashboardData && !tankLocation}
                    />
                  </div>
                  <div className="mt-6">
                      <Card title="Consumo por Unidade (Mês Atual)">
                          {isLoadingDashboardData && !unitBreakdown.length ? <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div> : <UnitBreakdownChart data={unitBreakdown} title="Consumo por Unidade" />}
                      </Card>
                  </div>
                </>
              )}

              {authenticatedAppView === 'reports' && selectedCondominium && (
                <ReportsPage 
                    selectedCondominium={selectedCondominium} 
                    userRole={userRole} 
                />
              )}

              {(authenticatedAppView === 'dashboard' || authenticatedAppView === 'reports') && !selectedCondominium && userRole === 'admin' && ( 
                  <div className="text-center py-10">
                      <p className="text-xl text-gray-600">Nenhum cliente selecionado.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Selecione um cliente no painel de Gerenciamento para ver seu {authenticatedAppView === 'dashboard' ? 'painel' : 'relatórios'}.
                      </p>
                      <Button onClick={handleBackToAdminPanel} variant="primary" className="mt-4">
                          Ir para Gerenciamento
                      </Button>
                  </div>
              )}
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Spinner size="lg" />
    </div>
  );
};

export default App;