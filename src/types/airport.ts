export interface IAirport {
  id: number;
  name: string;
  initialName: string;
  airportCode: string;
  temperature: number;
  longitude: string;
  latitude: string;
  createdAt: string;
  updatedAt: string;
  runwayDtos: IAirportRunaway[];
}

export default interface IAirportRunaway {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  length: null | number;
  width: number;
  runwayDesignation: null | string;
  airportDto: null;
  createdAt: string;
  updatedAt: string;
}

export interface IAirportCreateDto {
  name: string;
  initialName: string;
  airportCode: string;
  temperature: number;
  longitude: string;
  latitude: string;
}

export interface IAirportUpdateDto extends IAirportCreateDto {
  id: number;
}
