"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  Users,
  Package,
  FileCheck,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Ban,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { admin } = useSelector((state: RootState) => state.admin);

  const stats = [
    { 
      name: "Total Users", 
      value: "2,543", 
      change: "+12%", 
      changeType: "positive" as const, 
      icon: Users, 
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600" 
    },
    { 
      name: "Active Orders", 
      value: "1,234", 
      change: "+8%", 
      changeType: "positive" as const, 
      icon: Package, 
      bgColor: "bg-green-50", 
      iconColor: "text-green-600" 
    },
    { 
      name: "KYC Pending", 
      value: "89", 
      change: "-5%", 
      changeType: "negative" as const, 
      icon: FileCheck, 
      bgColor: "bg-yellow-50", 
      iconColor: "text-yellow-600" 
    },
    { 
      name: "Revenue", 
      value: "$45,678", 
      change: "+23%", 
      changeType: "positive" as const, 
      icon: DollarSign, 
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600" 
    },
  ];

  const recentUsers = [
    { id: "USR-001", name: "John Smith", email: "john@example.com", status: "Active", role: "Individual", date: "2024-01-15" },
    { id: "USR-002", name: "Sarah Johnson", email: "sarah@example.com", status: "Pending", role: "Agency", date: "2024-01-15" },
    { id: "USR-003", name: "Mike Wilson", email: "mike@example.com", status: "Banned", role: "Individual", date: "2024-01-14" },
    { id: "USR-004", name: "Emily Davis", email: "emily@example.com", status: "Active", role: "Agency", date: "2024-01-14" },
  ];

  const adminTools = [
    {
      name: "User Management",
      description: "View, edit, and manage platform users",
      href: "/admin/users",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Order Management",
      description: "Track and manage shipping orders",
      href: "/admin/orders",
      icon: Package,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "KYC Management",
      description: "Review and approve KYC applications",
      href: "/admin/kyc",
      icon: FileCheck,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      name: "Analytics",
      description: "View comprehensive analytics and reports",
      href: "/admin/analytics",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Settings",
      description: "Configure system settings and preferences",
      href: "/admin/settings",
      icon: Activity,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "banned":
        return "bg-error/10 text-error";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {admin?.name}! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`} />
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin Tools Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Admin Tools</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Quick access to admin features
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.name}
                    href={tool.href}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${tool.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <a
                href="/admin/users"
                className="text-primary hover:text-primary-light text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.role} • {user.date}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-warning transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Admin Actions</h3>
            <p className="text-white/90">Quick access to common admin tasks</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="/admin/users"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </a>
            <a
              href="/admin/kyc"
              className="bg-white text-primary hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Review KYC
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;