
import { WaterConsumptionRecord, ChartDataPoint, OverallMetrics, CondominiumInfo, PumpStatus, TankLevel, TankLocation, TankLevelRecord } from '../types';

const DEFAULT_PRICE_PER_M3 = 5.75; // R$ 5,75 / m³

// Mock storage for client companies (condominiums)
const MOCK_COMPANIES: CondominiumInfo[] = [
    { id: 'condo-123', name: 'Residencial Águas Claras (Default)', registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), pricePerM3: 5.50 },
    { id: 'condo-789', name: 'Condomínio Sol Nascente', registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), pricePerM3: 6.00 },
    { id: 'condo-abc', name: 'Edifício Vista Verde', registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), pricePerM3: 5.25 },
];

const generateMockDataForCondo = (condominiumId: string, numDays: number, pricePerM3: number): WaterConsumptionRecord[] => {
  const records: WaterConsumptionRecord[] = [];
  const today = new Date();
  const baseConsumption = Math.random() * 0.3 + 0.1; // Base consumption varies per condo
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i); // Go back i days
    
    const numUnits = 2 + Math.floor(Math.random() * 3);
    for (let unitNum = 1; unitNum <= numUnits; unitNum++) {
        const consumption = parseFloat((baseConsumption + (Math.random() * 0.2 - 0.1) + (Math.sin(i / (7 + unitNum % 3) + unitNum) * 0.05)).toFixed(2));
        records.push({
            id: `record-${currentDate.toISOString().split('T')[0]}-condo-${condominiumId}-unit-${100+unitNum}`,
            date: currentDate.toISOString().split('T')[0],
            condominiumId: condominiumId,
            unitId: `Apto ${100+unitNum}`, 
            consumption: consumption,
            cost: parseFloat((consumption * pricePerM3).toFixed(2)),
        });
    }
  }
  return records.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 
};

const ALL_MOCK_DATA: WaterConsumptionRecord[] = MOCK_COMPANIES.reduce((acc, company) => {
    return acc.concat(generateMockDataForCondo(company.id, 60, company.pricePerM3));
}, [] as WaterConsumptionRecord[]);

// --- Mock Data for Tank Level History ---
let MOCK_TANK_LEVEL_HISTORY: TankLevelRecord[] = [];

const generateMockTankLevelHistory = (condominiumId: string, numRecords: number = 720, daysToCover: number = 30) => {
    const records: TankLevelRecord[] = [];
    const now = Date.now();
    const intervalMs = (daysToCover * 24 * 60 * 60 * 1000) / numRecords;
    let baseLevel = 50 + Math.random() * 30; // Base level between 50 and 80

    for (let i = 0; i < numRecords; i++) {
        const recordDate = new Date(now - (numRecords - 1 - i) * intervalMs);
        // Simulate level changes (e.g. usage drops, pump refills)
        baseLevel += (Math.random() * 10 - 5); // Fluctuate
        if (baseLevel < 10) baseLevel += 20 + Math.random() * 20; // Simulate pump refill
        if (baseLevel > 95) baseLevel -= 10 + Math.random() * 10; // Simulate usage
        baseLevel = Math.max(0, Math.min(100, baseLevel)); // Clamp between 0 and 100

        records.push({
            id: `tlr-${condominiumId}-${recordDate.getTime()}-${i}`,
            condominiumId: condominiumId,
            date: recordDate.toISOString(),
            levelPercentage: parseFloat(baseLevel.toFixed(1)),
        });
    }
    MOCK_TANK_LEVEL_HISTORY.push(...records);
};

MOCK_COMPANIES.forEach(company => generateMockTankLevelHistory(company.id));


// --- Mock Data for New Features ---
let MOCK_PUMP_STATUSES: PumpStatus[] = MOCK_COMPANIES.map(company => ({
  condominiumId: company.id,
  pressurePSI: Math.floor(Math.random() * 30) + 30, // 30-59 PSI
  isActive: Math.random() > 0.5,
  lastChanged: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
}));

let MOCK_TANK_LEVELS: TankLevel[] = MOCK_COMPANIES.map(company => ({
  condominiumId: company.id,
  levelPercentage: Math.floor(Math.random() * 70) + 30, // 30-99%
  lastUpdated: new Date(Date.now() - Math.random() * 1000 * 60 * 30).toISOString(), // Updated in last 30 mins
}));

const MOCK_TANK_LOCATIONS: TankLocation[] = MOCK_COMPANIES.map((company, index) => ({
  condominiumId: company.id,
  latitude: -23.550520 + (Math.random() - 0.5) * 0.01 * (index +1), // Around São Paulo
  longitude: -46.633308 + (Math.random() - 0.5) * 0.01 * (index+1),
  address: `Rua Fictícia, ${100 + index * 50}, Bairro ${company.name.split(' ')[0]}, Cidade Exemplo`,
}));

// Helper to add new company data to new mocks
const initializeNewCompanyMockData = (companyId: string, companyName: string) => {
    MOCK_PUMP_STATUSES.push({
        condominiumId: companyId,
        pressurePSI: Math.floor(Math.random() * 30) + 30,
        isActive: Math.random() > 0.5,
        lastChanged: new Date().toISOString(),
    });
    MOCK_TANK_LEVELS.push({
        condominiumId: companyId,
        levelPercentage: Math.floor(Math.random() * 70) + 30,
        lastUpdated: new Date().toISOString(),
    });
    MOCK_TANK_LOCATIONS.push({
        condominiumId: companyId,
        latitude: -23.550520 + (Math.random() - 0.5) * 0.01 * (MOCK_COMPANIES.length),
        longitude: -46.633308 + (Math.random() - 0.5) * 0.01 * (MOCK_COMPANIES.length),
        address: `Rua Nova, ${100 + MOCK_COMPANIES.length * 50}, Bairro ${companyName.split(' ')[0]}, Cidade Exemplo`,
    });
    generateMockTankLevelHistory(companyId); // Generate history for new company
};


export const getCompanies = async (): Promise<CondominiumInfo[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    return [...MOCK_COMPANIES].sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const getCompanyById = async (companyId: string): Promise<CondominiumInfo | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    return MOCK_COMPANIES.find(c => c.id === companyId);
}

export const addCompany = async (name: string): Promise<CondominiumInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (!name.trim()) {
        throw new Error("O nome do condomínio não pode estar vazio.");
    }
    const newCompany: CondominiumInfo = {
        id: `condo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        registrationDate: new Date().toISOString(),
        pricePerM3: DEFAULT_PRICE_PER_M3, // Assign default price
    };
    MOCK_COMPANIES.push(newCompany);
    ALL_MOCK_DATA.push(...generateMockDataForCondo(newCompany.id, 60, newCompany.pricePerM3));
    initializeNewCompanyMockData(newCompany.id, newCompany.name); 
    return newCompany;
};


export const getMonthlyConsumptionTrend = async (condoId: string): Promise<ChartDataPoint[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); 
  const condoSpecificData = ALL_MOCK_DATA.filter(r => r.condominiumId === condoId);

  const aggregatedByDay: { [key: string]: number } = {};
  // Consider 90 days of data for trend, display last 30 distinct days
  const relevantData = condoSpecificData.filter(record => {
    const recordDate = new Date(record.date);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return recordDate >= ninetyDaysAgo;
  });

  relevantData.forEach(record => {
    if (!aggregatedByDay[record.date]) {
      aggregatedByDay[record.date] = 0;
    }
    aggregatedByDay[record.date] += record.consumption;
  });
  
  return Object.entries(aggregatedByDay)
    .map(([date, totalConsumption]) => ({ 
      name: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'}), 
      value: parseFloat(totalConsumption.toFixed(2)),
      fullDate: date 
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-30) 
    .map(({name, value}) => ({name, value})); 
};

export const getUnitBreakdownCurrentMonth = async (condoId: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const currentMonthData = ALL_MOCK_DATA.filter(r => {
        const recordDate = new Date(r.date);
        return r.condominiumId === condoId && r.unitId &&
               recordDate.getMonth() === currentMonth &&
               recordDate.getFullYear() === currentYear;
    });

    const unitConsumption: { [key: string]: number } = {};
    currentMonthData.forEach(record => {
        if (!unitConsumption[record.unitId!]) {
            unitConsumption[record.unitId!] = 0;
        }
        unitConsumption[record.unitId!] += record.consumption;
    });

    return Object.entries(unitConsumption)
        .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
        .sort((a,b) => b.value - a.value); 
};

export const getOverallMetrics = async (condoId: string): Promise<OverallMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const previousMonthDate = new Date(today);
    previousMonthDate.setMonth(today.getMonth() - 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    let totalCurrentMonth = 0;
    const daysInCurrentMonthData = new Set<string>();
    const currentMonthUnits = new Set<string>();

    let totalPreviousMonth = 0;

    ALL_MOCK_DATA.forEach(r => {
        if (r.condominiumId !== condoId) return;
        const recordDate = new Date(r.date);
        
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
            totalCurrentMonth += r.consumption;
            daysInCurrentMonthData.add(r.date); 
            if(r.unitId) currentMonthUnits.add(r.unitId);
        } else if (recordDate.getMonth() === previousMonth && recordDate.getFullYear() === previousYear) {
            totalPreviousMonth += r.consumption;
        }
    });
    
    // Use number of days in the month up to today for average, if data exists.
    // Otherwise, use number of days with data. If no data, use 1 to avoid division by zero.
    const effectiveDaysForAverage = daysInCurrentMonthData.size > 0 ? daysInCurrentMonthData.size : (new Date(currentYear, currentMonth + 1, 0).getDate());
    const averageDailyCurrentMonth = totalCurrentMonth / Math.max(1, effectiveDaysForAverage);


    let comparisonPercentage = 0;
    if (totalPreviousMonth > 0) {
        comparisonPercentage = ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
    } else if (totalCurrentMonth > 0) {
        comparisonPercentage = 100; 
    }

    return {
        totalCurrentMonth: parseFloat(totalCurrentMonth.toFixed(2)),
        totalPreviousMonth: parseFloat(totalPreviousMonth.toFixed(2)),
        averageDailyCurrentMonth: parseFloat(averageDailyCurrentMonth.toFixed(2)),
        activeUnits: currentMonthUnits.size,
        comparisonPercentage: parseFloat(comparisonPercentage.toFixed(1))
    };
};

// --- New Service Functions for Extended Features ---

export const getPumpStatus = async (condoId: string): Promise<PumpStatus> => {
    await new Promise(resolve => setTimeout(resolve, 250)); // Simulate API delay
    const status = MOCK_PUMP_STATUSES.find(p => p.condominiumId === condoId);
    if (!status) {
        // Create a default if not found (e.g. for a newly added company not yet in mock)
        const newStatus = {
            condominiumId: condoId,
            pressurePSI: 40,
            isActive: false,
            lastChanged: new Date().toISOString(),
        };
        MOCK_PUMP_STATUSES.push(newStatus);
        return newStatus;
    }
    // Simulate some minor fluctuation if desired
    // status.pressurePSI = Math.max(20, Math.min(70, status.pressurePSI + (Math.random() * 4 - 2)));
    return { ...status };
};

export const getTankLevel = async (condoId: string): Promise<TankLevel> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const level = MOCK_TANK_LEVELS.find(l => l.condominiumId === condoId);
    if (!level) {
        const newLevel = {
            condominiumId: condoId,
            levelPercentage: 60,
            lastUpdated: new Date().toISOString(),
        };
        MOCK_TANK_LEVELS.push(newLevel);
        return newLevel;
    }
    // Simulate some minor fluctuation
    const newLevelPercentage = level.levelPercentage + (Math.random() * 10 - 5);
    level.levelPercentage = Math.max(0, Math.min(100, parseFloat(newLevelPercentage.toFixed(1))));
    level.lastUpdated = new Date().toISOString();
    return { ...level };
};

export const getTankLocation = async (condoId: string): Promise<TankLocation> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const location = MOCK_TANK_LOCATIONS.find(loc => loc.condominiumId === condoId);
    if (!location) {
         const newLocation = {
            condominiumId: condoId,
            latitude: -23.550,
            longitude: -46.633,
            address: 'Localização Padrão, Cidade Exemplo',
        };
        MOCK_TANK_LOCATIONS.push(newLocation);
        return newLocation;
    }
    return { ...location };
};

export const setPumpActiveState = async (condoId: string, isActive: boolean): Promise<PumpStatus> => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate action delay
    const statusIndex = MOCK_PUMP_STATUSES.findIndex(p => p.condominiumId === condoId);
    if (statusIndex === -1) {
        throw new Error("Status da bomba não encontrado para este condomínio.");
    }
    
    MOCK_PUMP_STATUSES[statusIndex] = {
        ...MOCK_PUMP_STATUSES[statusIndex],
        isActive: isActive,
        lastChanged: new Date().toISOString(),
        // Optionally adjust pressure based on state change
        pressurePSI: isActive ? (Math.floor(Math.random() * 15) + 40) : (Math.floor(Math.random() * 10) + 5) 
    };
    return { ...MOCK_PUMP_STATUSES[statusIndex] };
};

// --- Service Functions for Reports Section ---

export const getTankLevelHistory = async (condoId: string, startDate?: string, endDate?: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    let filteredHistory = MOCK_TANK_LEVEL_HISTORY.filter(r => r.condominiumId === condoId);

    if (startDate) {
        const start = new Date(startDate).getTime();
        filteredHistory = filteredHistory.filter(r => new Date(r.date).getTime() >= start);
    }
    if (endDate) {
        const end = new Date(endDate).getTime();
        filteredHistory = filteredHistory.filter(r => new Date(r.date).getTime() <= end);
    }
    
    // Sort by date ascending
    filteredHistory.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If too many points, consider downsampling or taking latest N points. For now, take up to 300 latest.
    const maxPoints = 300;
    if (filteredHistory.length > maxPoints) {
        filteredHistory = filteredHistory.slice(-maxPoints);
    }

    return filteredHistory.map(record => ({
        name: new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        value: record.levelPercentage,
        fullDate: record.date, // for potential detailed tooltips or sorting
    }));
};

export const getFinancialSummary = async (
    condoId: string, 
    period: 'last3Months' | 'last6Months' | 'last12Months' = 'last6Months'
): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 550));
    
    const condoSpecificData = ALL_MOCK_DATA.filter(r => r.condominiumId === condoId);
    const monthlyCosts: { [key: string]: number } = {}; // key: "YYYY-MM"

    const today = new Date();
    let monthsToConsider = 0;
    if (period === 'last3Months') monthsToConsider = 3;
    else if (period === 'last6Months') monthsToConsider = 6;
    else if (period === 'last12Months') monthsToConsider = 12;

    for (let i = 0; i < monthsToConsider; i++) {
        const targetDate = new Date(today);
        targetDate.setMonth(today.getMonth() - i);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); // 0-indexed
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        monthlyCosts[monthKey] = 0; // Initialize month
    }
    
    condoSpecificData.forEach(record => {
        const recordDate = new Date(record.date);
        const year = recordDate.getFullYear();
        const month = recordDate.getMonth(); // 0-indexed
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

        if (monthlyCosts.hasOwnProperty(monthKey)) {
            monthlyCosts[monthKey] += record.cost;
        }
    });

    return Object.entries(monthlyCosts)
        .map(([monthKey, totalCost]) => {
            const [year, monthNum] = monthKey.split('-');
            const dateFromName = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
            return {
                name: dateFromName.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                value: parseFloat(totalCost.toFixed(2)),
                fullDateSort: monthKey // For sorting
            }
        })
        .sort((a, b) => a.fullDateSort.localeCompare(b.fullDateSort)) // Sort chronologically
        .map(({name, value}) => ({name, value})); // Remove fullDateSort
};
