// src/services/runway.services.ts

import { httpClient } from "@/consts/http";
import type { MainResponse } from "@/types/auth";
import type {
  IRunway,
  IRunwayCreateDto,
  IRunwayUpdateDto,
} from "@/types/runway";

interface GetAllParams {
  page: number;
  size: number;
  sort?: string[];
}

/**
 * GET /runway/getAll
 * query: page, size, sort
 */
export async function GetAllRunways({
  page,
  size,
  sort,
}: GetAllParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("size", String(size));
  if (sort) {
    sort.forEach((s) => searchParams.append("sort", s));
  }

  const res = await httpClient.private.get<MainResponse<IRunway[]>>(
    `/runway/getAll?${searchParams.toString()}`
  );
  return res.data;
}

/**
 * GET /runway/getById?id={id}
 */
export async function GetRunwayById(id: number) {
  const res = await httpClient.private.get<MainResponse<IRunway>>(
    `/runway/getById?id=${id}`
  );
  return res.data;
}

/**
 * POST /runway/create
 * body: IRunwayCreateDto
 */
export async function CreateRunway(data: IRunwayCreateDto) {
  const res = await httpClient.private.post<MainResponse<IRunway>>(
    `/runway/create`,
    data
  );
  return res.data;
}

/**
 * PUT /runway/update?id={id}
 * body: IRunwayUpdateDto without `id`
 */
export async function UpdateRunway(params: IRunwayUpdateDto) {
  const { id, ...body } = params;
  const res = await httpClient.private.put<MainResponse<IRunway>>(
    `/runway/update?id=${id}`,
    body
  );
  return res.data;
}

/**
 * DELETE /runway/delete?id={id}
 */
export async function DeleteRunway(id: number) {
  const res = await httpClient.private.delete<MainResponse<void>>(
    `/runway/delete?id=${id}`
  );
  return res.data;
}
