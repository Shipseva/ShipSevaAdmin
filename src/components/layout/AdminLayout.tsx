"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar, setTheme } from '@/store/slices/adminSlice';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, theme } = useSelector((state: RootState) => state.admin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('admin_theme') as 'light' | 'dark';
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      />
    </div>
  );
};

export default AdminLayout;
