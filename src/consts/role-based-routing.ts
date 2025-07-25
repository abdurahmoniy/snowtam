export enum ROLES {
  SUPER_ADMIN = "SUPER_ADMIN",
  WORKER = "WORKER",
  SPECIALIST = "SPECIALIST",
  SAI = "SAI",
  ADMIN = "ADMIN",
  DISPETCHER = "DISPETCHER",
}

export const superAdminAccess = [
  // "/",
  "/airports",
  "/users",
  "/profile",
];

export const adminAccess = ["/users", "/profile"];

export const userAccess = ["/", "/profile", "/runway-condition", "/home"];

export const workerAccess = ["/", "/profile", "/runway-condition", "/home"];
export const saiAccess = ["/", "/profile", "/home"];

export function accessibleUrls(role: ROLES) {
  switch (role) {
    case ROLES.SUPER_ADMIN: {
      return superAdminAccess;
    }
    case ROLES.WORKER: {
      return workerAccess;
    }

    case ROLES.SAI: {
      return saiAccess;
    }

    case ROLES.ADMIN: {
      return adminAccess;
    }

    default: {
      return ["/"];
    }
  }
}
