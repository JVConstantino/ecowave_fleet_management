
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import ConsumptionChart from './components/ConsumptionChart';
import UnitBreakdownChart from './components/UnitBreakdownChart';
import GeminiAnalysisCard from './components/GeminiAnalysisCard';
// Admin/Management Components
import SuperAdminManagement from './components/admin/SuperAdminManagement'; // New: Manages CondoAdminCompanies
import CondominiumManagement from './components/admin/AdminCompanyManagement'; // Corrected import path
import ClientDetailsManagementPage from './components/admin/ClientDetailsManagementPage';

import Card from './components/ui/Card';
import Spinner from './components/ui/Spinner';
import Button from './components/ui/Button';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Sidebar, { AuthenticatedAppView } from './components/Sidebar'; 
import PumpStatusCard from './components/dashboard/PumpStatusCard';
import TankLevelCard from './components/dashboard/TankLevelCard';
import TankLocationMapCard from './components/dashboard/TankLocationMapCard';
import EnvironmentDataChart from './components/dashboard/EnvironmentDataChart';
import ReportsPage from './components/reports/ReportsPage'; 

import { 
    OverallMetrics, 
    ChartDataPoint, 
    CondominiumInfo, 
    CondoAdminCompanyInfo, // New
    SuperAdminUserInfo, // New
    UserRole, 
    AuthenticatedUser, 
    PumpStatus,
    TankLevel,
    TankLocation
} from './types';
import { 
    // Authentication
    authenticateSuperAdmin, // New
    authenticateCondoAdminCompany, // New
    // Data Getters
    getOverallMetrics, 
    getMonthlyConsumptionTrend, 
    getUnitBreakdownCurrentMonth, 
    getCondominiumById, // For condominiumUser login & general lookup
    getCondominiumsByManagingCompanyId, // For CondoAdminCompany and SuperAdmin context
    // updateCompanyDetails, // Renamed to updateCondominiumDetails
    updateCompanyDetails as updateCondominiumDetails, // Alias for clarity
    getPumpStatus,
    getTankLevel,
    getTankLocation,
    setPumpActiveState,
} from './services/waterDataService';
import { fetchTemperatureHumidityData } from './services/thingSpeakService';
import { 
    MOCK_SUPER_ADMIN_EMAIL, MOCK_SUPER_ADMIN_PASSWORD,
    MOCK_CONDO_ADMIN_COMPANY_EMAIL_1, MOCK_CONDO_ADMIN_COMPANY_PASSWORD_1,
    MOCK_CONDO_ADMIN_COMPANY_EMAIL_2, MOCK_CONDO_ADMIN_COMPANY_PASSWORD_2,
    MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD, // Legacy admin, now treated as a CondoAdminCompany
    MOCK_CONDO_PASSWORD 
} from './constants';

type AppScreen = 'home' | 'login' | 'authenticatedApp';
// ExtendedAuthenticatedAppView is now AuthenticatedAppView from Sidebar.tsx

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

  const [authenticatedAppView, setAuthenticatedAppView] = useState<AuthenticatedAppView>('superAdminManagement'); 
  const [selectedAdminCompany, setSelectedAdminCompany] = useState<CondoAdminCompanyInfo | null>(null); // For SuperAdmin selecting an AdminCompany
  const [selectedCondominium, setSelectedCondominium] = useState<CondominiumInfo | null>(null); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); 
  
  // Dashboard Data States
  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<ChartDataPoint[]>([]);
  const [unitBreakdown, setUnitBreakdown] = useState<ChartDataPoint[]>([]);
  const [pumpStatus, setPumpStatus] = useState<PumpStatus | null>(null);
  const [tankLevel, setTankLevel] = useState<TankLevel | null>(null);
  const [tankLocation, setTankLocation] = useState<TankLocation | null>(null);
  const [environmentData, setEnvironmentData] = useState<ChartDataPoint[]>([]);
  
  const [isLoadingDashboardData, setIsLoadingDashboardData] = useState<boolean>(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [environmentDataError, setEnvironmentDataError] = useState<string | null>(null);
  const [isTogglingPump, setIsTogglingPump] = useState<boolean>(false);


  const clearDashboardData = useCallback(() => {
    setMetrics(null);
    setMonthlyTrend([]);
    setUnitBreakdown([]);
    setPumpStatus(null);
    setTankLevel(null);
    setTankLocation(null);
    setEnvironmentData([]);
    setDashboardError(null);
    setEnvironmentDataError(null);
  }, []);

  const resetSelections = useCallback(() => {
    setSelectedAdminCompany(null);
    setSelectedCondominium(null);
    clearDashboardData();
  }, [clearDashboardData]);

  const fetchDashboardDataForCondo = useCallback(async (condoId: string) => { 
    if (!condoId) return;
    setIsLoadingDashboardData(true);
    clearDashboardData(); 
    setDashboardError(null); 
    setEnvironmentDataError(null);
    try {
      const coreDataPromises = [
        getOverallMetrics(condoId),
        getMonthlyConsumptionTrend(condoId),
        getUnitBreakdownCurrentMonth(condoId),
        getPumpStatus(condoId),
        getTankLevel(condoId),
        getTankLocation(condoId),
      ];
      let thingSpeakPromise = fetchTemperatureHumidityData().catch(err => {
        console.error(`Failed to fetch ThingSpeak data:`, err);
        setEnvironmentDataError("Falha ao carregar dados de temperatura e umidade.");
        return [];
      });
      
      const [
        metricsData, trendData, breakdownData, pumpData, tankData, locationData
      ] = await Promise.all(coreDataPromises);
      
      setMetrics(metricsData as OverallMetrics);
      setMonthlyTrend(trendData as ChartDataPoint[]);
      setUnitBreakdown(breakdownData as ChartDataPoint[]);
      setPumpStatus(pumpData as PumpStatus);
      setTankLevel(tankData as TankLevel);
      setTankLocation(locationData as TankLocation);

      const envData = await thingSpeakPromise;
      setEnvironmentData(envData);

    } catch (err) {
      console.error(`Failed to fetch dashboard data for ${condoId}:`, err);
      setDashboardError("Não foi possível carregar os dados do painel. Tente novamente.");
    } finally {
      setIsLoadingDashboardData(false);
    }
  }, [clearDashboardData]);

  const handleLogin = useCallback(async (identifier: string, pass: string, role: Exclude<UserRole, null>) => { 
    setIsLoginLoading(true);
    setLoginError(null);
    await new Promise(resolve => setTimeout(resolve, 500)); 

    try {
        let user: AuthenticatedUser = null;
        if (role === 'superAdmin') {
            // Check against updated Super Admin credentials from constants.ts
            if (identifier === MOCK_SUPER_ADMIN_EMAIL && pass === MOCK_SUPER_ADMIN_PASSWORD) {
                user = await authenticateSuperAdmin(identifier);
            }
        } else if (role === 'condoAdminCompany') {
             // Check against updated Condo Admin Company credentials from constants.ts
             if (
                (identifier === MOCK_CONDO_ADMIN_COMPANY_EMAIL_1 && pass === MOCK_CONDO_ADMIN_COMPANY_PASSWORD_1) ||
                (identifier === MOCK_CONDO_ADMIN_COMPANY_EMAIL_2 && pass === MOCK_CONDO_ADMIN_COMPANY_PASSWORD_2) ||
                (identifier === MOCK_ADMIN_EMAIL && pass === MOCK_ADMIN_PASSWORD) // Legacy admin still works with its defined consts
            ) {
                 user = await authenticateCondoAdminCompany(identifier);
             }
        } else if (role === 'condominiumUser') {
            // Check against Condominium ID (which can be 'condominio01@gmail.com') 
            // and the updated MOCK_CONDO_PASSWORD from constants.ts
            const condo = await getCondominiumById(identifier);
            if (condo && pass === MOCK_CONDO_PASSWORD) {
                user = condo;
            }
        }

        if (user) {
            setIsAuthenticated(true);
            setUserRole(role);
            setLoggedInUser(user);
            resetSelections(); // Clear selections from previous sessions

            if (role === 'superAdmin') {
                setAuthenticatedAppView('superAdminManagement');
            } else if (role === 'condoAdminCompany') {
                setSelectedAdminCompany(user as CondoAdminCompanyInfo); // Set context for this admin company
                setAuthenticatedAppView('condominiumManagement');
            } else if (role === 'condominiumUser') {
                setSelectedCondominium(user as CondominiumInfo);
                setAuthenticatedAppView('dashboard');
                fetchDashboardDataForCondo((user as CondominiumInfo).id);
            }
            setAppScreen('authenticatedApp');
        } else {
            setLoginError('Credenciais inválidas ou usuário não encontrado.');
        }
    } catch (err) {
        console.error("Login error:", err);
        setLoginError("Ocorreu um erro durante o login.");
    } finally {
        setIsLoginLoading(false);
    }
  }, [resetSelections, fetchDashboardDataForCondo]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setLoggedInUser(null);
    resetSelections();
    setAppScreen('login'); 
  }, [resetSelections]);

  const navigateToLogin = useCallback(() => setAppScreen('login'), []);
  const navigateToHome = useCallback(() => setAppScreen('home'), []);

  // --- Navigation Handlers for Authenticated Views ---
  const handleNavigateToSuperAdminManagement = () => {
    if (userRole === 'superAdmin') {
      setAuthenticatedAppView('superAdminManagement');
      resetSelections(); // Clear admin company and condo selections
    }
  };

  const handleNavigateToCondominiumManagement = () => {
    if (userRole === 'superAdmin' && selectedAdminCompany) {
        setAuthenticatedAppView('condominiumManagement');
        setSelectedCondominium(null); // Clear condo selection when viewing list of condos for an admin company
    } else if (userRole === 'condoAdminCompany') {
        // loggedInUser should be CondoAdminCompanyInfo
        setSelectedAdminCompany(loggedInUser as CondoAdminCompanyInfo);
        setAuthenticatedAppView('condominiumManagement');
        setSelectedCondominium(null); 
    }
  };
  
  // SuperAdmin selects a CondoAdminCompany from the SuperAdminManagement view
  const handleSelectAdminCompanyFromSuperAdmin = (adminCompany: CondoAdminCompanyInfo) => {
    if (userRole === 'superAdmin') {
      setSelectedAdminCompany(adminCompany);
      setAuthenticatedAppView('condominiumManagement'); // Show condos for this admin company
      setSelectedCondominium(null); // Clear any previously selected condo
      clearDashboardData();
    }
  };

  // CondoAdminCompany or SuperAdmin (with selectedAdminCompany) selects a Condominium
  const handleSelectCondominium = (condominium: CondominiumInfo) => {
    setSelectedCondominium(condominium);
    setAuthenticatedAppView('dashboard'); // Default to dashboard
    fetchDashboardDataForCondo(condominium.id);
  };
  
  const handleManageCondominiumDetails = (condominium: CondominiumInfo) => {
    setSelectedCondominium(condominium);
    setAuthenticatedAppView('clientDetails');
  };
  
  const handleNavigateToDashboardView = () => {
    if (selectedCondominium) {
        setAuthenticatedAppView('dashboard');
        fetchDashboardDataForCondo(selectedCondominium.id); // Re-fetch or ensure data is current
    } else if (userRole === 'condominiumUser' && loggedInUser) { // Direct login as condo user
        setSelectedCondominium(loggedInUser as CondominiumInfo);
        setAuthenticatedAppView('dashboard');
        fetchDashboardDataForCondo((loggedInUser as CondominiumInfo).id);
    }
    // Else, a condo must be selected first by higher roles
  };
  
  const handleNavigateToReportsView = () => {
    if (selectedCondominium) {
        setAuthenticatedAppView('reports');
    } else if (userRole === 'condominiumUser' && loggedInUser) {
        setSelectedCondominium(loggedInUser as CondominiumInfo);
        setAuthenticatedAppView('reports');
    }
  };

  const handleNavigateToClientDetailsView = () => {
      if (selectedCondominium && (userRole === 'condoAdminCompany' || (userRole === 'superAdmin' && selectedAdminCompany))) {
          setAuthenticatedAppView('clientDetails');
      }
  };
  
  const handleUpdateCondominiumDetails = async (condoId: string, detailsToUpdate: Partial<CondominiumInfo>) => {
    const updatedCondo = await updateCondominiumDetails(condoId, detailsToUpdate);
    if (updatedCondo) {
        setSelectedCondominium(updatedCondo as CondominiumInfo); // Ensure type cast
        // If the list of condominiums is visible, it should ideally re-fetch or update.
        // For now, updating selectedCondominium is key for ClientDetailsManagementPage.
    }
    return updatedCondo;
  };

  const handleRefreshDashboard = () => {
    if (selectedCondominium && authenticatedAppView === 'dashboard') { 
      fetchDashboardDataForCondo(selectedCondominium.id);
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
        setDashboardError("Falha ao acionar o recurso. Tente novamente."); 
    } finally {
        setIsTogglingPump(false);
    }
  };
  
  const handleBackToCondominiumManagement = () => {
    // This function is used to go back from ClientDetails or Dashboard (for an admin role) to the list of condominiums
    if (userRole === 'superAdmin' && selectedAdminCompany) {
        setAuthenticatedAppView('condominiumManagement');
        setSelectedCondominium(null); // Deselect the specific condo
    } else if (userRole === 'condoAdminCompany') {
        setAuthenticatedAppView('condominiumManagement');
        setSelectedCondominium(null); // Deselect the specific condo
    }
  };


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- Render logic ---
  if (appScreen === 'home') return <HomePage onNavigateToLogin={navigateToLogin} />;
  if (appScreen === 'login') return <LoginPage onLogin={handleLogin} onNavigateToHome={navigateToHome} loginError={loginError} isLoading={isLoginLoading} />;

  if (appScreen === 'authenticatedApp' && isAuthenticated && loggedInUser) {
    let headerSelectedAdminCompanyName: string | null = null;
    let headerSelectedCondominiumName: string | null = null;

    if (userRole === 'superAdmin' && selectedAdminCompany) {
        headerSelectedAdminCompanyName = selectedAdminCompany.name;
        if (selectedCondominium) {
            headerSelectedCondominiumName = selectedCondominium.name;
        }
    } else if (userRole === 'condoAdminCompany' && selectedCondominium) {
         // loggedInUser should be CondoAdminCompanyInfo
        headerSelectedAdminCompanyName = (loggedInUser as CondoAdminCompanyInfo).name;
        headerSelectedCondominiumName = selectedCondominium.name;
    }


    return (
      <div className="min-h-screen flex flex-col">
        <Header 
            isAuthenticated={isAuthenticated}
            user={loggedInUser}
            userRole={userRole}
            onLogout={handleLogout}
            authenticatedAppView={authenticatedAppView}
            selectedAdminCompanyName={headerSelectedAdminCompanyName}
            selectedCondominiumName={headerSelectedCondominiumName}
        />
        <div className="flex flex-1 pt-16"> 
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={toggleSidebar}
                userRole={userRole}
                currentView={authenticatedAppView}
                navigateToSuperAdminManagement={handleNavigateToSuperAdminManagement}
                navigateToCondominiumManagement={handleNavigateToCondominiumManagement}
                navigateToDashboardView={handleNavigateToDashboardView}
                navigateToReportsView={handleNavigateToReportsView}
                navigateToClientDetailsView={selectedCondominium ? handleNavigateToClientDetailsView : undefined}
                isAdminCompanySelectedBySuperAdmin={!!(userRole === 'superAdmin' && selectedAdminCompany)}
                isCondominiumSelected={!!selectedCondominium}
            />
            <main 
              className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out"
              style={{ marginLeft: isSidebarOpen ? '16rem' : '4.5rem' }} 
            >
              {/* Super Admin Management View */}
              {userRole === 'superAdmin' && authenticatedAppView === 'superAdminManagement' && (
                <SuperAdminManagement onViewCondominiumsForAdminCompany={handleSelectAdminCompanyFromSuperAdmin} />
              )}
              
              {/* Condominium (Client) Management View - For CondoAdminCompany or SuperAdmin with selected AdminCompany */}
              {((userRole === 'condoAdminCompany') || 
                (userRole === 'superAdmin' && selectedAdminCompany)) && 
                authenticatedAppView === 'condominiumManagement' && (
                <CondominiumManagement
                  managingCompanyContext={userRole === 'condoAdminCompany' ? (loggedInUser as CondoAdminCompanyInfo) : selectedAdminCompany!}
                  onViewCondominiumDashboard={handleSelectCondominium}
                  onManageCondominiumDetails={handleManageCondominiumDetails}
                  titleOverride={userRole === 'condoAdminCompany' ? `Meus Condomínios (${(loggedInUser as CondoAdminCompanyInfo).name})`: undefined}
                />
              )}

              {/* Client (Condominium) Details Management Page */}
              {selectedCondominium && authenticatedAppView === 'clientDetails' && (userRole === 'condoAdminCompany' || userRole === 'superAdmin') && (
                <ClientDetailsManagementPage
                  initialClientData={selectedCondominium}
                  onUpdateClientDetails={handleUpdateCondominiumDetails}
                  onBackToList={handleBackToCondominiumManagement} // Go back to the list of condominiums
                />
              )}

              {/* Condominium Dashboard View */}
              {selectedCondominium && authenticatedAppView === 'dashboard' && (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                      {(userRole === 'superAdmin' || userRole === 'condoAdminCompany') && ( 
                        <Button onClick={handleBackToCondominiumManagement} variant="ghost" size="sm" leftIcon={<ArrowLeftIcon />} className="mb-2 sm:mb-0 hidden sm:flex">
                            Voltar para Lista de Condomínios
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
                  {dashboardError && <Card className="mb-6 bg-red-50 border border-red-200"><p className="text-red-700 font-medium">{dashboardError}</p></Card>}
                  <DashboardMetrics metrics={metrics} loading={isLoadingDashboardData && !metrics} />
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="Tendência de Consumo Mensal (Últimos 30 dias)" className="lg:col-span-2">
                      {isLoadingDashboardData && !monthlyTrend.length ? <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div> : 
                        <ConsumptionChart data={monthlyTrend} yAxisLabel="Consumo (m³)" tooltipValueSuffix=" m³" tooltipLegendName="Consumo" seriesName="Consumo Mensal"/>}
                    </Card>
                    <GeminiAnalysisCard metrics={metrics} />
                  </div>
                  <div className="mt-6">
                     <Card title="Dados Ambientais (Temperatura e Umidade)">
                        <EnvironmentDataChart data={environmentData} isLoading={isLoadingDashboardData && !environmentData.length && !environmentDataError} error={environmentDataError}/>
                     </Card>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PumpStatusCard pumpStatus={pumpStatus} isLoading={isLoadingDashboardData && !pumpStatus} onTogglePump={handleTogglePump} isTogglingPump={isTogglingPump}/>
                    <TankLevelCard tankLevel={tankLevel} isLoading={isLoadingDashboardData && !tankLevel} />
                    <TankLocationMapCard tankLocation={tankLocation} isLoading={isLoadingDashboardData && !tankLocation}/>
                  </div>
                  <div className="mt-6">
                      <Card title="Consumo por Unidade (Mês Atual)">
                          {isLoadingDashboardData && !unitBreakdown.length ? <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div> : <UnitBreakdownChart data={unitBreakdown} title="Consumo por Unidade" />}
                      </Card>
                  </div>
                </>
              )}

              {/* Condominium Reports View */}
              {selectedCondominium && authenticatedAppView === 'reports' && (
                <ReportsPage selectedCondominium={selectedCondominium} userRole={userRole} />
              )}
              
              {/* Fallback for admin roles if no selection is made for views requiring selection */}
              {(userRole === 'superAdmin' || userRole === 'condoAdminCompany') && !selectedCondominium && 
                (authenticatedAppView === 'dashboard' || authenticatedAppView === 'reports' || authenticatedAppView === 'clientDetails') && (
                 <div className="text-center py-10">
                    <p className="text-xl text-gray-600">Nenhum condomínio selecionado.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {userRole === 'superAdmin' && !selectedAdminCompany ? "Primeiro, selecione uma Administradora de Condomínios." : "Selecione um condomínio para ver esta página."}
                    </p>
                    <Button 
                        onClick={userRole === 'superAdmin' && !selectedAdminCompany ? handleNavigateToSuperAdminManagement : handleNavigateToCondominiumManagement} 
                        variant="primary" 
                        className="mt-4">
                      Ir para Gerenciamento
                    </Button>
                  </div>
              )}
               {userRole === 'superAdmin' && !selectedAdminCompany && authenticatedAppView === 'condominiumManagement' && (
                 <div className="text-center py-10">
                    <p className="text-xl text-gray-600">Nenhuma Administradora de Condomínios selecionada.</p>
                    <Button onClick={handleNavigateToSuperAdminManagement} variant="primary" className="mt-4">
                      Gerenciar Administradoras
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
