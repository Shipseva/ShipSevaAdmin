export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminAuthResponse {
  user: AdminUser;
  token: string;
  refreshToken: string;
}

export interface AdminLoginRequest {
  identifier: string;
  password: string;
  queryType: string;
}

export interface AdminPermissions {
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    ban: boolean;
  };
  orders: {
    view: boolean;
    edit: boolean;
    cancel: boolean;
    analytics: boolean;
  };
  kyc: {
    view: boolean;
    approve: boolean;
    reject: boolean;
    resubmit: boolean;
  };
  analytics: {
    view: boolean;
    export: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
}
