"use client";

import React from 'react';
import AdminHeader from './AdminHeader';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <main className="p-6">
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
          },
        }}
      />
    </div>
  );
};

export default AdminLayout;
