import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";
import { RunwayCondition, RunwayConditionCreateRequest, RunwayConditionCreateResponse } from "@/types/runway-condition";
import { AxiosRequestConfig } from "axios";

export async function createRunwayCondition(
  payload: RunwayConditionCreateRequest,
  headers?: AxiosRequestConfig
) {
  const res = await httpClient.private.post<RunwayConditionCreateResponse>(
    "/runwayCondition/createAll",
    { ...payload },
    { ...headers }
  );
  return res.data;
} 

export async function GetAllRunWayCondition({
  page, size
}:{
  page: number;
  size: number;
}){
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));

  const res = await httpClient.private.get<MainResponse<RunwayCondition[]>>(
    `/runwayCondition/getAll?${searchParams.toString()}`
  );
  return res.data;

}