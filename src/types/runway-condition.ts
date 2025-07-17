import { NotificationType, ProcedureType } from "@/consts/data";

export type contaminationCoverage =
  | "LESS_THAN_10_PERCENT"
  | "BETWEEN_10_AND_25_PERCENT"
  | "MORE_THAN_25_PERCENT";

export type surfaceCondition = "DRY" | "WET" | "ICE" | "SNOW";

export interface RunwayConditionCreateRequest {
  deviceForImprovement: string;
  runwayDesignation: string;
  runwayThirds: RunwayThird[];
  situationalNotifications: {
    runwayConditionId: number;
    notificationType: NotificationType;
    runwayLengthReductionM: number | null;
    additionalDetails: string;
  }[];
  improvementProcedures: ImprovementProcedure[];
  runwayId?: number;
  deviceId: number;
  initialName: string;
  position: string;
  temperature: number;
  [key: string]: any;
}

// {
//   deviceForImprovement: string;
//   runwayDesignation: string;
//   reportDateTime: string;
//   ambientTemperature: number;
//   initials: string;
//   rwycCode: string;
//   overallConditionCode: number;
//   remarks: string;
//   rurunwayThirds: RunwayThird[];
//   situationalNotification: {
//     runwayConditionId: number;
//     notificationType: string;
//     runwayLengthReductionM: number;
//     isActive: boolean;
//     additionalDetails: string;
//   }[];
//   improvementProcedure: ImprovementProcedure[];
// }

export interface RunwayThird {
  partNumber: number;
  surfaceCondition: surfaceCondition;
  depthMm: number;
  frictionCoefficient: number;
  rwycValue: number;
  temperatureCelsius: number;
  coveragePercentage: number;
}

export interface ContaminationDetail {}

export interface SituationalNotification {
  REDUCED_RUNWAY_LENGTH: number;
  SNOW_BANK_NEAR_RUNWAY: number;
  SAND_ON_RUNWAY: number;
  DEBRIS_ON_RUNWAY: number;
  POOR_RUNWAY_CONDITION: number;
  OTHER: number;
  [key: string]: number;
}

export interface ImprovementProcedure {
  runwayConditionId?: number;
  procedureType: ProcedureType | null;
  applicationTime: string | null;
}

export interface RunwayConditionCreateResponse {
  status: string;
  message: string;
  data: {
    id: number;
    ambientTemperature: number;
    finalRCR: string;
    finalRCRru: string;
    runwayThirds: {
      id: number;
      runwayConditionId: number;
      partNumber: number;
      surfaceCondition: string;
      depthMm: number;
      frictionCoefficient: number;
      coveragePercentage: number;
      rwycValue: number;
      createdAt: string;
      updatedAt: string;
    }[];
    situationalNotifications: {
      id: number;
      runwayConditionId: number;
      notificationType: NotificationType;
      runwayLengthReductionM: number;
      additionalDetails: string;
      createdAt: string;
      updatedAt: string;
    }[];
    improvementProcedures: {
      id: number;
      runwayConditionId: number;
      procedureType: ProcedureType;
      applicationTime: string;
      createdAt: string;
      updatedAt: string;
    }[];
    applicationStatus: string;
    createdBy: {
      email: string;
      fullname: string;
      status: string;
      position: string;
      airportDto: {
        id: number;
        name: string;
        initialName: string;
        airportCode: string;
        temperature: number;
        longitude: null;
        latitude: null;
        createdAt: string;
        updatedAt: string;
        runwayDtos: {
          id: number;
          name: string;
          longitude: string | null;
          latitude: string | null;
          length: number | null;
          width: number;
          runwayDesignation: string;
          airportDto: null;
          createdAt: string;
          updatedAt: string;
        }[];
      };
      role: string[];
    };
    deviceDto: {
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    runwayDto: {
      id: number;
      name: string;
      longitude: string;
      latitude: string;
      length: null;
      width: number;
      runwayDesignation: string;
      airportDto: {
        id: number;
        name: string;
        initialName: string;
        airportCode: string;
        temperature: number;
        longitude: null;
        latitude: null;
        createdAt: string;
        updatedAt: string;
        runwayDtos: {
          id: number;
          name: string;
          longitude: string;
          latitude: string;
          length: null | number;
          width: number;
          runwayDesignation: string;
          airportDto: null;
          createdAt: string;
          updatedAt: string;
        }[];
      };
      createdAt: string;
      updatedAt: string;
    };
    initialName: null;
    position: null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RunwayCondition {
  id: number;
  airportCode: null;
  runwayDesignation: string;
  reportDateTime: null;
  ambientTemperature: null;
  initials: null;
  rwycCode: null;
  overallConditionCode: null;
  remarks: null;
  deviceForImprovement: null | number;
  finalRCR: string;
  finalRCRru: string;
  runwayThirds: {
    id: number;
    runwayConditionId: number;
    partNumber: number;
    contaminationCoverage: null;
    surfaceCondition: surfaceCondition;
    depthMm: number;
    frictionCoefficient: number;
    coveragePercentage: string | null;
    rwycValue: number;
    temperatureCelsius: null;
    contaminationDetails: [];
    createdAt: string;
    updatedAt: string;
  }[];
  situationalNotifications: {
    id: number;
    runwayConditionId: number;
    notificationType: NotificationType;
    runwayLengthReductionM: number;
    isActive: null;
    additionalDetails: null;
    createdAt: string;
    updatedAt: string;
  }[];
  improvementProcedures: {
    id: number;
    runwayConditionId: number;
    procedureType: ProcedureType;
    applicationTime: string;
    isApplied: null;
    effectivenessRating: null;
    createdAt: string;
    updatedAt: string;
  }[];
  deviceDto: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  runwayDto: {
    id: number;
    name: string;
    longitude: string;
    latitude: string;
    length: null;
    width: number;
    runwayDesignation: string;
    airportDto: {
      id: number;
      name: string;
      initialName: string;
      airportCode: string;
      temperature: number;
      longitude: string;
      latitude: string;
      createdAt: string;
      updatedAt: string;
      runwayDtos: {
        id: number;
        name: string;
        longitude: string;
        latitude: string;
        length: null;
        width: number;
        runwayDesignation: string;
        airportDto: null;
        createdAt: string;
        updatedAt: string;
      }[];
    };
    createdAt: string;
    updatedAt: string;
  };
  initialName: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}
