import { httpClient } from "@/consts/http";
import { RunwayConditionCreateRequest, RunwayConditionCreateResponse } from "@/types/runway-condition";
import { AxiosRequestConfig } from "axios";

export async function createRunwayCondition(
  payload: RunwayConditionCreateRequest,
  headers?: AxiosRequestConfig
) {
  const res = await httpClient.private.post<RunwayConditionCreateResponse>(
    "/runwayCondition/create",
    { ...payload },
    { ...headers }
  );
  return res.data;
} 