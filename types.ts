
export interface WaterConsumptionRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  unitId?: string; 
  condominiumId: string;
  consumption: number; // in m³
  cost: number; // Calculated: consumption * pricePerM3
}

export interface CondominiumInfo {
  id: string;
  name: string;
  registrationDate?: string; // Optional: can be added later
  pricePerM3: number; // Price per cubic meter for this condominium
}

export interface ChartDataPoint {
  name: string; 
  value: number;
  [key: string]: any; // For additional properties like fill color for bars
}

export interface OverallMetrics {
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  averageDailyCurrentMonth: number;
  activeUnits: number;
  comparisonPercentage: number;
}

export interface WaterDataForGemini {
    currentMonthTotal: number;
    previousMonthTotal: number;
    averageDaily: number;
    // Keep recentReadings simple for the prompt for now
}

// New types for authentication
export type UserRole = 'admin' | 'condominium' | null;

export interface AdminUserInfo {
  id: string; // Typically 'admin' or a specific admin user ID
  name: string; // e.g., "Administrator"
  type: 'admin';
}

export type AuthenticatedUser = CondominiumInfo | AdminUserInfo | null;

// --- New Types for Extended Dashboard Features ---

export interface PumpStatus {
  condominiumId: string;
  pressurePSI: number; // Pump pressure in PSI
  isActive: boolean; // True if pump is active, false otherwise
  lastChanged: string; // ISO date string of when the pump state last changed
}

export interface TankLevel {
  condominiumId: string;
  levelPercentage: number; // Water level in percentage (0-100)
  lastUpdated: string; // ISO date string of last update
}

export interface TankLocation {
  condominiumId: string;
  latitude: number;
  longitude: number;
  address: string; // Mock address
}

// Combined type for new dashboard data fetched together (optional, can manage separately too)
export interface ExtendedCondominiumData {
  pumpStatus: PumpStatus | null;
  tankLevel: TankLevel | null;
  tankLocation: TankLocation | null;
}

// --- New Types for Reports Section ---
export interface TankLevelRecord {
  id: string; // Unique ID for the record
  condominiumId: string;
  date: string; // ISO String for specific timestamp e.g. YYYY-MM-DDTHH:mm:ss.sssZ
  levelPercentage: number; // 0-100
}

// FinancialDataPoint can use ChartDataPoint structure: name = month/year, value = cost
