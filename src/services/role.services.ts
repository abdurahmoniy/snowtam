import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";
import { IRole } from "@/types/role";

export async function GetAllRoles() {
  const searchParams = new URLSearchParams();

  const res = await httpClient.private.get<MainResponse<IRole[]>>(
    `/role/getAll?${searchParams.toString()}`,
  );
  return res.data;
}
