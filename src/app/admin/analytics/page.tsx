"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - replace with actual API data
  const overviewStats = [
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "New Users",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Orders Completed",
      value: "2,456",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Users",
      value: "3,789",
      change: "+5.7%",
      changeType: "positive" as const,
      icon: Activity,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const chartData = [
    { name: "Jan", revenue: 4000, users: 2400, orders: 1800 },
    { name: "Feb", revenue: 3000, users: 1398, orders: 1200 },
    { name: "Mar", revenue: 2000, users: 9800, orders: 1000 },
    { name: "Apr", revenue: 2780, users: 3908, orders: 1500 },
    { name: "May", revenue: 1890, users: 4800, orders: 2000 },
    { name: "Jun", revenue: 2390, users: 3800, orders: 1800 },
  ];

  const topUsers = [
    { name: "John Smith", email: "john@example.com", orders: 45, revenue: "$2,340" },
    { name: "Sarah Johnson", email: "sarah@example.com", orders: 38, revenue: "$1,890" },
    { name: "Mike Wilson", email: "mike@example.com", orders: 32, revenue: "$1,560" },
    { name: "Emily Davis", email: "emily@example.com", orders: 28, revenue: "$1,340" },
  ];

  const recentActivity = [
    { action: "New user registered", user: "John Smith", time: "2 minutes ago", type: "user" },
    { action: "Order completed", user: "Sarah Johnson", time: "5 minutes ago", type: "order" },
    { action: "KYC approved", user: "Mike Wilson", time: "10 minutes ago", type: "kyc" },
    { action: "Payment received", user: "Emily Davis", time: "15 minutes ago", type: "payment" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "order":
        return <Package className="w-4 h-4 text-green-500" />;
      case "kyc":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your platform performance</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <ArrowUp className="w-4 h-4 text-success mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-error mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center text-sm text-gray-500">
                <BarChart3 className="w-4 h-4 mr-1" />
                Monthly trends
              </div>
            </div>
            
            {/* Chart placeholder - replace with actual chart component */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Users</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                By revenue
              </div>
            </div>

            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{user.revenue}</p>
                    <p className="text-sm text-gray-500">{user.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Activity className="w-4 h-4 mr-1" />
              Live updates
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span> by {activity.user}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
