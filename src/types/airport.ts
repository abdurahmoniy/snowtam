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
  runwayDtos: {
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
    }[
  ];
}
