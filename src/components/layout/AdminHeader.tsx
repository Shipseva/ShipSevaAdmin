"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/adminSlice';
import { useAdminLogoutMutation } from '@/store/api/authApi';
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  Users,
  Package,
  FileCheck,
} from 'lucide-react';

const AdminHeader: React.FC = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { admin } = useSelector((state: RootState) => state.admin);
  const [adminLogout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Order Management', href: '/admin/orders', icon: Package },
    { name: 'KYC Management', href: '/admin/kyc', icon: FileCheck },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await adminLogout(void 0).unwrap();
      // API call successful, dispatch logout to clear local state
      dispatch(logout());
    } catch (error) {
      console.error('Logout API failed:', error);
      // Even if API fails, clear local state and redirect
      dispatch(logout());
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ShipSeva</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative rounded-md transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            {admin ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {admin.name}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email || admin.role?.replace('_', ' ')}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-light transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
