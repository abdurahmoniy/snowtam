// src/services/user.services.ts

import { httpClient } from "@/consts/http";
import type { IUser } from "@/types/user.auth";
import type { MainResponse } from "@/types/auth";

export type UserStatus = "ACTIVE" | "PENDING" | "TEMP" | "BANNED";

interface PaginationParams {
  page?: number;
  size?: number;
  userStatus?: UserStatus;
}

interface BanUserDto {
  userId: number;
}

interface AddRoleDto {
  userId: number;
  role: string;
}

interface DeleteRoleDto {
  userId: number;
  role: string;
}

interface DeleteUpdateUserDto {
  userId: number;
}

interface UpdateUserDto {
  id: number;
  email: string;
  fullname: string;
  status: string;
  password: string;
  position: string;
  airportId: number;
  role: string;
}

export async function GetAllUsers(params: PaginationParams) {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  if (params.userStatus) searchParams.set("userStatus", params.userStatus);

  const res = await httpClient.private.get<MainResponse<IUser[]>>(
    `/users/getAllUser?${searchParams.toString()}`,
  );
  return res.data;
}

export async function GetAllActiveUsers() {
  const res = await httpClient.private.get<MainResponse<IUser[]>>(
    "/users/getAllActiveUser",
  );
  return res.data;
}

export async function GetAllPendingUsers() {
  const res = await httpClient.private.get<MainResponse<IUser[]>>(
    "/users/getAllPendingUser",
  );
  return res.data;
}

export async function GetMe() {
  const res = await httpClient.private.get<MainResponse<IUser>>("/users/getMe");
  return res.data;
}

export async function BanUser(data: BanUserDto) {
  const searchParams = new URLSearchParams();
  searchParams.set("userId", String(data.userId));
  const res = await httpClient.private.post<MainResponse<void>>(
    `/users/banUser?${searchParams.toString()}`,
  );
  return res.data;
}

export async function AddRoleToUser(data: AddRoleDto) {
  const searchParams = new URLSearchParams();
  searchParams.set("userId", String(data.userId));
  searchParams.set("role", data.role);

  const res = await httpClient.private.post<MainResponse<void>>(
    `/users/addRoleToUser?${searchParams.toString()}`,
  );
  return res.data;
}

export async function DeleteRoleFromUser(data: DeleteRoleDto) {
  const res = await httpClient.private.delete<MainResponse<void>>(
    "/users/deleteRoleFromUser",
    { data },
  );
  return res.data;
}

export async function UpdateUser(data: UpdateUserDto) {
  const searchParams = new URLSearchParams();

  const res = await httpClient.private.put<MainResponse<IUser>>(
    `/users/updateUser?${searchParams.toString()}`,
    data
  );
  return res.data;
}
