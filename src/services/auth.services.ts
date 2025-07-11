import { httpClient } from "@/consts/http";
import { LoginRequest, LoginResponse, MainResponse, RegisterRequest, SignUpRequest } from "@/types/auth";
import { IUser } from "@/types/user.auth";
import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export async function SignUp(
    payload: SignUpRequest,
    headers?: AxiosRequestConfig
) {
    const res = await httpClient.private.post<RegisterRequest>(
        "/auths/registerByEmail",
        {...payload},
        {...headers}
    );
    return res.data;
}

export async function Login(
    payload: LoginRequest,
    headers?: AxiosRequestConfig
) {
    const res = await httpClient.private.post<LoginResponse>(
        "/auths/loginByEmail",
         {...payload},
         {...headers}
    );
    return res.data;
}


export async function getMe(headers?: AxiosRequestConfig) {
    const res = await httpClient.private.get<MainResponse<IUser>>("/users/getMe", { ...headers });
    return res.data;
}