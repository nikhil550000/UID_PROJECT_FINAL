import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Pill, Calendar, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { medicineApi, Medicine, CreateMedicineInput } from '../services/api';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState<CreateMedicineInput>({
    name: '',
    company: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    price: 0
  });
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // Load medicines from API
  const loadMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);
  const handleCreateMedicine = async () => {
    if (!newMedicine.name.trim() || !newMedicine.company.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await medicineApi.create(newMedicine);
      if (response.success && response.data) {
        setMedicines([...medicines, response.data]);
        setNewMedicine({
          name: '',
          company: '',
          date_of_manufacture: '',
          date_of_expiry: '',
          price: 0
        });
        toast({ title: "Medicine added successfully!" });
      } else {
        toast({ 
          title: "Error creating medicine", 
          description: response.error || "Failed to create medicine",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
      toast({ 
        title: "Error creating medicine", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMedicine = async (id: number, updates: Partial<Medicine>) => {
    try {
      setIsLoading(true);
      const updateData = {
        name: updates.name,
        company: updates.company,
        date_of_manufacture: updates.date_of_manufacture,
        date_of_expiry: updates.date_of_expiry,
        price: updates.price
      };
      
      const response = await medicineApi.update(id, updateData);
      if (response.success && response.data) {
        setMedicines(medicines.map(medicine => 
          medicine.id === id ? response.data! : medicine
        ));
        setEditingMedicine(null);
        toast({ title: "Medicine updated successfully!" });
      } else {
        toast({ 
          title: "Error updating medicine", 
          description: response.error || "Failed to update medicine",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast({ 
        title: "Error updating medicine", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedicine = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await medicineApi.delete(id);
      if (response.success) {
        setMedicines(medicines.filter(medicine => medicine.id !== id));
        toast({ title: "Medicine deleted successfully!" });
      } else {
        toast({ 
          title: "Error deleting medicine", 
          description: response.error || "Failed to delete medicine",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast({ 
        title: "Error deleting medicine", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Add New Medicine */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Plus className="w-5 h-5" />
            Add New Medicine
          </CardTitle>
          <CardDescription>Register a new pharmaceutical product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">            <Input
              placeholder="Medicine name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            />
            <Input
              placeholder="Company name"
              value={newMedicine.company}
              onChange={(e) => setNewMedicine({ ...newMedicine, company: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newMedicine.price || ''}
              onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
            />
            <Input
              type="date"
              placeholder="Manufacture date"
              value={newMedicine.date_of_manufacture}              onChange={(e) => setNewMedicine({ ...newMedicine, date_of_manufacture: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Expiry date"
              value={newMedicine.date_of_expiry}
              onChange={(e) => setNewMedicine({ ...newMedicine, date_of_expiry: e.target.value })}
            />
            <Button 
              onClick={handleCreateMedicine}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Add Medicine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicines List */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Pill className="w-5 h-5" />
            Medicine Inventory
          </CardTitle>
          <CardDescription>Manage pharmaceutical products and their details</CardDescription>
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
          ) : (
            <div className="space-y-4">
              {medicines.map(medicine => (
                <div
                  key={medicine.id}                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isExpiringSoon(medicine.date_of_expiry) 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {editingMedicine?.id === medicine.id ? (                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={editingMedicine.name}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                      />
                      <Input
                        value={editingMedicine.company}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, company: e.target.value })}
                      />
                      <Input
                        type="number"
                        value={editingMedicine.price}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, price: parseFloat(e.target.value) })}
                      />
                      <Input
                        type="date"
                        value={editingMedicine.date_of_manufacture}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, date_of_manufacture: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={editingMedicine.date_of_expiry}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, date_of_expiry: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateMedicine(medicine.id, editingMedicine)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMedicine(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{medicine.name}</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {medicine.company}
                          </Badge>
                          {isExpiringSoon(medicine.date_of_expiry) && (
                            <Badge variant="destructive">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Price: ${Number(medicine.price).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Mfg: {medicine.date_of_manufacture}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Exp: {medicine.date_of_expiry}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMedicine(medicine)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
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
    </div>
  );
};

export default MedicineManagement;
