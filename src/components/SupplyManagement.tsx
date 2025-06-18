
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Package, Truck, Edit2, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supplyApi, medicineApi, storeApi, Supply, Medicine, MedicalStore, CreateSupplyInput } from '../services/api';

const SupplyManagement = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [newSupply, setNewSupply] = useState<CreateSupplyInput>({
    medicine_id: 0,
    store_id: 0,
    user_email: '',
    quantity: 0,
    supply_date: '',
    unit_price: 0,
    batch_info: '',
    expiry_date: '',
    notes: '',
    status: 'pending'
  });
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // Load data from API
  const loadSupplies = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    loadSupplies();
    loadMedicines();
    loadStores();
  }, [loadSupplies, loadMedicines, loadStores]);
  const handleCreateSupply = async () => {
    if (!newSupply.medicine_id || !newSupply.store_id || !newSupply.quantity || !newSupply.supply_date || !newSupply.user_email || !newSupply.unit_price) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const supplyData: CreateSupplyInput = {
        medicine_id: Number(newSupply.medicine_id),
        store_id: Number(newSupply.store_id),
        user_email: newSupply.user_email,
        quantity: newSupply.quantity,
        supply_date: newSupply.supply_date,
        unit_price: newSupply.unit_price,
        batch_info: newSupply.batch_info,
        expiry_date: newSupply.expiry_date,
        notes: newSupply.notes,
        status: newSupply.status
      };

      const response = await supplyApi.create(supplyData);
      if (response.success && response.data) {
        setSupplies([response.data, ...supplies]);
        setNewSupply({
          medicine_id: 0,
          store_id: 0,
          user_email: '',
          quantity: 0,
          supply_date: '',
          unit_price: 0,
          batch_info: '',
          expiry_date: '',
          notes: '',
          status: 'pending'
        });
        toast({ title: "Supply record created successfully!" });
      } else {
        toast({ 
          title: "Error creating supply", 
          description: response.error || "Failed to create supply record",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error creating supply:', error);
      toast({ 
        title: "Error creating supply", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSupply = async (supply: Supply) => {
    if (!supply.quantity || !supply.supply_date) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {
        medicine_id: supply.medicine_id,
        store_id: supply.store_id,
        quantity: supply.quantity,
        supply_date: supply.supply_date
      };

      const response = await supplyApi.update(supply.supply_id, updateData);
      if (response.success && response.data) {
        setSupplies(supplies.map(s => s.supply_id === supply.supply_id ? response.data! : s));
        setEditingSupply(null);
        toast({ title: "Supply record updated successfully!" });
      } else {
        toast({ 
          title: "Error updating supply", 
          description: response.error || "Failed to update supply record",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error updating supply:', error);
      toast({ 
        title: "Error updating supply", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupply = async (supplyId: number) => {
    if (!confirm('Are you sure you want to delete this supply record?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await supplyApi.delete(supplyId);
      if (response.success) {
        setSupplies(supplies.filter(s => s.supply_id !== supplyId));
        toast({ title: "Supply record deleted successfully!" });
      } else {
        toast({ 
          title: "Error deleting supply", 
          description: response.error || "Failed to delete supply record",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      toast({ 
        title: "Error deleting supply", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getSuppliesByStore = (storeId: number) => {
    return supplies.filter(supply => supply.store_id === storeId);
  };

  const getSuppliesByMedicine = (medicineId: number) => {
    return supplies.filter(supply => supply.medicine_id === medicineId);
  };

  const getMedicineName = (medicineId: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    return medicine ? medicine.name : 'Unknown Medicine';
  };

  const getStoreName = (storeId: number) => {
    const store = stores.find(s => s.store_id === storeId);
    return store ? store.store_name : 'Unknown Store';
  };

  return (
    <div className="space-y-6">
      {/* Add New Supply */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Plus className="w-5 h-5" />
            Record New Supply
          </CardTitle>
          <CardDescription>Log medicine supply to medical stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select value={newSupply.medicine_id.toString()} onValueChange={(value) => setNewSupply({ ...newSupply, medicine_id: parseInt(value) })}>
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

            <Select value={newSupply.store_id.toString()} onValueChange={(value) => setNewSupply({ ...newSupply, store_id: parseInt(value) })}>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="number"
              placeholder="Quantity"
              value={newSupply.quantity || ''}
              onChange={(e) => setNewSupply({ ...newSupply, quantity: parseInt(e.target.value) || 0 })}
            />

            <Input
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={newSupply.unit_price || ''}
              onChange={(e) => setNewSupply({ ...newSupply, unit_price: parseFloat(e.target.value) || 0 })}
            />

            <Input
              type="email"
              placeholder="User Email"
              value={newSupply.user_email}
              onChange={(e) => setNewSupply({ ...newSupply, user_email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="date"
              placeholder="Supply date"
              value={newSupply.supply_date}
              onChange={(e) => setNewSupply({ ...newSupply, supply_date: e.target.value })}
            />

            <Input
              type="date"
              placeholder="Expiry date (optional)"
              value={newSupply.expiry_date || ''}
              onChange={(e) => setNewSupply({ ...newSupply, expiry_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Batch Info (optional)"
              value={newSupply.batch_info || ''}
              onChange={(e) => setNewSupply({ ...newSupply, batch_info: e.target.value })}
            />

            <Select value={newSupply.status || 'pending'} onValueChange={(value) => setNewSupply({ ...newSupply, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Notes (optional)"
              value={newSupply.notes || ''}
              onChange={(e) => setNewSupply({ ...newSupply, notes: e.target.value })}
            />
          </div>

          <Button 
            onClick={handleCreateSupply}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Record Supply
          </Button>
        </CardContent>
      </Card>

      {/* Supply Records */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Truck className="w-5 h-5" />
            Supply Records
          </CardTitle>
          <CardDescription>View all medicine supply transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (            <div className="space-y-4">
              {supplies.map(supply => (
                <div
                  key={supply.supply_id}
                  className="p-4 rounded-lg border bg-white border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  {editingSupply?.supply_id === supply.supply_id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select 
                          value={editingSupply.medicine_id.toString()} 
                          onValueChange={(value) => setEditingSupply({ 
                            ...editingSupply, 
                            medicine_id: parseInt(value)
                          })}
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

                        <Select 
                          value={editingSupply.store_id.toString()} 
                          onValueChange={(value) => setEditingSupply({ 
                            ...editingSupply, 
                            store_id: parseInt(value)
                          })}
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

                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={editingSupply.quantity}
                          onChange={(e) => setEditingSupply({ 
                            ...editingSupply, 
                            quantity: parseInt(e.target.value) || 0 
                          })}
                        />

                        <Input
                          type="date"
                          value={editingSupply.supply_date.split('T')[0]}
                          onChange={(e) => setEditingSupply({ 
                            ...editingSupply, 
                            supply_date: e.target.value 
                          })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleUpdateSupply(editingSupply)}
                          className="bg-green-500 hover:bg-green-600"
                          disabled={isLoading}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          onClick={() => setEditingSupply(null)}
                          variant="outline"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {getMedicineName(supply.medicine_id)}
                          </h3>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {getStoreName(supply.store_id)}
                          </Badge>
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            Qty: {supply.quantity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Supplied on: {new Date(supply.supply_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => setEditingSupply(supply)}
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSupply(supply.supply_id)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supply Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medicines by Store */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Package className="w-5 h-5" />
              Medicines by Store
            </CardTitle>
          </CardHeader>
          <CardContent>            <div className="space-y-3">
              {stores.map(store => {
                const storeSupplies = getSuppliesByStore(store.store_id);
                return (
                  <div key={store.store_id} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">{store.store_name}</h4>
                    <p className="text-sm text-blue-700">
                      {storeSupplies.length} supply records • {store.city}, {store.state}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {storeSupplies.map(supply => (
                        <Badge key={supply.supply_id} variant="outline" className="text-xs">
                          {getMedicineName(supply.medicine_id)} ({supply.quantity})
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stores by Medicine */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Package className="w-5 h-5" />
              Stores by Medicine
            </CardTitle>
          </CardHeader>
          <CardContent>            <div className="space-y-3">
              {medicines.map(medicine => {
                const medicineSupplies = getSuppliesByMedicine(medicine.id);
                return (
                  <div key={medicine.id} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">{medicine.name}</h4>
                    <p className="text-sm text-green-700">
                      {medicineSupplies.length} stores supplied • {medicine.company}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {medicineSupplies.map(supply => (
                        <Badge key={supply.supply_id} variant="outline" className="text-xs">
                          {getStoreName(supply.store_id)} ({supply.quantity})
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplyManagement;
