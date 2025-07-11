import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";
import { IDevice } from "@/types/device";
import { IResponse } from "@/types/http";

export async function getAllDevices() {
  const res =
    await httpClient.private.get<MainResponse<IDevice[]>>("/device/getAll");
  return res.data;
}
