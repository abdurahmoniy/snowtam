import { httpClient } from "@/consts/http";
import {
  IAirport,
  IAirportCreateDto,
  IAirportUpdateDto,
} from "@/types/airport";
import { MainResponse } from "@/types/auth";

export async function CreateAirport(data: IAirportCreateDto) {
  const res = await httpClient.private.post<MainResponse<IAirport>>(
    `/airport/create`,
    data,
  );
  return res.data;
}

export async function UpdateAirport(params: IAirportUpdateDto) {
  const { id, ...body } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("id", String(id));

  const res = await httpClient.private.put<MainResponse<IAirport>>(
    `/airport/update?${searchParams.toString()}`,
    body,
  );
  return res.data;
}

export async function AttachUserToAirport(params: {
  airportId: number;
  userId: number;
}) {
  const searchParams = new URLSearchParams();
  searchParams.set("airportId", String(params.airportId));
  searchParams.set("userId", String(params.userId));

  const res = await httpClient.private.post<MainResponse<void>>(
    `/airport/attachUserToAirport?${searchParams.toString()}`,
  );
  return res.data;
}

export async function DeleteAirport(id: number) {
  const searchParams = new URLSearchParams();
  searchParams.set("id", String(id));

  const res = await httpClient.private.delete<MainResponse<void>>(
    `/airport/delete?${searchParams.toString()}`
  );
  return res.data;
}

export async function GetAllAirports({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));

  const res = await httpClient.private.get<MainResponse<IAirport[]>>(
    `/airport/getAll?${searchParams.toString()}`,
  );
  return res.data;
}

export async function GetAllAirportsExtended({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));

  const res = await httpClient.private.get<MainResponse<IAirport[]>>(
    `/airport/getAllExtended?${searchParams.toString()}`,
  );
  return res.data;
}
