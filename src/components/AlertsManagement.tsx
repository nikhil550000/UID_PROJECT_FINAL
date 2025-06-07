import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Building2, 
  TrendingDown,
  Bell,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { medicineApi, storeApi, supplyApi, Medicine, MedicalStore, Supply } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'expiry' | 'stock' | 'store' | 'supply' | 'system';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  isRead: boolean;
  isResolved: boolean;
  relatedId?: number;
  relatedType?: 'medicine' | 'store' | 'supply';
  actionRequired?: boolean;
  expiryDate?: string;
  quantity?: number;
  value?: number;
}

interface AlertStats {
  total: number;
  critical: number;
  warning: number;
  unread: number;
  resolved: number;
  actionRequired: number;
}

const AlertsManagement = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  const { toast } = useToast();

  // Generate alerts based on pharmaceutical data
  const generateAlerts = useCallback((medicinesData: Medicine[], storesData: MedicalStore[], suppliesData: Supply[]): Alert[] => {
    const newAlerts: Alert[] = [];
    const today = new Date();
    
    // 1. EXPIRY ALERTS
    medicinesData.forEach(medicine => {
      const expiryDate = new Date(medicine.date_of_expiry);
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry <= 7 && daysToExpiry >= 0) {
        newAlerts.push({
          id: `expiry-critical-${medicine.id}`,
          type: 'critical',
          category: 'expiry',
          title: 'Medicine Expiring Within 7 Days',
          message: `${medicine.name} (${medicine.company}) expires in ${daysToExpiry} days`,
          severity: 'high',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: medicine.id,
          relatedType: 'medicine',
          actionRequired: true,
          expiryDate: medicine.date_of_expiry
        });
      } else if (daysToExpiry <= 30 && daysToExpiry > 7) {
        newAlerts.push({
          id: `expiry-warning-${medicine.id}`,
          type: 'warning',
          category: 'expiry',
          title: 'Medicine Expiring Within 30 Days',
          message: `${medicine.name} (${medicine.company}) expires in ${daysToExpiry} days`,
          severity: 'medium',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: medicine.id,
          relatedType: 'medicine',
          actionRequired: true,
          expiryDate: medicine.date_of_expiry
        });
      } else if (daysToExpiry < 0) {
        newAlerts.push({
          id: `expiry-expired-${medicine.id}`,
          type: 'critical',
          category: 'expiry',
          title: 'Medicine Already Expired',
          message: `${medicine.name} (${medicine.company}) expired ${Math.abs(daysToExpiry)} days ago`,
          severity: 'high',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: medicine.id,
          relatedType: 'medicine',
          actionRequired: true,
          expiryDate: medicine.date_of_expiry
        });
      }
    });

    // 2. STOCK ALERTS
    medicinesData.forEach(medicine => {
      const medicineSupplies = suppliesData.filter(s => s.medicine_id === medicine.id);
      const totalSupplied = medicineSupplies.reduce((sum, s) => sum + s.quantity, 0);
      const storesSupplied = new Set(medicineSupplies.map(s => s.store_id)).size;
      
      // Low stock threshold based on supply patterns
      const avgSupplyPerStore = totalSupplied / Math.max(storesSupplied, 1);
      
      if (totalSupplied < 50) {
        newAlerts.push({
          id: `stock-low-${medicine.id}`,
          type: 'warning',
          category: 'stock',
          title: 'Low Stock Alert',
          message: `${medicine.name} has low total supply (${totalSupplied} units across ${storesSupplied} stores)`,
          severity: 'medium',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: medicine.id,
          relatedType: 'medicine',
          actionRequired: true,
          quantity: totalSupplied
        });
      }

      if (storesSupplied === 0) {
        newAlerts.push({
          id: `stock-none-${medicine.id}`,
          type: 'critical',
          category: 'stock',
          title: 'Medicine Not Supplied to Any Store',
          message: `${medicine.name} (${medicine.company}) has not been supplied to any stores`,
          severity: 'high',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: medicine.id,
          relatedType: 'medicine',
          actionRequired: true,
          quantity: 0
        });
      }
    });

    // 3. STORE ALERTS
    storesData.forEach(store => {
      const storeSupplies = suppliesData.filter(s => s.store_id === store.store_id);
      const uniqueMedicines = new Set(storeSupplies.map(s => s.medicine_id)).size;
      const totalQuantity = storeSupplies.reduce((sum, s) => sum + s.quantity, 0);
      
      if (storeSupplies.length === 0) {
        newAlerts.push({
          id: `store-inactive-${store.store_id}`,
          type: 'warning',
          category: 'store',
          title: 'Inactive Store',
          message: `${store.store_name} (${store.location}) has no supply records`,
          severity: 'medium',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: store.store_id,
          relatedType: 'store',
          actionRequired: true
        });
      } else if (uniqueMedicines < 3) {
        newAlerts.push({
          id: `store-limited-${store.store_id}`,
          type: 'info',
          category: 'store',
          title: 'Limited Medicine Variety',
          message: `${store.store_name} has only ${uniqueMedicines} different medicines supplied`,
          severity: 'low',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: store.store_id,
          relatedType: 'store',
          actionRequired: false
        });
      }

      // Check for recent supply activity
      const recentSupplies = storeSupplies.filter(s => {
        const supplyDate = new Date(s.supply_date);
        const daysSinceSupply = Math.ceil((today.getTime() - supplyDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSupply <= 30;
      });

      if (storeSupplies.length > 0 && recentSupplies.length === 0) {
        newAlerts.push({
          id: `store-inactive-supply-${store.store_id}`,
          type: 'warning',
          category: 'store',
          title: 'No Recent Supply Activity',
          message: `${store.store_name} has no supply records in the last 30 days`,
          severity: 'medium',
          createdAt: new Date().toISOString(),
          isRead: false,
          isResolved: false,
          relatedId: store.store_id,
          relatedType: 'store',
          actionRequired: true
        });
      }
    });

    // 4. SUPPLY ALERTS
    const recentSupplies = suppliesData.filter(s => {
      const supplyDate = new Date(s.supply_date);
      const daysSinceSupply = Math.ceil((today.getTime() - supplyDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceSupply <= 7;
    });

    if (recentSupplies.length === 0 && suppliesData.length > 0) {
      newAlerts.push({
        id: 'supply-inactive-recent',
        type: 'warning',
        category: 'supply',
        title: 'No Recent Supply Activity',
        message: 'No medicines have been supplied to any stores in the last 7 days',
        severity: 'medium',
        createdAt: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: true
      });
    }

    // 5. SYSTEM ALERTS
    if (medicinesData.length === 0) {
      newAlerts.push({
        id: 'system-no-medicines',
        type: 'critical',
        category: 'system',
        title: 'No Medicines in Database',
        message: 'The medicine database is empty. Please add medicines to begin operations.',
        severity: 'high',
        createdAt: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: true
      });
    }

    if (storesData.length === 0) {
      newAlerts.push({
        id: 'system-no-stores',
        type: 'critical',
        category: 'system',
        title: 'No Medical Stores in Database',
        message: 'No medical stores are registered. Please add stores to begin operations.',
        severity: 'high',
        createdAt: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: true
      });
    }

    // 6. VALUE ALERTS
    const totalValue = suppliesData.reduce((sum, supply) => {
      const medicine = medicinesData.find(m => m.id === supply.medicine_id);
      return sum + (supply.quantity * (medicine?.price || 0));
    }, 0);

    if (totalValue > 100000) {
      newAlerts.push({
        id: 'value-high-inventory',
        type: 'info',
        category: 'system',
        title: 'High Inventory Value',
        message: `Total inventory value is $${totalValue.toLocaleString()} - Monitor for optimal stock levels`,
        severity: 'low',
        createdAt: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: false,
        value: totalValue
      });
    }

    return newAlerts.sort((a, b) => {
      // Sort by severity and creation date
      const severityOrder = { high: 3, medium: 2, low: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });  }, []);

  // Load all data and generate alerts
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [medicinesRes, storesRes, suppliesRes] = await Promise.all([
        medicineApi.getAll(),
        storeApi.getAll(),
        supplyApi.getAll()
      ]);

      const medicinesData = medicinesRes.data || [];
      const storesData = storesRes.data || [];
      const suppliesData = suppliesRes.data || [];

      setMedicines(medicinesData);
      setStores(storesData);
      setSupplies(suppliesData);

      // Generate alerts based on data
      const generatedAlerts = generateAlerts(medicinesData, storesData, suppliesData);
      setAlerts(generatedAlerts);
      
      toast({
        title: "Alerts data loaded successfully!",
        description: `Found ${generatedAlerts.length} alerts requiring attention.`
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load pharmaceutical data for alerts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, generateAlerts]);

  // Calculate alert statistics
  const calculateStats = useCallback(() => {
    if (!alerts.length) return;

    const stats: AlertStats = {
      total: alerts.length,
      critical: alerts.filter(a => a.type === 'critical').length,
      warning: alerts.filter(a => a.type === 'warning').length,
      unread: alerts.filter(a => !a.isRead).length,
      resolved: alerts.filter(a => a.isResolved).length,
      actionRequired: alerts.filter(a => a.actionRequired).length
    };

    setAlertStats(stats);
  }, [alerts]);

  // Filter alerts based on selected criteria
  const filteredAlerts = alerts.filter(alert => {
    if (selectedCategory !== 'all' && alert.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (showOnlyUnread && alert.isRead) return false;
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Mark alert as read
  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  // Mark alert as resolved
  const markAsResolved = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true, isRead: true } : alert
    ));
    toast({ title: "Alert marked as resolved" });
  };

  // Mark all alerts as read
  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast({ title: "All alerts marked as read" });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  if (isLoading && !alertStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600 mt-1">Monitor critical pharmaceutical operations and receive notifications</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Alerts
          </Button>
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!alertStats?.unread}
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      {alertStats && (
        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alert Overview
            </CardTitle>
            <CardDescription className="text-orange-100">
              Current system alerts and notification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{alertStats.total}</div>
                <div className="text-sm text-orange-100">Total Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-200">{alertStats.critical}</div>
                <div className="text-sm text-orange-100">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">{alertStats.warning}</div>
                <div className="text-sm text-orange-100">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">{alertStats.unread}</div>
                <div className="text-sm text-orange-100">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-200">{alertStats.resolved}</div>
                <div className="text-sm text-orange-100">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-200">{alertStats.actionRequired}</div>
                <div className="text-sm text-orange-100">Action Required</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Alert Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="expiry">Expiry Alerts</SelectItem>
                  <SelectItem value="stock">Stock Alerts</SelectItem>
                  <SelectItem value="store">Store Alerts</SelectItem>
                  <SelectItem value="supply">Supply Alerts</SelectItem>
                  <SelectItem value="system">System Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Severity</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant={showOnlyUnread ? "default" : "outline"}
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className="w-full flex items-center gap-2"
              >
                {showOnlyUnread ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showOnlyUnread ? 'Show All' : 'Unread Only'}
              </Button>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600 self-center">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="store">Stores</TabsTrigger>
          <TabsTrigger value="supply">Supply</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* All Alerts */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                All System Alerts
              </CardTitle>
              <CardDescription>
                Complete overview of all pharmaceutical system alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts Found</h3>
                  <p className="text-gray-600">
                    {alerts.length === 0 
                      ? "All systems are operating normally. No alerts at this time." 
                      : "No alerts match your current filter criteria."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        alert.isResolved 
                          ? 'bg-gray-50 border-gray-200 opacity-60' 
                          : alert.type === 'critical' 
                            ? 'bg-red-50 border-red-200' 
                            : alert.type === 'warning'
                              ? 'bg-yellow-50 border-yellow-200'
                              : alert.type === 'info'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-green-50 border-green-200'
                      } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                            {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                            {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-600" />}
                            {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  alert.type === 'critical' ? 'destructive' :
                                  alert.type === 'warning' ? 'secondary' :
                                  alert.type === 'info' ? 'outline' : 'default'
                                }
                              >
                                {alert.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {alert.category.toUpperCase()}
                              </Badge>
                              {alert.severity === 'high' && (
                                <Badge variant="destructive">HIGH PRIORITY</Badge>
                              )}
                              {alert.actionRequired && (
                                <Badge variant="secondary">ACTION REQUIRED</Badge>
                              )}
                              {!alert.isRead && (
                                <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                              )}
                              {alert.isResolved && (
                                <Badge className="bg-green-100 text-green-800">RESOLVED</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                            </div>
                            {alert.expiryDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Expires: {alert.expiryDate}</span>
                              </div>
                            )}
                            {alert.quantity !== undefined && (
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>Qty: {alert.quantity}</span>
                              </div>
                            )}
                            {alert.value !== undefined && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>${alert.value.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!alert.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(alert.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          {!alert.isResolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsResolved(alert.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category-specific tabs with filtered alerts */}
        {['expiry', 'stock', 'store', 'supply', 'system'].map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category === 'expiry' && <Clock className="w-5 h-5" />}
                  {category === 'stock' && <Package className="w-5 h-5" />}
                  {category === 'store' && <Building2 className="w-5 h-5" />}
                  {category === 'supply' && <TrendingDown className="w-5 h-5" />}
                  {category === 'system' && <Activity className="w-5 h-5" />}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Alerts
                </CardTitle>
                <CardDescription>
                  {category === 'expiry' && 'Medicine expiration monitoring and alerts'}
                  {category === 'stock' && 'Inventory levels and stock management alerts'}
                  {category === 'store' && 'Medical store activity and performance alerts'}
                  {category === 'supply' && 'Supply chain and distribution alerts'}
                  {category === 'system' && 'System status and operational alerts'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(alert => alert.category === category).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        alert.isResolved 
                          ? 'bg-gray-50 border-gray-200 opacity-60' 
                          : alert.type === 'critical' 
                            ? 'bg-red-50 border-red-200' 
                            : alert.type === 'warning'
                              ? 'bg-yellow-50 border-yellow-200'
                              : alert.type === 'info'
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-green-50 border-green-200'
                      } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                            {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                            {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-600" />}
                            {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  alert.type === 'critical' ? 'destructive' :
                                  alert.type === 'warning' ? 'secondary' :
                                  alert.type === 'info' ? 'outline' : 'default'
                                }
                              >
                                {alert.type.toUpperCase()}
                              </Badge>
                              {alert.severity === 'high' && (
                                <Badge variant="destructive">HIGH PRIORITY</Badge>
                              )}
                              {alert.actionRequired && (
                                <Badge variant="secondary">ACTION REQUIRED</Badge>
                              )}
                              {!alert.isRead && (
                                <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                              )}
                              {alert.isResolved && (
                                <Badge className="bg-green-100 text-green-800">RESOLVED</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{alert.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                            </div>
                            {alert.expiryDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Expires: {alert.expiryDate}</span>
                              </div>
                            )}
                            {alert.quantity !== undefined && (
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>Qty: {alert.quantity}</span>
                              </div>
                            )}
                            {alert.value !== undefined && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>${alert.value.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!alert.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(alert.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          {!alert.isResolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsResolved(alert.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AlertsManagement;
