
export interface WaterConsumptionRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  unitId?: string; 
  condominiumId: string;
  consumption: number; // in m³
  cost: number; // Calculated: consumption * pricePerM3
}

export interface ContactInfo {
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  secondaryContactName?: string;
  secondaryContactEmail?: string;
  secondaryContactPhone?: string;
}

export interface ContractDetails {
  contractId?: string;
  startDate?: string; // ISO Date string YYYY-MM-DD
  endDate?: string; // ISO Date string YYYY-MM-DD
  serviceLevel?: 'basic' | 'standard' | 'premium';
  notes?: string; // Multiline text
}

export interface MqttConfig {
  brokerUrl?: string;
  username?: string;
  password?: string; // Placeholder, actual secure storage/handling needed for real app
  waterConsumptionTopic?: string;
  tankLevelSuperiorTopic?: string;
  tankLevelInferiorTopic?: string;
  pumpStatusTopic?: string;
  pressureConcessionaireTopic?: string;
  pressureInternalTopic?: string;
  topicNotes?: string; // General notes about topic structure or wildcards
}

export interface SupportInfo {
  supportTier?: 'bronze' | 'silver' | 'gold';
  dedicatedSupportAgentName?: string;
  lastSupportTicketId?: string;
  internalSupportNotes?: string; // Multiline text for admin eyes
}

export interface CondominiumInfo { // Represents an individual condominium (managed by a CondoAdminCompany)
  id: string;
  name: string;
  registrationDate?: string; 
  pricePerM3: number; 
  pricePerKWh: number; 
  managingCompanyId?: string; // ID of the CondoAdminCompany that manages this condominium
  contactInfo?: ContactInfo;
  contractDetails?: ContractDetails;
  mqttConfig?: MqttConfig;
  supportInfo?: SupportInfo;
}

export interface CondoAdminCompanyInfo { // Represents the "Administradora de Condomínio"
  id: string;
  name: string;
  adminUserEmail: string; // Login email for this company's admin
  responsiblePerson?: string;
  companyRegistrationNumber?: string; // CNPJ, etc.
  // managedCondominiumIds: string[]; // This can be derived by filtering CondominiumInfo by managingCompanyId
}

export interface ChartDataPoint {
  name: string; // Typically time or category
  value?: number; // General value, used by ConsumptionChart
  temperature?: number; // For environment chart
  humidity?: number; // For environment chart
  [key: string]: any; 
}

export interface OverallMetrics {
  totalCurrentMonth: number; 
  totalPreviousMonth: number; 
  averageDailyCurrentMonth: number; 
  activeUnits: number;
  comparisonPercentage: number; 
  estimatedCurrentMonthWaterBill: number; 
  estimatedCurrentMonthPumpEnergyCost: number; 
}

export interface WaterDataForGemini {
    currentMonthTotal: number;
    previousMonthTotal: number;
    averageDaily: number;
}

// Updated UserRole to reflect the 3-tier structure
export type UserRole = 'superAdmin' | 'condoAdminCompany' | 'condominiumUser' | null;

export interface SuperAdminUserInfo { // Top-level admin
  id: string;
  name: string;
  email: string; // Login email
  type: 'superAdmin';
}

// AuthenticatedUser will be a union of all possible logged-in user types
export type AuthenticatedUser = SuperAdminUserInfo | CondoAdminCompanyInfo | CondominiumInfo | null;


export interface PumpStatus {
  condominiumId: string;
  pressurePSI: number; 
  isActive: boolean; 
  lastChanged: string; 
}

export interface TankLevel {
  condominiumId: string;
  levelPercentage: number; 
  lastUpdated: string; 
}

export interface TankLocation {
  condominiumId: string;
  latitude: number;
  longitude: number;
  address: string; 
}

export interface ExtendedCondominiumData {
  pumpStatus: PumpStatus | null;
  tankLevel: TankLevel | null;
  tankLocation: TankLocation | null;
}

export interface TankLevelRecord {
  id: string; 
  condominiumId: string;
  tankType: 'superior' | 'inferior';
  date: string; 
  levelPercentage: number; 
}

export interface PressureRecord {
  id: string;
  condominiumId: string;
  date: string; 
  pressurePSI: number;
}

export interface PumpEnergyRecord {
  id: string;
  condominiumId: string;
  date: string; 
  energyKWh: number;
  cost: number; 
}

// ThingSpeak API Types
export interface ThingSpeakChannel {
  id: number;
  name: string;
  field1: string; // Typically Temperature
  field2: string; // Typically Humidity
  // ... other channel properties
}

export interface ThingSpeakFeed {
  created_at: string; // ISO date string
  entry_id: number;
  field1: string | null; // Temperature value as string
  field2: string | null; // Humidity value as string
  // ... other fields up to field8
}

export interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}
