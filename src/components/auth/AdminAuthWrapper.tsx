"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setAuthChecked, setAdmin } from '@/store/slices/adminSlice';
import { getAdminUser, getAdminToken, removeAdminAuthData } from '@/lib/auth';
import { useGetAdminProfileQuery } from '@/store/api/authApi';
import { AdminUser } from '@/types/admin';

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
  const dispatch = useDispatch();
  const { isAuthenticated, hasCheckedAuth, admin } = useSelector((state: RootState) => state.admin);
  const [mounted, setMounted] = useState(false);

  // Check for existing auth data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAdminToken();
      const user = getAdminUser();
      
      if (token && user) {
        dispatch(setAdmin({ admin: user, token }));
      } else {
        // Clear any invalid auth data
        removeAdminAuthData();
      }
      
      dispatch(setAuthChecked());
      setMounted(true);
    };

    checkAuth();
  }, [dispatch]);

  // Handle authentication requirements
  useEffect(() => {
    if (!mounted || !hasCheckedAuth) return;

    if (requireAuth && !isAuthenticated) {
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
  }, [mounted, hasCheckedAuth, isAuthenticated, admin, requiredRole, requiredPermission, router]);

  // Show loading while checking auth
  if (!mounted || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if requirements not met
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isAuthenticated && admin) {
    if (requiredRole && admin.role !== requiredRole && admin.role !== 'super_admin') {
      return null; // Will redirect to unauthorized
    }

    if (requiredPermission && !admin.permissions.includes(requiredPermission) && admin.role !== 'super_admin') {
      return null; // Will redirect to unauthorized
    }
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
