export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "individual" | "agency";
  status: "active" | "inactive" | "banned";
  kycStatus: "pending" | "approved" | "rejected" | "not_submitted";
  createdAt: string;
  lastLoginAt?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  newThisMonth: number;
  kycPending: number;
  kycApproved: number;
  kycRejected: number;
}
