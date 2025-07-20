import { ROLES } from "@/consts/role-based-routing";

export interface IRole {
  id: number;
  name: ROLES;
  createdAt: string;
}
