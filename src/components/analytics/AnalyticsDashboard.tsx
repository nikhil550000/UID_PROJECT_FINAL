
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Package, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';

const AnalyticsDashboard = () => {
  // Mock data for charts
  const monthlySupplies = [
    { month: 'Jan', supplies: 45, value: 12000 },
    { month: 'Feb', supplies: 52, value: 15000 },
    { month: 'Mar', supplies: 48, value: 13500 },
    { month: 'Apr', supplies: 61, value: 18000 },
    { month: 'May', supplies: 55, value: 16000 },
    { month: 'Jun', supplies: 67, value: 19500 },
  ];

  const medicineCategories = [
    { name: 'Antibiotics', value: 35, color: '#3B82F6' },
    { name: 'Pain Relief', value: 25, color: '#10B981' },
    { name: 'Vitamins', value: 20, color: '#F59E0B' },
    { name: 'Heart Medicine', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' },
  ];

  const expiryTrends = [
    { month: 'Jan', expiring: 5 },
    { month: 'Feb', expiring: 8 },
    { month: 'Mar', expiring: 12 },
    { month: 'Apr', expiring: 15 },
    { month: 'May', expiring: 18 },
    { month: 'Jun', expiring: 22 },
  ];

  const kpiCards = [
    {
      title: 'Total Medicines',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Active Stores',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: '$156,890',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Expiring Soon',
      value: '23',
      change: '+8%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {kpi.change}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                    <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Supplies Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Supply Trends</CardTitle>
            <CardDescription>
              Number of supplies and total value over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySupplies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="supplies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Medicine Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Categories</CardTitle>
            <CardDescription>
              Distribution of medicines by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={medicineCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {medicineCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expiry Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Expiry Trends</CardTitle>
            <CardDescription>
              Number of medicines expiring each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expiryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="expiring" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Level Overview</CardTitle>
            <CardDescription>
              Current stock status across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { category: 'Antibiotics', current: 85, target: 100, status: 'good' },
              { category: 'Pain Relief', current: 45, target: 80, status: 'low' },
              { category: 'Vitamins', current: 92, target: 100, status: 'good' },
              { category: 'Heart Medicine', current: 30, target: 60, status: 'critical' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-gray-500">{item.current}/{item.target}</span>
                </div>
                <Progress 
                  value={(item.current / item.target) * 100} 
                  className="h-2"
                />
                <Badge 
                  variant={
                    item.status === 'good' ? 'default' : 
                    item.status === 'low' ? 'secondary' : 'destructive'
                  }
                  className="text-xs"
                >
                  {item.status === 'good' ? 'Adequate' : 
                   item.status === 'low' ? 'Low Stock' : 'Critical'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
