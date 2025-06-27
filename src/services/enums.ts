import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";

export async function GetAlertTypes(){
    const res = await httpClient.private.get<MainResponse<string[]>>('/enums/getNotificationType');
    return res.data;
}

export async function GetProcedureTypes(){
    const res = await httpClient.private.get<MainResponse<string[]>>('/enums/getProcedureType');
    return res.data;
}

export async function GetSurfaceCondTypes(){
    const res = await httpClient.private.get<MainResponse<string[]>>('/enums/getSurfaceCondition');
    return res.data;
}

export async function GetContaminationTypes(){
    const res = await httpClient.private.get<MainResponse<string[]>>('/enums/getContaminationType');
    return res.data;
}

export async function GetContaminationCovTypes(){
    const res = await httpClient.private.get<MainResponse<string[]>>('/enums/getContaminationCoverageTypes');
    return res.data;
}