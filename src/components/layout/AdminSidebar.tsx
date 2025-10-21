"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/adminSlice';
import {
  LayoutDashboard,
  Users,
  Package,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { sidebarCollapsed, admin, theme } = useSelector((state: RootState) => state.admin);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      permission: 'dashboard:view',
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: 'users:view',
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: Package,
      permission: 'orders:view',
    },
    {
      title: 'KYC Applications',
      href: '/admin/kyc',
      icon: FileCheck,
      permission: 'kyc:view',
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      permission: 'analytics:view',
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'settings:view',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const canAccess = (permission: string) => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissions.includes(permission);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-border-default dark:border-gray-700 transition-all duration-300 z-50 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </span>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          if (!canAccess(item.permission)) return null;
          
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-lighter text-primary dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {!sidebarCollapsed && admin && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {admin.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {admin.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
