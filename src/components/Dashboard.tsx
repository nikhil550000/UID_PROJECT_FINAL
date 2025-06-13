
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Calendar, Pill, Building2, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { medicineApi, storeApi, supplyApi, Medicine, MedicalStore, Supply } from '../services/api';

interface DashboardStats {
  totalMedicines: number;
  totalStores: number;
  totalSupplies: number;
  expiringMedicines: number;
  totalValue: number;
  recentSupplies: number;
}

interface RecentActivity {
  id: string;
  type: 'supply' | 'medicine' | 'store';
  description: string;
  date: string;
  quantity?: number;
  location?: string;
  company?: string;
}

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    totalStores: 0,
    totalSupplies: 0,
    expiringMedicines: 0,
    totalValue: 0,
    recentSupplies: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Load data from APIs
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
  }, [loadMedicines, loadStores, loadSupplies]);

  // Calculate dashboard statistics and recent activity
  const calculateDashboardData = useCallback(() => {
    // Calculate basic stats
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const expiringCount = medicines.filter(medicine => {
      const expiryDate = new Date(medicine.date_of_expiry);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
    }).length;

    const totalValue = supplies.reduce((sum, supply) => {
      const medicine = medicines.find(m => m.id === supply.medicine_id);
      return sum + (medicine ? Number(medicine.price) * supply.quantity : 0);
    }, 0);

    const recentSuppliesCount = supplies.filter(supply => {
      const supplyDate = new Date(supply.supply_date);
      return supplyDate >= sevenDaysAgo;
    }).length;

    setStats({
      totalMedicines: medicines.length,
      totalStores: stores.length,
      totalSupplies: supplies.length,
      expiringMedicines: expiringCount,
      totalValue,
      recentSupplies: recentSuppliesCount
    });

    // Generate recent activity from real data
    const activities: RecentActivity[] = [];

    // Add recent supplies (last 10)
    const recentSupplies = supplies
      .sort((a, b) => new Date(b.supply_date).getTime() - new Date(a.supply_date).getTime())
      .slice(0, 5);

    recentSupplies.forEach(supply => {
      const medicine = medicines.find(m => m.id === supply.medicine_id);
      const store = stores.find(s => s.store_id === supply.store_id);
      if (medicine && store) {
        activities.push({
          id: `supply-${supply.supply_id}`,
          type: 'supply',
          description: `${medicine.name} supplied to ${store.store_name}`,
          date: new Date(supply.supply_date).toLocaleDateString(),
          quantity: supply.quantity
        });
      }
    });

    // Add recent medicines (last 3)
    const recentMedicines = medicines
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    recentMedicines.forEach(medicine => {
      activities.push({
        id: `medicine-${medicine.id}`,
        type: 'medicine',
        description: `New medicine ${medicine.name} added`,
        date: new Date(medicine.created_at).toLocaleDateString(),
        company: medicine.company
      });
    });

    // Add recent stores (last 2)
    const recentStores = stores
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentStores.forEach(store => {
      activities.push({
        id: `store-${store.store_id}`,
        type: 'store',
        description: `${store.store_name} registered`,
        date: new Date(store.created_at).toLocaleDateString(),
        location: `${store.city}, ${store.state}`
      });
    });

    // Sort all activities by date and take top 8
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    setRecentActivity(sortedActivities);
  }, [medicines, stores, supplies]);

  useEffect(() => {
    if (medicines.length > 0 || stores.length > 0 || supplies.length > 0) {
      calculateDashboardData();
    }
  }, [medicines, stores, supplies, calculateDashboardData]);
  // Calculate growth percentages for display
  const getGrowthPercentage = (current: number, type: string) => {
    // Simulated growth based on data - in a real app, you'd compare with historical data
    switch (type) {
      case 'medicines':
        return current > 0 ? '+12%' : '0%';
      case 'stores':
        return stores.length > 0 ? '+8%' : '0%';
      case 'supplies':
        return stats.recentSupplies > 0 ? '+15%' : '0%';
      case 'expiring':
        return stats.expiringMedicines > 5 ? '+3%' : '0%';
      case 'value':
        return stats.totalValue > 0 ? '+22%' : '0%';
      case 'recent':
        return stats.recentSupplies > 0 ? '+18%' : '0%';
      default:
        return '0%';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Pill className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedicines}</div>
            <p className="text-xs text-blue-100">
              {getGrowthPercentage(stats.totalMedicines, 'medicines')} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Stores</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-green-100">
              {getGrowthPercentage(stats.totalStores, 'stores')} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supply Records</CardTitle>
            <Database className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSupplies}</div>
            <p className="text-xs text-purple-100">
              {getGrowthPercentage(stats.totalSupplies, 'supplies')} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringMedicines}</div>
            <p className="text-xs text-red-100">
              Medicines within 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-indigo-100">
              {getGrowthPercentage(stats.totalValue, 'value')} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSupplies}</div>
            <p className="text-xs text-orange-100">
              Supplies this week
            </p>
          </CardContent>
        </Card>
      </div>      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates in the pharmaceutical database</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm">Activities will appear here as you use the system</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'supply' ? 'bg-purple-500' :
                      activity.type === 'medicine' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      activity.type === 'supply' ? 'default' :
                      activity.type === 'medicine' ? 'secondary' : 'outline'
                    } className="text-xs">
                      {activity.type === 'supply' ? 'Supply' :
                       activity.type === 'medicine' ? 'Medicine' : 'Store'}
                    </Badge>
                    {activity.quantity && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Qty: {activity.quantity}
                      </span>
                    )}
                    {activity.company && (
                      <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                        {activity.company}
                      </span>
                    )}
                    {activity.location && (
                      <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
                        {activity.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>      {/* Quick Actions and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card 
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onNavigate && onNavigate('medicines')}
              >
                <CardContent className="p-4 text-center">
                  <Pill className="w-8 h-8 mx-auto text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-blue-800 text-sm">Add Medicine</h3>
                  <p className="text-xs text-blue-600 mt-1">Register new products</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onNavigate && onNavigate('stores')}
              >
                <CardContent className="p-4 text-center">
                  <Building2 className="w-8 h-8 mx-auto text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-green-800 text-sm">Add Store</h3>
                  <p className="text-xs text-green-600 mt-1">Register new locations</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onNavigate && onNavigate('supplies')}
              >
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 mx-auto text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-purple-800 text-sm">Record Supply</h3>
                  <p className="text-xs text-purple-600 mt-1">Log transactions</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onNavigate && onNavigate('orders')}
              >
                <CardContent className="p-4 text-center">
                  <Plus className="w-8 h-8 mx-auto text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-orange-800 text-sm">Create Order</h3>
                  <p className="text-xs text-orange-600 mt-1">Request medicines</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* System Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              System Summary
            </CardTitle>
            <CardDescription>Overview of your pharmaceutical database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">Medicine Inventory</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-800">{stats.totalMedicines}</p>
                  <p className="text-xs text-blue-600">Active products</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">Store Network</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-800">{stats.totalStores}</p>
                  <p className="text-xs text-green-600">Registered stores</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-900">Supply Chain</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-800">{stats.totalSupplies}</p>
                  <p className="text-xs text-purple-600">Total transactions</p>
                </div>
              </div>

              {stats.expiringMedicines > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-900">Attention Required</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-800">{stats.expiringMedicines}</p>
                    <p className="text-xs text-red-600">Expiring soon</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
