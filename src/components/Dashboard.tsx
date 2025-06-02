
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Calendar, Pill } from 'lucide-react';

interface DashboardStats {
  totalMedicines: number;
  totalStores: number;
  totalSupplies: number;
  expiringMedicines: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    totalStores: 0,
    totalSupplies: 0,
    expiringMedicines: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'supply', description: 'Paracetamol supplied to City Pharmacy', date: '2024-01-15', quantity: 100 },
    { id: 2, type: 'medicine', description: 'New medicine Amoxicillin added', date: '2024-01-14', company: 'PharmaCorp' },
    { id: 3, type: 'store', description: 'Health Plus Store registered', date: '2024-01-13', location: 'Downtown' },
    { id: 4, type: 'supply', description: 'Ibuprofen supplied to Metro Medical', date: '2024-01-12', quantity: 50 }
  ]);

  useEffect(() => {
    // Simulate API call for dashboard stats
    setTimeout(() => {
      setStats({
        totalMedicines: 156,
        totalStores: 24,
        totalSupplies: 389,
        expiringMedicines: 12
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Pill className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedicines}</div>
            <p className="text-xs text-blue-100">Registered in database</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Stores</CardTitle>
            <Database className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-green-100">Active store locations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supply Records</CardTitle>
            <Plus className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSupplies}</div>
            <p className="text-xs text-purple-100">Total transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringMedicines}</div>
            <p className="text-xs text-red-100">Medicines within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-700">Recent Activity</CardTitle>
          <CardDescription>Latest updates in the pharmaceutical database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'supply' ? 'bg-purple-500' :
                    activity.type === 'medicine' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    activity.type === 'supply' ? 'default' :
                    activity.type === 'medicine' ? 'secondary' : 'outline'
                  }>
                    {activity.type === 'supply' ? 'Supply' :
                     activity.type === 'medicine' ? 'Medicine' : 'Store'}
                  </Badge>
                  {activity.quantity && (
                    <span className="text-xs text-gray-500">Qty: {activity.quantity}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Pill className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <CardTitle className="text-blue-700">Add Medicine</CardTitle>
            <CardDescription>Register new pharmaceutical products</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Database className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <CardTitle className="text-green-700">Add Store</CardTitle>
            <CardDescription>Register new medical store locations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Plus className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <CardTitle className="text-purple-700">Record Supply</CardTitle>
            <CardDescription>Log medicine supply transactions</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
