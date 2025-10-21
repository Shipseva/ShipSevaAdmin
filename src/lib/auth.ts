import { AdminUser } from "@/types/admin";

// Save token and admin data to localStorage
export const setAdminAuthData = (token: string, admin: AdminUser) => {
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(admin));
};

// Get admin token
export const getAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
};

// Get admin user data
export const getAdminUser = (): AdminUser | null => {
  if (typeof window === "undefined") return null;
  const adminStr = localStorage.getItem("admin_user");
  return adminStr ? JSON.parse(adminStr) : null;
};

// Remove admin auth data
export const removeAdminAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};

// Check if admin is authenticated
export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken();
};

// Check if admin has specific role
export const hasAdminRole = (role: "super_admin" | "admin" | "moderator"): boolean => {
  const admin = getAdminUser();
  return admin?.role === role;
};

// Check if admin has specific permission
export const hasPermission = (permission: string): boolean => {
  const admin = getAdminUser();
  return admin?.permissions?.includes(permission) || false;
};

// Check if admin can access resource
export const canAccess = (resource: string, action: string): boolean => {
  const admin = getAdminUser();
  if (!admin) return false;
  
  // Super admin has all permissions
  if (admin.role === "super_admin") return true;
  
  // Check specific permission
  const permission = `${resource}:${action}`;
  return hasPermission(permission);
};
