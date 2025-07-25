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
  page, size, applicationStatus
}:{
  page: number;
  size: number;
  applicationStatus?: string;
}){
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));
  applicationStatus && searchParams.set("applicationStatus", String(applicationStatus));

  const res = await httpClient.private.get<MainResponse<RunwayCondition[]>>(
    `/runwayCondition/getAll?${searchParams.toString()}`
  );
  return res.data;
}


export async function GetAllRunWayConditionByPeriod({
  page, size, from, to, query
}:{
  page: number;
  size: number;
  from: string;
  to: string;
  query: string;
}){
  const searchParams = new URLSearchParams();
  page && searchParams.set("page", String(page));
  size && searchParams.set("size", String(size));
  from && searchParams.set("from", String(from));
  to && searchParams.set("to", String(to));
  query && searchParams.set("query", String(query));

  const res = await httpClient.private.get<MainResponse<RunwayCondition[]>>(
    `/runwayCondition/getAllByPeriod?${searchParams.toString()}`
  );
  return res.data;

}



export async function GetRunWayConditionById({
  id
}:{
  id: string;
}){
  const searchParams = new URLSearchParams();
  id && searchParams.set("id", String(id));


  const res = await httpClient.private.get<MainResponse<RunwayCondition>>(
    `/runwayCondition/getById?${searchParams.toString()}`
  );
  return res.data;

}



export async function AcceptRunWayConditionById({
  id
}:{
  id: number;
}){
  const searchParams = new URLSearchParams();
  id && searchParams.set("id", String(id));


  const res = await httpClient.private.put<MainResponse<RunwayCondition>>(
    `/runwayCondition/acceptRunwayCondition?${searchParams.toString()}`
  );
  return res.data;
}



export async function DeclineRunWayConditionById({
  id
}:{
  id: number;
}){
  const searchParams = new URLSearchParams();
  id && searchParams.set("id", String(id));


  const res = await httpClient.private.put<MainResponse<RunwayCondition>>(
    `/runwayCondition/declineRunwayCondition?${searchParams.toString()}`
  );
  return res.data;

}



export async function SendRunWayConditionById({
  id
}:{
  id: number;
}){
  const searchParams = new URLSearchParams();
  id && searchParams.set("id", String(id));


  const res = await httpClient.private.put<MainResponse<RunwayCondition>>(
    `/runwayCondition/sendRunwayCondition?${searchParams.toString()}`
  );
  return res.data;
}

