import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  Building2, 
  Truck,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Filter,
  RefreshCw,
  FileBarChart
} from 'lucide-react';
import { medicineApi, storeApi, supplyApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Medicine {
  id: number;
  name: string;
  company: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  price: number;
}

interface MedicalStore {
  store_id: number;
  store_name: string;
  location: string;
}

interface Supply {
  supply_id: number;
  medicine_id: number;
  store_id: number;
  quantity: number;
  supply_date: string;
  medicine?: Medicine;
  store?: MedicalStore;
}

interface ReportStats {
  totalMedicines: number;
  totalStores: number;
  totalSupplies: number;
  totalValue: number;
  expiringMedicines: number;
  lowStockMedicines: number;
  topPerformingMedicine: string;
  topPerformingStore: string;
}

interface InventoryReport {
  medicine: Medicine;
  totalSupplied: number;
  totalValue: number;
  storesSupplied: number;
  lastSupplyDate: string;
  status: 'active' | 'low' | 'expiring' | 'critical';
}

interface StoreReport {
  store: MedicalStore;
  totalMedicines: number;
  totalQuantity: number;
  totalValue: number;
  lastSupplyDate: string;
  suppliesCount: number;
}

interface SupplyReport {
  date: string;
  medicinesSupplied: number;
  storesSupplied: number;
  totalQuantity: number;
  totalValue: number;
  supplies: Supply[];
}

const ReportsManagement = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const { toast } = useToast();

  // Load all data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [medicinesRes, storesRes, suppliesRes] = await Promise.all([
        medicineApi.getAll(),
        storeApi.getAll(),
        supplyApi.getAll()
      ]);

      setMedicines(medicinesRes.data || []);
      setStores(storesRes.data || []);
      setSupplies(suppliesRes.data || []);
      
      toast({
        title: "Reports data loaded successfully!",
        description: "All pharmaceutical data has been updated."
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load pharmaceutical data for reports.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Calculate report statistics
  const calculateStats = useCallback(() => {
    if (!medicines.length || !stores.length || !supplies.length) return;

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Calculate expiring medicines
    const expiringMedicines = medicines.filter(medicine => {
      const expiryDate = new Date(medicine.date_of_expiry);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    }).length;

    // Calculate total value
    const totalValue = supplies.reduce((sum, supply) => {
      const medicine = medicines.find(m => m.id === supply.medicine_id);
      return sum + (supply.quantity * (medicine?.price || 0));
    }, 0);

    // Find top performing medicine (most supplied)
    const medicineSupplies = medicines.map(medicine => ({
      medicine,
      totalSupplied: supplies
        .filter(s => s.medicine_id === medicine.id)
        .reduce((sum, s) => sum + s.quantity, 0)
    }));
    const topMedicine = medicineSupplies.reduce((max, current) => 
      current.totalSupplied > max.totalSupplied ? current : max,
      medicineSupplies[0]
    );

    // Find top performing store (most supplies received)
    const storeSupplies = stores.map(store => ({
      store,
      suppliesCount: supplies.filter(s => s.store_id === store.store_id).length
    }));
    const topStore = storeSupplies.reduce((max, current) => 
      current.suppliesCount > max.suppliesCount ? current : max,
      storeSupplies[0]
    );

    setReportStats({
      totalMedicines: medicines.length,
      totalStores: stores.length,
      totalSupplies: supplies.length,
      totalValue,
      expiringMedicines,
      lowStockMedicines: Math.floor(medicines.length * 0.1), // Mock 10% low stock
      topPerformingMedicine: topMedicine?.medicine?.name || 'N/A',
      topPerformingStore: topStore?.store?.store_name || 'N/A'
    });
  }, [medicines, stores, supplies]);

  // Generate inventory report
  const generateInventoryReport = useCallback((): InventoryReport[] => {
    return medicines.map(medicine => {
      const medicineSupplies = supplies.filter(s => s.medicine_id === medicine.id);
      const totalSupplied = medicineSupplies.reduce((sum, s) => sum + s.quantity, 0);
      const totalValue = totalSupplied * medicine.price;
      const storesSupplied = new Set(medicineSupplies.map(s => s.store_id)).size;
      const lastSupply = medicineSupplies.sort((a, b) => 
        new Date(b.supply_date).getTime() - new Date(a.supply_date).getTime()
      )[0];
      
      // Determine status
      const today = new Date();
      const expiryDate = new Date(medicine.date_of_expiry);
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: InventoryReport['status'] = 'active';
      if (daysToExpiry <= 30) status = 'expiring';
      if (daysToExpiry <= 7) status = 'critical';
      if (totalSupplied < 50) status = 'low'; // Mock threshold

      return {
        medicine,
        totalSupplied,
        totalValue,
        storesSupplied,
        lastSupplyDate: lastSupply?.supply_date || 'Never',
        status
      };
    });
  }, [medicines, supplies]);

  // Generate store performance report
  const generateStoreReport = useCallback((): StoreReport[] => {
    return stores.map(store => {
      const storeSupplies = supplies.filter(s => s.store_id === store.store_id);
      const totalQuantity = storeSupplies.reduce((sum, s) => sum + s.quantity, 0);
      const totalValue = storeSupplies.reduce((sum, supply) => {
        const medicine = medicines.find(m => m.id === supply.medicine_id);
        return sum + (supply.quantity * (medicine?.price || 0));
      }, 0);
      const uniqueMedicines = new Set(storeSupplies.map(s => s.medicine_id)).size;
      const lastSupply = storeSupplies.sort((a, b) => 
        new Date(b.supply_date).getTime() - new Date(a.supply_date).getTime()
      )[0];

      return {
        store,
        totalMedicines: uniqueMedicines,
        totalQuantity,
        totalValue,
        lastSupplyDate: lastSupply?.supply_date || 'Never',
        suppliesCount: storeSupplies.length
      };
    });
  }, [stores, supplies, medicines]);

  // Generate supply trend report
  const generateSupplyTrendReport = useCallback((): SupplyReport[] => {
    const supplysByDate = supplies.reduce((acc, supply) => {
      const date = supply.supply_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(supply);
      return acc;
    }, {} as Record<string, Supply[]>);

    return Object.entries(supplysByDate).map(([date, daySupplies]) => {
      const totalQuantity = daySupplies.reduce((sum, s) => sum + s.quantity, 0);
      const totalValue = daySupplies.reduce((sum, supply) => {
        const medicine = medicines.find(m => m.id === supply.medicine_id);
        return sum + (supply.quantity * (medicine?.price || 0));
      }, 0);
      const uniqueMedicines = new Set(daySupplies.map(s => s.medicine_id)).size;
      const uniqueStores = new Set(daySupplies.map(s => s.store_id)).size;

      return {
        date,
        medicinesSupplied: uniqueMedicines,
        storesSupplied: uniqueStores,
        totalQuantity,
        totalValue,
        supplies: daySupplies
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [supplies, medicines]);
  // Export functions
  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('PharmaCover Reports', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // Executive Summary
      if (reportStats) {
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Executive Summary', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const summaryData = [
          ['Total Medicines', reportStats.totalMedicines.toString()],
          ['Active Stores', reportStats.totalStores.toString()],
          ['Supply Records', reportStats.totalSupplies.toString()],
          ['Total Value', `₹${reportStats.totalValue.toLocaleString()}`],
          ['Expiring Soon', reportStats.expiringMedicines.toString()],
          ['Low Stock', reportStats.lowStockMedicines.toString()]
        ];
        
        (doc as any).autoTable({
          startY: yPosition,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'grid',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [59, 130, 246] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Medicine Inventory Report
      const inventoryReport = generateInventoryReport();
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Medicine Inventory Report', 20, yPosition);
      yPosition += 10;
      
      const inventoryData = inventoryReport.slice(0, 10).map(item => [
        item.medicine.name,
        item.medicine.company,
        item.totalSupplied.toString(),
        `₹${item.totalValue.toFixed(2)}`,
        item.status.toUpperCase()
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Medicine', 'Company', 'Total Supplied', 'Total Value', 'Status']],
        body: inventoryData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 }
        }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Check if we need a new page
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Store Performance Report
      const storeReport = generateStoreReport();
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Store Performance Report', 20, yPosition);
      yPosition += 10;
      
      const storeData = storeReport.slice(0, 10).map(item => [
        item.store.store_name,
        item.store.location,
        item.totalMedicines.toString(),
        item.totalQuantity.toString(),
        `₹${item.totalValue.toFixed(2)}`
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Store Name', 'Location', 'Medicines', 'Quantity', 'Total Value']],
        body: storeData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 }
        }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount} - PharmaCover Reports`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`PharmaCover-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF Export Successful",
        description: "Your comprehensive report has been downloaded.",
      });
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "PDF Export Failed",
        description: "There was an error generating the PDF report.",
        variant: "destructive"
      });
    }
  };

  // Get unique companies for filter
  const uniqueCompanies = [...new Set(medicines.map(m => m.company))];

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  if (isLoading && !reportStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const inventoryReport = generateInventoryReport();
  const storeReport = generateStoreReport();
  const supplyTrendReport = generateSupplyTrendReport();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive pharmaceutical business intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      {reportStats && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5" />
              Executive Summary
            </CardTitle>
            <CardDescription className="text-blue-100">
              Key performance indicators for pharmaceutical operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{reportStats.totalMedicines}</div>
                <div className="text-sm text-blue-100">Total Medicines</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{reportStats.totalStores}</div>
                <div className="text-sm text-blue-100">Active Stores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{reportStats.totalSupplies}</div>
                <div className="text-sm text-blue-100">Supply Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{reportStats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Total Value</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-blue-300">
              <div className="text-center">
                <div className="text-xl font-semibold text-yellow-200">{reportStats.expiringMedicines}</div>
                <div className="text-xs text-blue-100">Expiring Soon</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-orange-200">{reportStats.lowStockMedicines}</div>
                <div className="text-xs text-blue-100">Low Stock</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-200">{reportStats.topPerformingMedicine}</div>
                <div className="text-xs text-blue-100">Top Medicine</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-200">{reportStats.topPerformingStore}</div>
                <div className="text-xs text-blue-100">Top Store</div>
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
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {uniqueCompanies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Store</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.store_id} value={store.store_id.toString()}>
                      {store.store_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="stores">Store Performance</TabsTrigger>
          <TabsTrigger value="supplies">Supply Trends</TabsTrigger>
          <TabsTrigger value="alerts">Critical Alerts</TabsTrigger>
        </TabsList>

        {/* Inventory Report */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Medicine Inventory Report
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of medicine inventory and performance
                </CardDescription>
              </div>
              <Button
                onClick={() => exportToCSV(inventoryReport, 'inventory-report')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryReport.map((item) => (
                  <div
                    key={item.medicine.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.medicine.name}</h3>
                          <Badge variant="secondary">{item.medicine.company}</Badge>
                          <Badge
                            variant={
                              item.status === 'critical' ? 'destructive' :
                              item.status === 'expiring' ? 'secondary' :
                              item.status === 'low' ? 'outline' : 'default'
                            }
                          >
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Supplied:</span>
                            <div className="font-semibold">{item.totalSupplied} units</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Value:</span>
                            <div className="font-semibold">₹{item.totalValue.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Stores Supplied:</span>
                            <div className="font-semibold">{item.storesSupplied}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Supply:</span>
                            <div className="font-semibold">{item.lastSupplyDate}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Performance Report */}
        <TabsContent value="stores">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Store Performance Report
                </CardTitle>
                <CardDescription>
                  Analysis of store performance and supply patterns
                </CardDescription>
              </div>
              <Button
                onClick={() => exportToCSV(storeReport, 'store-performance-report')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeReport.map((item) => (
                  <div
                    key={item.store.store_id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{item.store.store_name}</h3>
                      <Badge variant="outline">ID: {item.store.store_id}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{item.store.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medicines Received:</span>
                        <span className="font-medium">{item.totalMedicines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quantity:</span>
                        <span className="font-medium">{item.totalQuantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-medium">₹{item.totalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supply Records:</span>
                        <span className="font-medium">{item.suppliesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Supply:</span>
                        <span className="font-medium">{item.lastSupplyDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supply Trends Report */}
        <TabsContent value="supplies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Supply Trends Report
                </CardTitle>
                <CardDescription>
                  Daily supply activity and trend analysis
                </CardDescription>
              </div>
              <Button
                onClick={() => exportToCSV(supplyTrendReport, 'supply-trends-report')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplyTrendReport.slice(0, 10).map((item) => (
                  <div
                    key={item.date}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{item.date}</h3>
                      <Badge variant="outline">{item.supplies.length} supplies</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Medicines:</span>
                        <div className="font-semibold">{item.medicinesSupplied}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Stores:</span>
                        <div className="font-semibold">{item.storesSupplied}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Quantity:</span>
                        <div className="font-semibold">{item.totalQuantity} units</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Value:</span>
                        <div className="font-semibold">₹{item.totalValue.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Alerts Report */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Critical Alerts & Notifications
              </CardTitle>
              <CardDescription>
                Important alerts requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Expiring Medicines Alert */}
                {inventoryReport.filter(item => item.status === 'expiring' || item.status === 'critical').length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Medicines Expiring Soon</h3>
                    </div>
                    <div className="space-y-2">
                      {inventoryReport
                        .filter(item => item.status === 'expiring' || item.status === 'critical')
                        .map(item => (
                          <div key={item.medicine.id} className="flex justify-between items-center">
                            <span>{item.medicine.name} - {item.medicine.company}</span>
                            <Badge variant="destructive">{item.medicine.date_of_expiry}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Low Stock Alert */}
                {inventoryReport.filter(item => item.status === 'low').length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-900">Low Stock Medicines</h3>
                    </div>
                    <div className="space-y-2">
                      {inventoryReport
                        .filter(item => item.status === 'low')
                        .map(item => (
                          <div key={item.medicine.id} className="flex justify-between items-center">
                            <span>{item.medicine.name} - {item.medicine.company}</span>
                            <Badge variant="secondary">{item.totalSupplied} units</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Inactive Stores Alert */}
                {storeReport.filter(item => item.suppliesCount === 0).length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Inactive Stores</h3>
                    </div>
                    <div className="space-y-2">
                      {storeReport
                        .filter(item => item.suppliesCount === 0)
                        .map(item => (
                          <div key={item.store.store_id} className="flex justify-between items-center">
                            <span>{item.store.store_name} - {item.store.location}</span>
                            <Badge variant="outline">No supplies</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* No Alerts */}
                {inventoryReport.filter(item => item.status === 'expiring' || item.status === 'critical' || item.status === 'low').length === 0 &&
                 storeReport.filter(item => item.suppliesCount === 0).length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-green-600 mb-2">
                      <TrendingUp className="w-8 h-8 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">All Systems Normal</h3>
                    <p className="text-green-700">No critical alerts at this time. Operations are running smoothly.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
