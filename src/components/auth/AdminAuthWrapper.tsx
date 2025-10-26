"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetCurrentUserQuery } from '@/store/api/userApi';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'super_admin' | 'admin' | 'moderator';
  requiredPermission?: string;
}

const AdminAuthWrapper: React.FC<AdminAuthWrapperProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermission,
}) => {
  const router = useRouter();
  const { isAuthenticated, admin } = useSelector((state: RootState) => state.admin);
  
  // Call getCurrentUser API - everything is handled in the API (success, error, redirect)
  const { isLoading } = useGetCurrentUserQuery();

  // Handle authentication requirements
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    if (isAuthenticated && admin) {
      // Check role requirement
      if (requiredRole && admin.role !== requiredRole && admin.role !== 'super_admin') {
        router.push('/admin/unauthorized');
        return;
      }

      // Check permission requirement
      if (requiredPermission && !admin.permissions.includes(requiredPermission) && admin.role !== 'super_admin') {
        router.push('/admin/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, admin, requiredRole, requiredPermission, router, requireAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and auth is required, don't render children (redirect will happen)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AdminAuthWrapper;
