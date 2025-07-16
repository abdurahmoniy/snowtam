


import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";
import { IDevice } from "@/types/device";

export async function getAllNotificationData() {
  const res =
    await httpClient.private.get<MainResponse<IDevice[]>>("/notification/getAllNotificationByMe");
  return res.data;
}
