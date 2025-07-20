export enum ROLES {
  SUPER_ADMIN = "SUPER_ADMIN",
  OPERATOR = "OPERATOR",
  SPECIALIST = "SPECIALIST",
  SAI = "SAI",
  ADMIN = "ADMIN",
  DISPETCHER = "DISPETCHER"
}

export const superAdminAccess = [
  // "/",
  "/airports",
  "/users",
  "/profile",
];

export const userAccess = ["/", "/profile", "/runway-condition"];

export const operatorAccess = ["/", "/profile", "/runway-condition"];

export function accessibleUrls(role: ROLES) {
  switch (role) {
    case ROLES.SUPER_ADMIN: {
      return superAdminAccess;
    }
    case ROLES.OPERATOR: {
      return operatorAccess;
    }

    default: {
      return ["/"];
    }
  }
}
