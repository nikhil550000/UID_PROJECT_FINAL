
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Database, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { storeApi, MedicalStore, CreateStoreInput } from '../services/api';

const StoreManagement = () => {
  const [stores, setStores] = useState<MedicalStore[]>([]);
  const [newStore, setNewStore] = useState<CreateStoreInput>({
    store_name: '',
    location: ''
  });
  const [editingStore, setEditingStore] = useState<MedicalStore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load stores from API
  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);
  const handleCreateStore = async () => {
    if (!newStore.store_name.trim() || !newStore.location.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await storeApi.create(newStore);
      if (response.success && response.data) {
        setStores([...stores, response.data]);
        setNewStore({
          store_name: '',
          location: ''
        });
        toast({ title: "Medical store added successfully!" });
      } else {
        toast({ 
          title: "Error creating store", 
          description: response.error || "Failed to create store",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error creating store:', error);
      toast({ 
        title: "Error creating store", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStore = async (store_id: number, updates: Partial<MedicalStore>) => {
    try {
      setIsLoading(true);
      const updateData = {
        store_name: updates.store_name,
        location: updates.location
      };
      
      const response = await storeApi.update(store_id, updateData);
      if (response.success && response.data) {
        setStores(stores.map(store => 
          store.store_id === store_id ? response.data! : store
        ));
        setEditingStore(null);
        toast({ title: "Store updated successfully!" });
      } else {
        toast({ 
          title: "Error updating store", 
          description: response.error || "Failed to update store",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast({ 
        title: "Error updating store", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStore = async (store_id: number) => {
    try {
      setIsLoading(true);
      const response = await storeApi.delete(store_id);
      if (response.success) {
        setStores(stores.filter(store => store.store_id !== store_id));
        toast({ title: "Store deleted successfully!" });
      } else {
        toast({ 
          title: "Error deleting store", 
          description: response.error || "Failed to delete store",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      toast({ 
        title: "Error deleting store", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Store */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Plus className="w-5 h-5" />
            Add New Medical Store
          </CardTitle>
          <CardDescription>Register a new medical store location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Store name"
              value={newStore.store_name}
              onChange={(e) => setNewStore({ ...newStore, store_name: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={newStore.location}
              onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
            />
            <Button 
              onClick={handleCreateStore}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Add Store
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores List */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Database className="w-5 h-5" />
            Medical Stores Directory
          </CardTitle>
          <CardDescription>Manage registered medical store locations</CardDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map(store => (
                <div
                  key={store.store_id}
                  className="p-4 rounded-lg border bg-white border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  {editingStore?.store_id === store.store_id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingStore.store_name}
                        onChange={(e) => setEditingStore({ ...editingStore, store_name: e.target.value })}
                      />
                      <Input
                        value={editingStore.location}
                        onChange={(e) => setEditingStore({ ...editingStore, location: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStore(store.store_id, editingStore)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStore(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">{store.store_name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ID: {store.store_id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{store.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStore(store)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStore(store.store_id)}
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

export default StoreManagement;
