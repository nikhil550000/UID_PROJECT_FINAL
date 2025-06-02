
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Package, Truck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Supply {
  id: number;
  medicine_id: number;
  medicine_name: string;
  store_id: number;
  store_name: string;
  quantity: number;
  supply_date: string;
}

interface Medicine {
  id: number;
  medicine_name: string;
  company_name: string;
}

interface MedicalStore {
  store_id: number;
  store_name: string;
  location: string;
}

const SupplyManagement = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [newSupply, setNewSupply] = useState({
    medicine_id: '',
    store_id: '',
    quantity: 0,
    supply_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockMedicines: Medicine[] = [
    { id: 1, medicine_name: "Paracetamol", company_name: "PharmaCorp" },
    { id: 2, medicine_name: "Amoxicillin", company_name: "MedLife" },
    { id: 3, medicine_name: "Ibuprofen", company_name: "HealthPlus" },
  ];

  const mockStores: MedicalStore[] = [
    { store_id: 1, store_name: "City Pharmacy", location: "Downtown" },
    { store_id: 2, store_name: "Health Plus Medical", location: "Uptown" },
    { store_id: 3, store_name: "Metro Medical Store", location: "Suburbs" },
  ];

  const mockSupplies: Supply[] = [
    { id: 1, medicine_id: 1, medicine_name: "Paracetamol", store_id: 1, store_name: "City Pharmacy", quantity: 100, supply_date: "2024-01-15" },
    { id: 2, medicine_id: 2, medicine_name: "Amoxicillin", store_id: 2, store_name: "Health Plus Medical", quantity: 50, supply_date: "2024-01-14" },
    { id: 3, medicine_id: 3, medicine_name: "Ibuprofen", store_id: 3, store_name: "Metro Medical Store", quantity: 75, supply_date: "2024-01-13" },
    { id: 4, medicine_id: 1, medicine_name: "Paracetamol", store_id: 2, store_name: "Health Plus Medical", quantity: 80, supply_date: "2024-01-12" },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMedicines(mockMedicines);
      setStores(mockStores);
      setSupplies(mockSupplies);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateSupply = () => {
    if (!newSupply.medicine_id || !newSupply.store_id || !newSupply.quantity || !newSupply.supply_date) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const medicine = medicines.find(m => m.id === parseInt(newSupply.medicine_id));
    const store = stores.find(s => s.store_id === parseInt(newSupply.store_id));

    if (!medicine || !store) {
      toast({ title: "Invalid medicine or store selection", variant: "destructive" });
      return;
    }

    const supply: Supply = {
      id: Date.now(),
      medicine_id: parseInt(newSupply.medicine_id),
      medicine_name: medicine.medicine_name,
      store_id: parseInt(newSupply.store_id),
      store_name: store.store_name,
      quantity: newSupply.quantity,
      supply_date: newSupply.supply_date
    };

    setSupplies([...supplies, supply]);
    setNewSupply({
      medicine_id: '',
      store_id: '',
      quantity: 0,
      supply_date: ''
    });
    toast({ title: "Supply record created successfully!" });
  };

  const getSuppliesByStore = (storeId: number) => {
    return supplies.filter(supply => supply.store_id === storeId);
  };

  const getSuppliesByMedicine = (medicineId: number) => {
    return supplies.filter(supply => supply.medicine_id === medicineId);
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={newSupply.medicine_id} onValueChange={(value) => setNewSupply({ ...newSupply, medicine_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {medicines.map(medicine => (
                  <SelectItem key={medicine.id} value={medicine.id.toString()}>
                    {medicine.medicine_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newSupply.store_id} onValueChange={(value) => setNewSupply({ ...newSupply, store_id: value })}>
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
              value={newSupply.quantity || ''}
              onChange={(e) => setNewSupply({ ...newSupply, quantity: parseInt(e.target.value) || 0 })}
            />

            <Input
              type="date"
              placeholder="Supply date"
              value={newSupply.supply_date}
              onChange={(e) => setNewSupply({ ...newSupply, supply_date: e.target.value })}
            />

            <Button 
              onClick={handleCreateSupply}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Record Supply
            </Button>
          </div>
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
          ) : (
            <div className="space-y-4">
              {supplies.map(supply => (
                <div
                  key={supply.id}
                  className="p-4 rounded-lg border bg-white border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{supply.medicine_name}</h3>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {supply.store_name}
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          Qty: {supply.quantity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Supplied on: {supply.supply_date}</span>
                      </div>
                    </div>
                  </div>
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
          <CardContent>
            <div className="space-y-3">
              {stores.map(store => {
                const storeSupplies = getSuppliesByStore(store.store_id);
                return (
                  <div key={store.store_id} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">{store.store_name}</h4>
                    <p className="text-sm text-blue-700">
                      {storeSupplies.length} supply records
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {storeSupplies.map(supply => (
                        <Badge key={supply.id} variant="outline" className="text-xs">
                          {supply.medicine_name} ({supply.quantity})
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
          <CardContent>
            <div className="space-y-3">
              {medicines.map(medicine => {
                const medicineSupplies = getSuppliesByMedicine(medicine.id);
                return (
                  <div key={medicine.id} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">{medicine.medicine_name}</h4>
                    <p className="text-sm text-green-700">
                      {medicineSupplies.length} stores supplied
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {medicineSupplies.map(supply => (
                        <Badge key={supply.id} variant="outline" className="text-xs">
                          {supply.store_name} ({supply.quantity})
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
