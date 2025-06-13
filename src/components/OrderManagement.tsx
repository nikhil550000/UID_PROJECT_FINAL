import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar, 
  Package, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  User,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { 
  orderApi, 
  medicineApi, 
  storeApi, 
  Order, 
  CreateOrderInput, 
  ProcessOrderInput,
  Medicine, 
  MedicalStore
} from '../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [newOrder, setNewOrder] = useState<CreateOrderInput>({
    medicine_id: 0,
    store_id: 0,
    quantity: 0,
    notes: ''
  });
  const [processingOrder, setProcessingOrder] = useState<ProcessOrderInput>({
    approver_id: 0,
    notes: ''
  });
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();
  const { user } = useAuth();

  // Load data functions
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await orderApi.getAll();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        toast({ 
          title: "Error loading orders", 
          description: response.error || "Failed to load orders",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({ 
        title: "Error loading orders", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadPendingOrders = useCallback(async () => {
    try {
      const response = await orderApi.getPending();
      if (response.success && response.data) {
        setPendingOrders(response.data);
      } else {
        toast({ 
          title: "Error loading pending orders", 
          description: response.error || "Failed to load pending orders",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error loading pending orders:', error);
      toast({ 
        title: "Error loading pending orders", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    }
  }, [toast]);

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
    }
  }, [toast]);

  useEffect(() => {
    loadOrders();
    loadPendingOrders();
    loadMedicines();
    loadStores();
  }, [loadOrders, loadPendingOrders, loadMedicines, loadStores]);

  // Order management functions
  const handleCreateOrder = async () => {
    if (!newOrder.medicine_id || !newOrder.store_id || !newOrder.quantity) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await orderApi.create(newOrder);
      if (response.success && response.data) {
        setOrders([response.data, ...orders]);
        setPendingOrders([response.data, ...pendingOrders]);
        setNewOrder({
          medicine_id: 0,
          store_id: 0,
          quantity: 0,
          notes: ''
        });
        toast({ title: "Order created successfully!" });
        setActiveTab('pending');
      } else {
        toast({ 
          title: "Error creating order", 
          description: response.error || "Failed to create order",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({ 
        title: "Error creating order", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    if (!user?.id) {
      toast({ title: "User not authenticated", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const approvalData: ProcessOrderInput = {
        approver_id: user.id,
        notes: processingOrder.notes
      };

      const response = await orderApi.approve(orderId, approvalData);
      if (response.success && response.data) {
        // Update orders list
        setOrders(orders.map(order => 
          order.order_id === orderId ? response.data! : order
        ));
        // Remove from pending orders
        setPendingOrders(pendingOrders.filter(order => order.order_id !== orderId));
        
        setSelectedOrderId(null);
        setProcessingOrder({ approver_id: user.id, notes: '' });
        toast({ title: "Order approved successfully!" });
      } else {
        toast({ 
          title: "Error approving order", 
          description: response.error || "Failed to approve order",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error approving order:', error);
      toast({ 
        title: "Error approving order", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    if (!user?.id) {
      toast({ title: "User not authenticated", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const rejectionData: ProcessOrderInput = {
        approver_id: user.id,
        notes: processingOrder.notes || 'Order rejected'
      };

      const response = await orderApi.reject(orderId, rejectionData);
      if (response.success && response.data) {
        // Update orders list
        setOrders(orders.map(order => 
          order.order_id === orderId ? response.data! : order
        ));
        // Remove from pending orders
        setPendingOrders(pendingOrders.filter(order => order.order_id !== orderId));
        
        setSelectedOrderId(null);
        setProcessingOrder({ approver_id: user.id, notes: '' });
        toast({ title: "Order rejected successfully!" });
      } else {
        toast({ 
          title: "Error rejecting order", 
          description: response.error || "Failed to reject order",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast({ 
        title: "Error rejecting order", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    try {
      setIsLoading(true);
      const response = await orderApi.markDelivered(orderId);
      if (response.success && response.data) {
        // Update orders list
        setOrders(orders.map(order => 
          order.order_id === orderId ? response.data! : order
        ));
        toast({ title: "Order marked as delivered!" });
      } else {
        toast({ 
          title: "Error marking order as delivered", 
          description: response.error || "Failed to mark order as delivered",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast({ 
        title: "Error marking order as delivered", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getMedicineName = (medicineId: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    return medicine ? medicine.name : 'Unknown Medicine';
  };

  const getStoreName = (storeId: number) => {
    const store = stores.find(s => s.store_id === storeId);
    return store ? store.store_name : 'Unknown Store';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const canApproveOrders = () => {
    if (!user) return false;
    
    // Admins can always approve orders
    if (user.role === 'admin') return true;
    
    // Employees can approve orders if they have the permission
    if (user.role === 'employee' && user.employee?.can_approve_orders) return true;
    
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage medicine orders and approval workflow</p>
      </div>

      {/* Order Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Orders
            {pendingOrders.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Create Order Tab */}
        <TabsContent value="create">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Plus className="w-5 h-5" />
                Create New Order
              </CardTitle>
              <CardDescription>Request medicine supply for medical stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Medicine</label>
                  <Select 
                    value={newOrder.medicine_id.toString()} 
                    onValueChange={(value) => setNewOrder({ ...newOrder, medicine_id: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map(medicine => (
                        <SelectItem key={medicine.id} value={medicine.id.toString()}>
                          {medicine.name} - {medicine.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store</label>
                  <Select 
                    value={newOrder.store_id.toString()} 
                    onValueChange={(value) => setNewOrder({ ...newOrder, store_id: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(store => (
                        <SelectItem key={store.store_id} value={store.store_id.toString()}>
                          {store.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={newOrder.quantity || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <Input
                    placeholder="Order notes"
                    value={newOrder.notes || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleCreateOrder}
                  disabled={isLoading || !newOrder.medicine_id || !newOrder.store_id || !newOrder.quantity}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Orders Tab */}
        <TabsContent value="pending">
          <Card className="bg-white/80 backdrop-blur-sm border-yellow-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Clock className="w-5 h-5" />
                Pending Orders
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {pendingOrders.length} pending
                </Badge>
              </CardTitle>
              <CardDescription>Orders awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map(order => (
                    <div
                      key={order.order_id}
                      className="p-4 rounded-lg border bg-white border-yellow-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              Order #{order.order_id}
                            </h3>
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status.toUpperCase()}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              <span>{getMedicineName(order.medicine_id)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{getStoreName(order.store_id)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Qty: {order.quantity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{order.requester?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          {order.notes && (
                            <div className="mt-2 text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {order.notes}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Created: {new Date(order.order_date).toLocaleString()}
                          </div>
                        </div>
                        
                        {canApproveOrders() && (
                          <div className="flex flex-col gap-2 ml-4">
                            {selectedOrderId === order.order_id ? (
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Approval/rejection notes..."
                                  value={processingOrder.notes}
                                  onChange={(e) => setProcessingOrder({ ...processingOrder, notes: e.target.value })}
                                  className="min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveOrder(order.order_id)}
                                    className="bg-green-500 hover:bg-green-600"
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRejectOrder(order.order_id)}
                                    className="bg-red-500 hover:bg-red-600"
                                    disabled={isLoading}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedOrderId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrderId(order.order_id)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                Process Order
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="all">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Package className="w-5 h-5" />
                All Orders
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {orders.length} total
                </Badge>
              </CardTitle>
              <CardDescription>Complete order history and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.order_id}
                      className="p-4 rounded-lg border bg-white border-gray-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              Order #{order.order_id}
                            </h3>
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status.toUpperCase()}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              <span>{getMedicineName(order.medicine_id)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{getStoreName(order.store_id)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Qty: {order.quantity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{order.requester?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          {order.notes && (
                            <div className="mt-2 text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {order.notes}
                            </div>
                          )}
                          <div className="mt-2 space-y-1 text-xs text-gray-500">
                            <div>
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Created: {new Date(order.order_date).toLocaleString()}
                            </div>
                            {order.approved_at && (
                              <div>
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Approved: {new Date(order.approved_at).toLocaleString()}
                                {order.approver && ` by ${order.approver.name}`}
                              </div>
                            )}
                            {order.delivered_at && (
                              <div>
                                <Truck className="w-3 h-3 inline mr-1" />
                                Delivered: {new Date(order.delivered_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {order.status === 'approved' && !order.delivered_at && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkDelivered(order.order_id)}
                              className="bg-blue-500 hover:bg-blue-600"
                              disabled={isLoading}
                            >
                              <Truck className="w-3 h-3 mr-1" />
                              Mark Delivered
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

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending Orders</p>
                    <p className="text-2xl font-bold">{pendingOrders.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Approved Orders</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.status === 'approved').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Rejected Orders</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.status === 'rejected').length}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
