import { httpClient } from "@/consts/http";
import { IAirport } from "@/types/airport";
import { MainResponse } from "@/types/auth";



export async function GetAllAirports({
  page, size
}:{
  page: number;
  size: number;
}){
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));

  const res = await httpClient.private.get<MainResponse<IAirport[]>>(
    `/airport/getAll?${searchParams.toString()}`
  );
  return res.data;
}





export async function GetAllAirportsExtended({
  page, size
}:{
  page: number;
  size: number;
}){
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));

  const res = await httpClient.private.get<MainResponse<IAirport[]>>(
    `/airport/getAllExtended?${searchParams.toString()}`
  );
  return res.data;
}