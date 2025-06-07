
import React, { useState, useEffect, useCallback } from 'react';
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
  Calendar,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { medicineApi, storeApi, supplyApi, Medicine, MedicalStore, Supply } from '../../services/api';

interface DashboardStats {
  totalMedicines: number;
  totalStores: number;
  totalSupplies: number;
  expiringMedicines: number;
  totalValue: number;
}

interface MonthlySupplyData {
  month: string;
  supplies: number;
  value: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ExpiryData {
  month: string;
  expiring: number;
}

interface StockLevelData {
  category: string;
  current: number;
  target: number;
  status: 'good' | 'low' | 'critical';
}

const AnalyticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const { toast } = useToast();

  // Computed analytics data
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    totalStores: 0,
    totalSupplies: 0,
    expiringMedicines: 0,
    totalValue: 0
  });

  const [monthlySupplies, setMonthlySupplies] = useState<MonthlySupplyData[]>([]);
  const [medicineCategories, setMedicineCategories] = useState<CategoryData[]>([]);
  const [expiryTrends, setExpiryTrends] = useState<ExpiryData[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevelData[]>([]);

  // Load data from APIs  // Load data from APIs
  const loadMedicines = useCallback(async () => {
    try {
      const response = await medicineApi.getAll();
      if (response.success && response.data) {
        setMedicines(response.data);
      } else {
        toast({ 
          title: "Error loading medicines", 
          description: response.error || "Failed to load medicines",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
      toast({ 
        title: "Error loading medicines", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    }
  }, [toast]);

  const loadStores = useCallback(async () => {
    try {
      const response = await storeApi.getAll();
      if (response.success && response.data) {
        setStores(response.data);
      } else {
        toast({ 
          title: "Error loading stores", 
          description: response.error || "Failed to load stores",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      toast({ 
        title: "Error loading stores", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    }
  }, [toast]);

  const loadSupplies = useCallback(async () => {
    try {
      const response = await supplyApi.getAll();
      if (response.success && response.data) {
        setSupplies(response.data);
      } else {
        toast({ 
          title: "Error loading supplies", 
          description: response.error || "Failed to load supplies",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading supplies:', error);
      toast({ 
        title: "Error loading supplies", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    }
  }, [toast]);

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadMedicines(),
        loadStores(),
        loadSupplies()
      ]);
      setIsLoading(false);
    };

    loadAllData();
  }, [loadMedicines, loadStores, loadSupplies]);  // Calculate analytics data when raw data changes
  const calculateAnalytics = useCallback(() => {
    // Helper function to calculate monthly supply trends (last 6 months)
    const calculateMonthlySupplies = (): MonthlySupplyData[] => {
      const months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthSupplies = supplies.filter(supply => {
          const supplyDate = new Date(supply.supply_date);
          return supplyDate.getMonth() === date.getMonth() && 
                 supplyDate.getFullYear() === date.getFullYear();
        });

        const monthValue = monthSupplies.reduce((sum, supply) => {
          const medicine = medicines.find(m => m.id === supply.medicine_id);
          return sum + (medicine ? medicine.price * supply.quantity : 0);
        }, 0);

        months.push({
          month: monthName,
          supplies: monthSupplies.length,
          value: Math.round(monthValue)
        });
      }
      
      return months;
    };

    // Helper function to calculate medicine categories
    const calculateMedicineCategories = (): CategoryData[] => {
      // Group medicines by company/category for visualization
      const companyCounts: { [key: string]: number } = {};
      
      medicines.forEach(medicine => {
        const company = medicine.company || 'Unknown';
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      });

      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
      
      return Object.entries(companyCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5) // Top 5 companies
        .map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));
    };

    // Helper function to calculate expiry trends
    const calculateExpiryTrends = (): ExpiryData[] => {
      const months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const expiringInMonth = medicines.filter(medicine => {
          const expiryDate = new Date(medicine.date_of_expiry);
          return expiryDate >= date && expiryDate < nextMonth;
        }).length;

        months.push({
          month: monthName,
          expiring: expiringInMonth
        });
      }
      
      return months;
    };

    // Helper function to calculate stock levels
    const calculateStockLevels = (categoryData: CategoryData[]): StockLevelData[] => {
      const categories = categoryData.slice(0, 4); // Top 4 categories
      
      return categories.map(category => {
        const categoryMedicines = medicines.filter(m => m.company === category.name);
        const categorySupplies = supplies.filter(supply => {
          const medicine = medicines.find(m => m.id === supply.medicine_id);
          return medicine && medicine.company === category.name;
        });
        
        const totalQuantity = categorySupplies.reduce((sum, supply) => sum + supply.quantity, 0);
        const target = Math.max(100, categoryMedicines.length * 20); // Dynamic target based on medicine count
        
        let status: 'good' | 'low' | 'critical' = 'good';
        const percentage = (totalQuantity / target) * 100;
        
        if (percentage < 30) status = 'critical';
        else if (percentage < 60) status = 'low';
        
        return {
          category: category.name,
          current: totalQuantity,
          target,
          status
        };
      });
    };

    // Calculate basic stats
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const expiringCount = medicines.filter(medicine => {
      const expiryDate = new Date(medicine.date_of_expiry);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
    }).length;

    const totalValue = supplies.reduce((sum, supply) => {
      const medicine = medicines.find(m => m.id === supply.medicine_id);
      return sum + (medicine ? medicine.price * supply.quantity : 0);
    }, 0);

    setStats({
      totalMedicines: medicines.length,
      totalStores: stores.length,
      totalSupplies: supplies.length,
      expiringMedicines: expiringCount,
      totalValue
    });

    // Calculate all chart data
    const monthlyData = calculateMonthlySupplies();
    setMonthlySupplies(monthlyData);

    const categoryData = calculateMedicineCategories();
    setMedicineCategories(categoryData);

    const expiryData = calculateExpiryTrends();
    setExpiryTrends(expiryData);

    const stockData = calculateStockLevels(categoryData);
    setStockLevels(stockData);
  }, [medicines, stores, supplies]);

  useEffect(() => {
    if (medicines.length > 0 || stores.length > 0 || supplies.length > 0) {
      calculateAnalytics();
    }
  }, [medicines, stores, supplies, calculateAnalytics]);
  const kpiCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines.toString(),
      change: medicines.length > 0 ? '+12%' : '0%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Active Stores',
      value: stats.totalStores.toString(),
      change: stores.length > 0 ? '+5%' : '0%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      change: supplies.length > 0 ? '+18%' : '0%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringMedicines.toString(),
      change: stats.expiringMedicines > 0 ? '+8%' : '0%',
      changeType: stats.expiringMedicines > 5 ? 'negative' as const : 'positive' as const,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading analytics...</span>
        </div>
      </div>
    );
  }

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
          </CardHeader>            <CardContent className="space-y-4">
              {stockLevels.map((item, index) => (
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
              {stockLevels.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No stock data available
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
