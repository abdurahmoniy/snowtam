import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IUser } from "@/types/user.auth";
import { MainResponse } from "@/types/auth";
import { getMe } from "@/services/auth.services";

export function useUserMe(
  options?: UseQueryOptions<MainResponse<IUser>>
) {
  return useQuery<MainResponse<IUser>>({
    queryFn: getMe,
    queryKey: ["user-me"],
    ...options,
  });
}
