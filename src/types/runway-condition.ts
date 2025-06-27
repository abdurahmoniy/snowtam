export interface RunwayConditionCreateRequest {
  airportCode: string;
  runwayDesignation: string;
  reportDateTime: string; // ISO string
  ambientTemperature: number;
  initials: string;
  rwycCode: string;
  overallConditionCode: number;
  remarks: string;
  runwayThirds: RunwayThird[];
  situationalNotifications: SituationalNotification[];
  improvementProcedures: ImprovementProcedure[];
}

export interface RunwayConditionCreateResponse {
  status: string;
  message: string;
  data: any; // Adjust if you know the response shape
} 

export interface RunwayCondition {
  id: number;
  airportCode: string;
  runwayDesignation: string;
  reportDateTime: string;
  ambientTemperature: number;
  initials: string;
  rwycCode: string;
  overallConditionCode: number;
  remarks: string;
  runwayThirds: RunwayThird[];
  situationalNotifications: SituationalNotification[];
  improvementProcedures: ImprovementProcedure[];
}

export interface RunwayThird {
  id: number;
  runwayConditionId: number;
  partNumber: number;
  contaminationCoverage: "LESS_THAN_10_PERCENT" | "10_TO_25_PERCENT" | "MORE_THAN_25_PERCENT"; // add more if needed
  surfaceCondition: "DRY" | "WET" | "SNOW" | string;
  depthMm: number;
  frictionCoefficient: number;
  rwycValue: number;
  temperatureCelsius: number;
  contaminationDetails: ContaminationDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ContaminationDetail {
  id: number;
  runwayThirdId: number;
  contaminationType: "STANDING_WATER" | "SLUSH" | "ICE" | string;
  depthMm: number;
  coveragePercentage: number;
  isPresent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SituationalNotification {
  id: number;
  runwayConditionId: number;
  notificationType: "REDUCED_RUNWAY_LENGTH" | "OBSTRUCTION" | string;
  runwayLengthReductionM: number;
  isActive: boolean;
  additionalDetails: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImprovementProcedure {
  id: number;
  runwayConditionId: number;
  procedureType: "MECHANICAL_CLEANING" | "CHEMICAL_TREATMENT" | string;
  applicationTime: string;
  isApplied: boolean;
  effectivenessRating: number;
  createdAt: string;
  updatedAt: string;
}
