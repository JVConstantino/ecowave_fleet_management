
import { 
    WaterConsumptionRecord, 
    ChartDataPoint, 
    OverallMetrics, 
    CondominiumInfo, 
    PumpStatus, 
    TankLevel, 
    TankLocation, 
    TankLevelRecord, 
    PressureRecord, 
    PumpEnergyRecord, 
    ContactInfo, 
    ContractDetails, 
    MqttConfig, 
    SupportInfo,
    CondoAdminCompanyInfo, // New import
    SuperAdminUserInfo // New import
} from '../types';
import { MOCK_SUPER_ADMIN_EMAIL, MOCK_CONDO_ADMIN_COMPANY_EMAIL_1 } from '../constants'; // Import new emails

const DEFAULT_PRICE_PER_M3 = 5.75; // R$ 5,75 / m³
const DEFAULT_PRICE_PER_KWH = 0.75; // R$ 0,75 / KWh

// --- Default Object Creators ---
const getDefaultContactInfo = (): ContactInfo => ({
    primaryContactName: '', primaryContactEmail: '', primaryContactPhone: '',
    secondaryContactName: '', secondaryContactEmail: '', secondaryContactPhone: ''
});

const getDefaultContractDetails = (): ContractDetails => ({
    contractId: '', startDate: '', endDate: '', serviceLevel: 'standard', notes: ''
});

const getDefaultMqttConfig = (condoId: string): MqttConfig => ({
    brokerUrl: 'mqtt://test.mosquitto.org:1883', username: '', password: '',
    waterConsumptionTopic: `clients/${condoId}/water/consumption/total`,
    tankLevelSuperiorTopic: `clients/${condoId}/tank/superior/level`,
    tankLevelInferiorTopic: `clients/${condoId}/tank/inferior/level`,
    pumpStatusTopic: `clients/${condoId}/pump/main/status`,
    pressureConcessionaireTopic: `clients/${condoId}/pressure/concessionaire`,
    pressureInternalTopic: `clients/${condoId}/pressure/internal`,
    topicNotes: "Use {clientId} placeholder if configuring a template. This client ID is static."
});

const getDefaultSupportInfo = (): SupportInfo => ({
    supportTier: 'silver', dedicatedSupportAgentName: '', lastSupportTicketId: '', internalSupportNotes: ''
});

// --- Mock Data ---

// Super Admin User
const MOCK_SUPER_ADMINS: SuperAdminUserInfo[] = [
    { id: 'super-001', name: 'Super Administrador Global', email: MOCK_SUPER_ADMIN_EMAIL, type: 'superAdmin' }
];

// Condo Administrator Companies
const MOCK_CONDO_ADMIN_COMPANIES: CondoAdminCompanyInfo[] = [
    { 
        id: 'admincomp-001', 
        name: 'Gestão de Águas Inteligentes Ltda.', 
        adminUserEmail: MOCK_CONDO_ADMIN_COMPANY_EMAIL_1, // Updated Login for this company
        responsiblePerson: 'Carlos Pereira',
        companyRegistrationNumber: '11.222.333/0001-44'
    },
    { 
        id: 'admincomp-002', 
        name: 'EcoSíndicos Profissionais S.A.', 
        adminUserEmail: 'admincomp2@example.com', // Login for this company
        responsiblePerson: 'Mariana Costa',
        companyRegistrationNumber: '55.666.777/0001-88'
    },
    {
        id: 'admincomp-legacy',
        name: 'Administradora Legada (JV)',
        adminUserEmail: 'joaovictor.priv@gmail.com', // Old admin email
        responsiblePerson: 'João Victor (Legado)',
        companyRegistrationNumber: '99.999.999/0001-99'
    }
];

// Condominiums (Clients managed by CondoAdminCompanies)
const MOCK_CONDOMINIUMS: CondominiumInfo[] = [
    { 
        id: 'condominio01@gmail.com', // Updated ID for login: condominio01@gmail.com / 123456 (using MOCK_CONDO_PASSWORD)
        name: 'Residencial Águas Claras (ID: condominio01@gmail.com)', // Name updated for clarity 
        managingCompanyId: 'admincomp-001', // Managed by Gestão de Águas Inteligentes
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), 
        pricePerM3: 5.50, 
        pricePerKWh: 0.78,
        contactInfo: { primaryContactName: 'Síndico João Silva', primaryContactEmail: 'sindico.ac@email.com', primaryContactPhone: '(11) 98765-4321' },
        contractDetails: { contractId: 'CTR-AC-001', startDate: '2023-01-15', endDate: '2025-01-14', serviceLevel: 'premium', notes: 'Cliente fundador, atenção especial.' },
        mqttConfig: getDefaultMqttConfig('condominio01@gmail.com'),
        supportInfo: { supportTier: 'gold', dedicatedSupportAgentName: 'Ana Pereira', lastSupportTicketId: 'SUP-987', internalSupportNotes: 'Renovação de contrato em breve.' }
    },
    { 
        id: 'condo-789', 
        name: 'Condomínio Sol Nascente', 
        managingCompanyId: 'admincomp-001', // Managed by Gestão de Águas Inteligentes
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), 
        pricePerM3: 6.00, 
        pricePerKWh: 0.72,
        contactInfo: { primaryContactName: 'Gerente Maria Oliveira', primaryContactEmail: 'gerencia.sn@email.com', primaryContactPhone: '(21) 91234-5678' },
        contractDetails: { contractId: 'CTR-SN-002', startDate: '2023-06-01', serviceLevel: 'standard', notes: 'Solicitou treinamento adicional para equipe local.'},
        mqttConfig: getDefaultMqttConfig('condo-789'),
        supportInfo: { supportTier: 'silver', internalSupportNotes: 'Cliente satisfeito com os relatórios.' }
    },
    { 
        id: 'condo-abc', 
        name: 'Edifício Vista Verde', 
        managingCompanyId: 'admincomp-002', // Managed by EcoSíndicos
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), 
        pricePerM3: 5.25, 
        pricePerKWh: 0.80,
        contactInfo: getDefaultContactInfo(),
        contractDetails: getDefaultContractDetails(),
        mqttConfig: getDefaultMqttConfig('condo-abc'),
        supportInfo: getDefaultSupportInfo(),
    },
     { 
        id: 'condo-legacy-1', 
        name: 'Condomínio Antigo Principal', 
        managingCompanyId: 'admincomp-legacy', // Managed by Administradora Legada (JV)
        registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), 
        pricePerM3: 5.00, 
        pricePerKWh: 0.70,
        contactInfo: { primaryContactName: 'Síndico Legado', primaryContactEmail: 'sindico.legacy@email.com', primaryContactPhone: '(11) 99999-0000' },
        contractDetails: getDefaultContractDetails(),
        mqttConfig: getDefaultMqttConfig('condo-legacy-1'),
        supportInfo: getDefaultSupportInfo(),
    },
];


const generateMockDataForCondo = (condominiumId: string, numDays: number, pricePerM3: number): WaterConsumptionRecord[] => {
  const records: WaterConsumptionRecord[] = [];
  const today = new Date();
  const baseConsumption = Math.random() * 0.3 + 0.1; 
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i); 
    
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

let ALL_MOCK_DATA: WaterConsumptionRecord[] = MOCK_CONDOMINIUMS.reduce((acc, company) => {
    return acc.concat(generateMockDataForCondo(company.id, 60, company.pricePerM3));
}, [] as WaterConsumptionRecord[]);


let MOCK_TANK_LEVEL_HISTORY: TankLevelRecord[] = [];

const generateMockTankLevelHistory = (condominiumId: string, tankType: 'superior' | 'inferior', numRecords: number = 720, daysToCover: number = 30) => {
    const records: TankLevelRecord[] = [];
    const now = Date.now();
    const intervalMs = (daysToCover * 24 * 60 * 60 * 1000) / numRecords;
    let baseLevel = tankType === 'superior' ? (40 + Math.random() * 30) : (60 + Math.random() * 20); 

    for (let i = 0; i < numRecords; i++) {
        const recordDate = new Date(now - (numRecords - 1 - i) * intervalMs);
        if (tankType === 'superior') {
            baseLevel += (Math.random() * 10 - 6); 
            if (baseLevel < 15 && Math.random() < 0.2) baseLevel += 30 + Math.random() * 20; 
        } else { 
            baseLevel += (Math.random() * 6 - 3); 
            if (baseLevel > 85 && Math.random() < 0.1) baseLevel -= 20 + Math.random() * 10; 
            if (baseLevel < 30 && Math.random() < 0.15) baseLevel += 25 + Math.random() * 15; 
        }
        baseLevel = Math.max(0, Math.min(100, baseLevel));

        records.push({
            id: `tlr-${condominiumId}-${tankType}-${recordDate.getTime()}-${i}`,
            condominiumId: condominiumId,
            tankType: tankType,
            date: recordDate.toISOString(),
            levelPercentage: parseFloat(baseLevel.toFixed(1)),
        });
    }
    MOCK_TANK_LEVEL_HISTORY.push(...records);
};

MOCK_CONDOMINIUMS.forEach(company => {
    generateMockTankLevelHistory(company.id, 'superior');
    generateMockTankLevelHistory(company.id, 'inferior');
});

let MOCK_CONCESSIONAIRE_NETWORK_PRESSURE_HISTORY: PressureRecord[] = [];
let MOCK_INTERNAL_NETWORK_PRESSURE_HISTORY: PressureRecord[] = [];

const generateMockPressureHistory = (condominiumId: string, type: 'concessionaire' | 'internal', numRecords: number = 288, daysToCover: number = 30) => {
    const records: PressureRecord[] = [];
    const now = Date.now();
    const intervalMs = (daysToCover * 24 * 60 * 60 * 1000) / numRecords;
    let basePressure = type === 'concessionaire' ? (35 + Math.random() * 10) : (45 + Math.random() * 10); // PSI

    for (let i = 0; i < numRecords; i++) {
        const recordDate = new Date(now - (numRecords - 1 - i) * intervalMs);
        if (type === 'concessionaire') {
            basePressure += (Math.random() * 4 - 2); 
            if (Math.random() < 0.05) basePressure -= Math.random() * 5; 
        } else { 
            basePressure += (Math.random() * 8 - 4); 
            if (Math.random() < 0.1) basePressure += Math.random() * 10; 
        }
        basePressure = Math.max(10, Math.min(80, basePressure));

        records.push({
            id: `pr-${condominiumId}-${type}-${recordDate.getTime()}-${i}`,
            condominiumId: condominiumId,
            date: recordDate.toISOString(),
            pressurePSI: parseFloat(basePressure.toFixed(1)),
        });
    }
    if (type === 'concessionaire') MOCK_CONCESSIONAIRE_NETWORK_PRESSURE_HISTORY.push(...records);
    else MOCK_INTERNAL_NETWORK_PRESSURE_HISTORY.push(...records);
};

let MOCK_PUMP_ENERGY_HISTORY: PumpEnergyRecord[] = [];

const generateMockPumpEnergyHistory = (condominiumId: string, pricePerKWh: number, numRecords: number = 720, daysToCover: number = 30) => {
    const records: PumpEnergyRecord[] = [];
    const now = Date.now();
    const intervalMs = (daysToCover * 24 * 60 * 60 * 1000) / numRecords; 

    for (let i = 0; i < numRecords; i++) {
        const recordDate = new Date(now - (numRecords - 1 - i) * intervalMs);
        let energyKWh = 0;
        
        const hour = recordDate.getHours();
        if (hour > 6 && hour < 22 && Math.random() < 0.3) { 
            energyKWh = parseFloat((0.5 + Math.random() * 1.5).toFixed(2)); 
        } else if (Math.random() < 0.05) { 
             energyKWh = parseFloat((0.3 + Math.random() * 0.7).toFixed(2));
        }
        
        records.push({
            id: `per-${condominiumId}-${recordDate.getTime()}-${i}`,
            condominiumId: condominiumId,
            date: recordDate.toISOString(),
            energyKWh: energyKWh,
            cost: parseFloat((energyKWh * pricePerKWh).toFixed(2)),
        });
    }
    MOCK_PUMP_ENERGY_HISTORY.push(...records);
};

MOCK_CONDOMINIUMS.forEach(company => {
    generateMockPressureHistory(company.id, 'concessionaire');
    generateMockPressureHistory(company.id, 'internal');
    generateMockPumpEnergyHistory(company.id, company.pricePerKWh);
});


let MOCK_PUMP_STATUSES: PumpStatus[] = MOCK_CONDOMINIUMS.map(company => ({
  condominiumId: company.id,
  pressurePSI: Math.floor(Math.random() * 30) + 30, 
  isActive: Math.random() > 0.5,
  lastChanged: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
}));

let MOCK_TANK_LEVELS: TankLevel[] = MOCK_CONDOMINIUMS.map(company => ({
  condominiumId: company.id,
  levelPercentage: Math.floor(Math.random() * 70) + 30, 
  lastUpdated: new Date(Date.now() - Math.random() * 1000 * 60 * 30).toISOString(), 
}));

const MOCK_TANK_LOCATIONS: TankLocation[] = MOCK_CONDOMINIUMS.map((company, index) => ({
  condominiumId: company.id,
  latitude: -23.550520 + (Math.random() - 0.5) * 0.01 * (index +1), 
  longitude: -46.633308 + (Math.random() - 0.5) * 0.01 * (index+1),
  address: `Rua Fictícia, ${100 + index * 50}, Bairro ${company.name.split(' ')[0]}, Cidade Exemplo`,
}));

// --- New Service Functions for 3-Tier System ---

export const authenticateSuperAdmin = async (email: string): Promise<SuperAdminUserInfo | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_SUPER_ADMINS.find(sa => sa.email === email);
};

export const authenticateCondoAdminCompany = async (email: string): Promise<CondoAdminCompanyInfo | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CONDO_ADMIN_COMPANIES.find(cac => cac.adminUserEmail === email);
};

// For SuperAdmin to list all Condo Admin Companies
export const getCondoAdminCompanies = async (): Promise<CondoAdminCompanyInfo[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_CONDO_ADMIN_COMPANIES].sort((a, b) => a.name.localeCompare(b.name));
};

export const addCondoAdminCompany = async (name: string, adminEmail: string, responsiblePerson?: string): Promise<CondoAdminCompanyInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!name.trim() || !adminEmail.trim()) {
        throw new Error("Nome da administradora e email do administrador são obrigatórios.");
    }
    if (MOCK_CONDO_ADMIN_COMPANIES.some(c => c.adminUserEmail === adminEmail)) {
        throw new Error("Já existe uma administradora com este email.");
    }
    const newAdminCompany: CondoAdminCompanyInfo = {
        id: `admincomp-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        name: name.trim(),
        adminUserEmail: adminEmail.trim(),
        responsiblePerson: responsiblePerson?.trim(),
        companyRegistrationNumber: `XX.XXX.XXX/0001-XX (Novo)`
    };
    MOCK_CONDO_ADMIN_COMPANIES.push(newAdminCompany);
    return { ...newAdminCompany };
};


// For CondoAdminCompany to list condominiums they manage, or for SuperAdmin to list condos of a selected AdminCompany
export const getCondominiumsByManagingCompanyId = async (managingCompanyId: string): Promise<CondominiumInfo[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CONDOMINIUMS.filter(condo => condo.managingCompanyId === managingCompanyId)
                           .sort((a,b) => a.name.localeCompare(b.name));
};

// For individual CondominiumUser login (Síndico)
export const getCondominiumById = async (condominiumId: string): Promise<CondominiumInfo | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100)); 
    const condo = MOCK_CONDOMINIUMS.find(c => c.id === condominiumId);
    return condo ? { ...condo } : undefined;
};

// Add a new Condominium (Client) and associate it with a CondoAdminCompany
export const addCondominiumClient = async (name: string, managingCompanyId: string): Promise<CondominiumInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (!name.trim()) {
        throw new Error("O nome do condomínio não pode estar vazio.");
    }
    if (!MOCK_CONDO_ADMIN_COMPANIES.find(c => c.id === managingCompanyId)) {
        throw new Error("Administradora de condomínio inválida.");
    }

    const newCondoId = `condo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newCondo: CondominiumInfo = {
        id: newCondoId,
        name: name.trim(),
        managingCompanyId: managingCompanyId,
        registrationDate: new Date().toISOString(),
        pricePerM3: DEFAULT_PRICE_PER_M3, 
        pricePerKWh: DEFAULT_PRICE_PER_KWH,
        contactInfo: getDefaultContactInfo(),
        contractDetails: getDefaultContractDetails(),
        mqttConfig: getDefaultMqttConfig(newCondoId),
        supportInfo: getDefaultSupportInfo(),
    };
    MOCK_CONDOMINIUMS.push(newCondo);
    // Initialize mock data for the new condominium
    ALL_MOCK_DATA.push(...generateMockDataForCondo(newCondo.id, 60, newCondo.pricePerM3));
    initializeNewCondominiumMockData(newCondo.id, newCondo.name, newCondo.pricePerM3, newCondo.pricePerKWh); 
    return { ...newCondo };
};


const initializeNewCondominiumMockData = (condoId: string, condoName: string, pricePerM3: number, pricePerKWh: number) => {
    MOCK_PUMP_STATUSES.push({
        condominiumId: condoId,
        pressurePSI: Math.floor(Math.random() * 30) + 30,
        isActive: Math.random() > 0.5,
        lastChanged: new Date().toISOString(),
    });
    MOCK_TANK_LEVELS.push({
        condominiumId: condoId,
        levelPercentage: Math.floor(Math.random() * 70) + 30,
        lastUpdated: new Date().toISOString(),
    });
    MOCK_TANK_LOCATIONS.push({
        condominiumId: condoId,
        latitude: -23.550520 + (Math.random() - 0.5) * 0.01 * (MOCK_CONDOMINIUMS.length),
        longitude: -46.633308 + (Math.random() - 0.5) * 0.01 * (MOCK_CONDOMINIUMS.length),
        address: `Rua Nova, ${100 + MOCK_CONDOMINIUMS.length * 50}, Bairro ${condoName.split(' ')[0]}, Cidade Exemplo`,
    });
    generateMockTankLevelHistory(condoId, 'superior'); 
    generateMockTankLevelHistory(condoId, 'inferior');
    generateMockPressureHistory(condoId, 'concessionaire');
    generateMockPressureHistory(condoId, 'internal');
    generateMockPumpEnergyHistory(condoId, pricePerKWh);
};

// --- Existing Service Functions (may need adaptation or can be used as is) ---

export const updateCompanyDetails = async (companyId: string, updatedDetails: Partial<CondominiumInfo>): Promise<CondominiumInfo> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const companyIndex = MOCK_CONDOMINIUMS.findIndex(c => c.id === companyId);
    if (companyIndex === -1) {
        throw new Error("Condomínio não encontrado para atualização.");
    }
    const currentCompany = MOCK_CONDOMINIUMS[companyIndex];
    const newDetails = {
        ...currentCompany,
        ...updatedDetails,
        contactInfo: updatedDetails.contactInfo ? { ...currentCompany.contactInfo, ...updatedDetails.contactInfo } : currentCompany.contactInfo,
        contractDetails: updatedDetails.contractDetails ? { ...currentCompany.contractDetails, ...updatedDetails.contractDetails } : currentCompany.contractDetails,
        mqttConfig: updatedDetails.mqttConfig ? { ...currentCompany.mqttConfig, ...updatedDetails.mqttConfig } : currentCompany.mqttConfig,
        supportInfo: updatedDetails.supportInfo ? { ...currentCompany.supportInfo, ...updatedDetails.supportInfo } : currentCompany.supportInfo,
    };

    MOCK_CONDOMINIUMS[companyIndex] = newDetails;
    return { ...MOCK_CONDOMINIUMS[companyIndex] };
};


export const getMonthlyConsumptionTrend = async (condoId: string): Promise<ChartDataPoint[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); 
  const condoSpecificData = ALL_MOCK_DATA.filter(r => r.condominiumId === condoId);

  const aggregatedByDay: { [key: string]: number } = {};
  const relevantData = condoSpecificData.filter(record => {
    const recordDate = new Date(record.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recordDate >= thirtyDaysAgo;
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
    
    const effectiveDaysForAverage = daysInCurrentMonthData.size > 0 ? daysInCurrentMonthData.size : (new Date(currentYear, currentMonth + 1, 0).getDate());
    const averageDailyCurrentMonth = totalCurrentMonth / Math.max(1, effectiveDaysForAverage);


    let comparisonPercentage = 0;
    if (totalPreviousMonth > 0) {
        comparisonPercentage = ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
    } else if (totalCurrentMonth > 0) {
        comparisonPercentage = 100; 
    }

    const company = MOCK_CONDOMINIUMS.find(c => c.id === condoId);
    const pricePerM3 = company ? company.pricePerM3 : DEFAULT_PRICE_PER_M3;
    
    const estimatedCurrentMonthWaterBill = totalCurrentMonth * pricePerM3;

    let estimatedCurrentMonthPumpEnergyCost = 0;
    const currentMonthPumpRecords = MOCK_PUMP_ENERGY_HISTORY.filter(r => {
        const recordDate = new Date(r.date);
        return r.condominiumId === condoId &&
               recordDate.getMonth() === currentMonth &&
               recordDate.getFullYear() === currentYear;
    });
    currentMonthPumpRecords.forEach(r => {
        estimatedCurrentMonthPumpEnergyCost += r.cost;
    });

    return {
        totalCurrentMonth: parseFloat(totalCurrentMonth.toFixed(2)),
        totalPreviousMonth: parseFloat(totalPreviousMonth.toFixed(2)),
        averageDailyCurrentMonth: parseFloat(averageDailyCurrentMonth.toFixed(2)),
        activeUnits: currentMonthUnits.size,
        comparisonPercentage: parseFloat(comparisonPercentage.toFixed(1)),
        estimatedCurrentMonthWaterBill: parseFloat(estimatedCurrentMonthWaterBill.toFixed(2)),
        estimatedCurrentMonthPumpEnergyCost: parseFloat(estimatedCurrentMonthPumpEnergyCost.toFixed(2)),
    };
};


export const getPumpStatus = async (condoId: string): Promise<PumpStatus> => {
    await new Promise(resolve => setTimeout(resolve, 250)); 
    const status = MOCK_PUMP_STATUSES.find(p => p.condominiumId === condoId);
    if (!status) {
        const newStatus = {
            condominiumId: condoId,
            pressurePSI: 40,
            isActive: false,
            lastChanged: new Date().toISOString(),
        };
        MOCK_PUMP_STATUSES.push(newStatus);
        return newStatus;
    }
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
    const newLevelPercentage = level.levelPercentage + (Math.random() * 2 - 1); 
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
    await new Promise(resolve => setTimeout(resolve, 600)); 
    const statusIndex = MOCK_PUMP_STATUSES.findIndex(p => p.condominiumId === condoId);
    if (statusIndex === -1) {
        throw new Error("Status da bomba não encontrado para este cliente.");
    }
    
    MOCK_PUMP_STATUSES[statusIndex] = {
        ...MOCK_PUMP_STATUSES[statusIndex],
        isActive: isActive,
        lastChanged: new Date().toISOString(),
        pressurePSI: isActive ? (Math.floor(Math.random() * 15) + 40) : (Math.floor(Math.random() * 10) + 5) 
    };
    return { ...MOCK_PUMP_STATUSES[statusIndex] };
};


const formatChartData = (records: {date: string, value: number}[], maxPoints = 300): ChartDataPoint[] => {
    
    records.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (records.length > maxPoints) {
        records = records.slice(-maxPoints);
    }

    return records.map(record => ({
        name: new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        value: record.value,
        fullDate: record.date, 
    }));
}


export const getTankLevelHistory = async (condoId: string, tankType: 'superior' | 'inferior', startDate?: string, endDate?: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    let filteredHistory = MOCK_TANK_LEVEL_HISTORY.filter(r => r.condominiumId === condoId && r.tankType === tankType);

    if (startDate) {
        const start = new Date(startDate).getTime();
        filteredHistory = filteredHistory.filter(r => new Date(r.date).getTime() >= start);
    }
    if (endDate) {
        const end = new Date(endDate).getTime();
        filteredHistory = filteredHistory.filter(r => new Date(r.date).getTime() <= end);
    }
    
    return formatChartData(filteredHistory.map(r => ({date: r.date, value: r.levelPercentage})));
};

export const getConcessionairePressureHistory = async (condoId: string, startDate?: string, endDate?: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let filteredHistory = MOCK_CONCESSIONAIRE_NETWORK_PRESSURE_HISTORY.filter(r => r.condominiumId === condoId);
    
    return formatChartData(filteredHistory.map(r => ({date: r.date, value: r.pressurePSI})));
};

export const getInternalPressureHistory = async (condoId: string, startDate?: string, endDate?: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 420));
    let filteredHistory = MOCK_INTERNAL_NETWORK_PRESSURE_HISTORY.filter(r => r.condominiumId === condoId);
    
    return formatChartData(filteredHistory.map(r => ({date: r.date, value: r.pressurePSI})));
};

export const getPumpEnergyHistory = async (condoId: string, dataType: 'kwh' | 'cost', startDate?: string, endDate?: string): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 480));
    let filteredHistory = MOCK_PUMP_ENERGY_HISTORY.filter(r => r.condominiumId === condoId);
    
    const mappedData = filteredHistory.map(r => ({
        date: r.date,
        value: dataType === 'kwh' ? r.energyKWh : r.cost
    }));
    return formatChartData(mappedData);
};


export const getFinancialSummary = async (
    condoId: string, 
    period: 'last3Months' | 'last6Months' | 'last12Months' = 'last6Months'
): Promise<ChartDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 550));
    
    const condoSpecificData = ALL_MOCK_DATA.filter(r => r.condominiumId === condoId);
    const monthlyCosts: { [key: string]: number } = {}; 

    const today = new Date();
    let monthsToConsider = 0;
    if (period === 'last3Months') monthsToConsider = 3;
    else if (period === 'last6Months') monthsToConsider = 6;
    else if (period === 'last12Months') monthsToConsider = 12;

    for (let i = 0; i < monthsToConsider; i++) {
        const targetDate = new Date(today);
        targetDate.setMonth(today.getMonth() - i);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); 
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        monthlyCosts[monthKey] = 0; 
    }
    
    condoSpecificData.forEach(record => {
        const recordDate = new Date(record.date);
        const year = recordDate.getFullYear();
        const month = recordDate.getMonth(); 
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
                fullDateSort: monthKey 
            }
        })
        .sort((a, b) => a.fullDateSort.localeCompare(b.fullDateSort)) 
        .map(({name, value}) => ({name, value})); 
};

// Legacy getCompanies, now effectively getCondominiumsByManagingCompanyId if managingCompanyId is provided.
// Or, if used without a managingCompanyId (e.g. by a superAdmin to see ALL condos, not typical for this function's original intent)
// This function needs to be re-evaluated in the context of App.tsx logic.
// For now, this is a placeholder. The App.tsx will call more specific functions.
export const getCompanies = async (): Promise<CondominiumInfo[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    return [...MOCK_CONDOMINIUMS].sort((a, b) => (a.name > b.name ? 1 : -1));
};

// Legacy addCompany, now effectively addCondominiumClient if managingCompanyId is provided.
// This function needs to be re-evaluated. App.tsx will call more specific functions.
export const addCompany = async (name: string): Promise<CondominiumInfo> => {
    // This is a simplified version. The new addCondominiumClient should be used with a managingCompanyId.
    // For now, let's assume it adds to a default or first admin company for legacy compatibility if called directly.
    const defaultManagingCompanyId = MOCK_CONDO_ADMIN_COMPANIES[0]?.id || 'admincomp-error';
    return addCondominiumClient(name, defaultManagingCompanyId);
};
