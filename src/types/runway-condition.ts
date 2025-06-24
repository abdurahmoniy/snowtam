export interface RunwayConditionCreateRequest {
  airportCode: string;
  runwayDesignation: string;
  reportDateTime: string; // ISO string
  ambientTemperature: number;
  initials: string;
  rwycCode: string;
  overallConditionCode: number;
  remarks: string;
}

export interface RunwayConditionCreateResponse {
  status: string;
  message: string;
  data: any; // Adjust if you know the response shape
} 