
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Pill, Calendar, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: number;
  medicine_name: string;
  company_name: string;
  manufacture_date: string;
  expiry_date: string;
  price: number;
}

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState({
    medicine_name: '',
    company_name: '',
    manufacture_date: '',
    expiry_date: '',
    price: 0
  });
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockMedicines: Medicine[] = [
    { id: 1, medicine_name: "Paracetamol", company_name: "PharmaCorp", manufacture_date: "2024-01-01", expiry_date: "2026-01-01", price: 25.50 },
    { id: 2, medicine_name: "Amoxicillin", company_name: "MedLife", manufacture_date: "2024-02-01", expiry_date: "2025-12-01", price: 45.00 },
    { id: 3, medicine_name: "Ibuprofen", company_name: "HealthPlus", manufacture_date: "2024-01-15", expiry_date: "2025-06-15", price: 30.25 },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMedicines(mockMedicines);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateMedicine = () => {
    if (!newMedicine.medicine_name.trim() || !newMedicine.company_name.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const medicine: Medicine = {
      id: Date.now(),
      ...newMedicine
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({
      medicine_name: '',
      company_name: '',
      manufacture_date: '',
      expiry_date: '',
      price: 0
    });
    toast({ title: "Medicine added successfully!" });
  };

  const handleUpdateMedicine = (id: number, updates: Partial<Medicine>) => {
    setMedicines(medicines.map(medicine => 
      medicine.id === id ? { ...medicine, ...updates } : medicine
    ));
    setEditingMedicine(null);
    toast({ title: "Medicine updated successfully!" });
  };

  const handleDeleteMedicine = (id: number) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
    toast({ title: "Medicine deleted successfully!" });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Medicine name"
              value={newMedicine.medicine_name}
              onChange={(e) => setNewMedicine({ ...newMedicine, medicine_name: e.target.value })}
            />
            <Input
              placeholder="Company name"
              value={newMedicine.company_name}
              onChange={(e) => setNewMedicine({ ...newMedicine, company_name: e.target.value })}
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
              value={newMedicine.manufacture_date}
              onChange={(e) => setNewMedicine({ ...newMedicine, manufacture_date: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Expiry date"
              value={newMedicine.expiry_date}
              onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
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
                  key={medicine.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isExpiringSoon(medicine.expiry_date) 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {editingMedicine?.id === medicine.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={editingMedicine.medicine_name}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, medicine_name: e.target.value })}
                      />
                      <Input
                        value={editingMedicine.company_name}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, company_name: e.target.value })}
                      />
                      <Input
                        type="number"
                        value={editingMedicine.price}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, price: parseFloat(e.target.value) })}
                      />
                      <Input
                        type="date"
                        value={editingMedicine.manufacture_date}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, manufacture_date: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={editingMedicine.expiry_date}
                        onChange={(e) => setEditingMedicine({ ...editingMedicine, expiry_date: e.target.value })}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{medicine.medicine_name}</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {medicine.company_name}
                          </Badge>
                          {isExpiringSoon(medicine.expiry_date) && (
                            <Badge variant="destructive">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Price: ${medicine.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Mfg: {medicine.manufacture_date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Exp: {medicine.expiry_date}</span>
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
