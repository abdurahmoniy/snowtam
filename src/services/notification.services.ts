


import { httpClient } from "@/consts/http";
import { MainResponse } from "@/types/auth";
import { IDevice } from "@/types/device";
import { INotification } from "@/types/notification.services";

export async function getAllNotificationData() {
  const res =
    await httpClient.private.get<MainResponse<INotification[]>>("/notification/getAllNotificationByMe");
  return res.data;
}




export async function MarkAsReadNotification({notificationId}: {notificationId: string}) {
  const res =
    await httpClient.private.put<MainResponse<INotification[]>>(`/notification/markAsRead?notificationId=${notificationId}`);
  return res.data;
}
