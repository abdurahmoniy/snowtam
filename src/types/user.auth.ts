export interface IUser {
  id: string;
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
    longitude: null | number;
    latitude: null | number;
    createdAt: string;
    updatedAt: string;
    runwayDtos: IUserRunway[];
  };
  role: string[];
}

export interface IUserRunway {
  id: number;
  name: string;
  longitude: string | null;
  latitude: string | null;
  length: null | number;
  width: number;
  runwayDesignation: string;
  airportDto: null;
  createdAt: string;
  updatedAt: string;
}
