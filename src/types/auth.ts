import { UserData } from "next-auth/providers/42-school";
import { Session as NextAuthSession } from "next-auth";
import { IUser } from "@/consts/authOptions";

export interface LoggedUser {
  user: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  meta: LoggedUser;
  data: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  roleId: number;
  position: string;
  airportId: number;
}

export interface RegisterRequest {
  status: string;
  message: string;
}

export interface Session extends NextAuthSession {
  accessToken?: string;
}

export interface MainResponse<Data> {
  message: string;
  status: string;
  data: Data;
  pages: number;
  elements: number;
}
export interface MainResponseWithoutPagination<Data> {
  message: string;
  status: string;
  data: Data;
}
