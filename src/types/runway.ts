export interface IRunway {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  length: number;
  width: number;
  runwayDesignation: string;
  airportId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRunwayCreateDto {
  name: string;
  longitude: string;
  latitude: string;
  length: number;
  width: number;
  runwayDesignation: string;
  airportId: number;
}

export interface IRunwayUpdateDto extends IRunwayCreateDto {
  id: number;
}
