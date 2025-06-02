
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Database, Server, Code } from 'lucide-react';
import MedicineManagement from '@/components/MedicineManagement';
import StoreManagement from '@/components/StoreManagement';
import SupplyManagement from '@/components/SupplyManagement';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                PharmaCare Database System
              </h1>
              <p className="text-gray-600 mt-1">Pharmaceutical Company Management Platform</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Server className="w-3 h-3 mr-1" />
                Express API
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Database className="w-3 h-3 mr-1" />
                PostgreSQL
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Code className="w-3 h-3 mr-1" />
                React + Prisma
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
            <TabsTrigger value="stores">Medical Stores</TabsTrigger>
            <TabsTrigger value="supplies">Supply Records</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="medicines">
            <MedicineManagement />
          </TabsContent>

          <TabsContent value="stores">
            <StoreManagement />
          </TabsContent>

          <TabsContent value="supplies">
            <SupplyManagement />
          </TabsContent>

          <TabsContent value="documentation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Structure */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Code className="w-5 h-5" />
                    Project Structure
                  </CardTitle>
                  <CardDescription>
                    Organized pharmaceutical database architecture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-blue-600 font-semibold">📁 pharma-database/</div>
                    <div className="ml-4 text-green-600">📁 client/</div>
                    <div className="ml-8 text-gray-600">📁 src/</div>
                    <div className="ml-12 text-gray-500">📁 components/</div>
                    <div className="ml-16 text-gray-400">📄 MedicineManagement.tsx</div>
                    <div className="ml-16 text-gray-400">📄 StoreManagement.tsx</div>
                    <div className="ml-16 text-gray-400">📄 SupplyManagement.tsx</div>
                    <div className="ml-12 text-gray-500">📁 pages/</div>
                    <div className="ml-12 text-gray-500">📁 hooks/</div>
                    <div className="ml-8 text-gray-600">📄 package.json</div>
                    <div className="ml-4 text-green-600">📁 server/</div>
                    <div className="ml-8 text-gray-600">📁 src/</div>
                    <div className="ml-12 text-gray-500">📁 routes/</div>
                    <div className="ml-16 text-gray-400">📄 medicines.js</div>
                    <div className="ml-16 text-gray-400">📄 stores.js</div>
                    <div className="ml-16 text-gray-400">📄 supplies.js</div>
                    <div className="ml-12 text-gray-500">📁 controllers/</div>
                    <div className="ml-12 text-gray-500">📁 models/</div>
                    <div className="ml-8 text-gray-600">📁 prisma/</div>
                    <div className="ml-12 text-gray-500">📄 schema.prisma</div>
                    <div className="ml-8 text-gray-600">📄 .env</div>
                    <div className="ml-4 text-blue-600">📄 README.md</div>
                  </div>
                </CardContent>
              </Card>

              {/* Database Schema */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Database className="w-5 h-5" />
                    Database Schema
                  </CardTitle>
                  <CardDescription>
                    PostgreSQL tables with Prisma ORM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Medicines Table</h4>
                      <div className="space-y-1 text-xs font-mono">
                        <div>• id: Int (Primary Key)</div>
                        <div>• medicine_name: String</div>
                        <div>• company_name: String</div>
                        <div>• manufacture_date: DateTime</div>
                        <div>• expiry_date: DateTime</div>
                        <div>• price: Decimal</div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Medical Stores Table</h4>
                      <div className="space-y-1 text-xs font-mono">
                        <div>• store_id: Int (Primary Key)</div>
                        <div>• store_name: String</div>
                        <div>• location: String</div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Supplies Table (Junction)</h4>
                      <div className="space-y-1 text-xs font-mono">
                        <div>• id: Int (Primary Key)</div>
                        <div>• medicine_id: Int (Foreign Key)</div>
                        <div>• store_id: Int (Foreign Key)</div>
                        <div>• quantity: Int</div>
                        <div>• supply_date: DateTime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Server className="w-5 h-5" />
                    RESTful API Endpoints
                  </CardTitle>
                  <CardDescription>
                    Complete CRUD operations for pharmaceutical management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-700">Medicines API</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                          <code className="text-xs">/api/medicines</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                          <code className="text-xs">/api/medicines</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">PUT</Badge>
                          <code className="text-xs">/api/medicines/:id</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <Badge className="bg-red-100 text-red-800 text-xs">DELETE</Badge>
                          <code className="text-xs">/api/medicines/:id</code>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700">Stores API</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                          <code className="text-xs">/api/stores</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                          <code className="text-xs">/api/stores</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">PUT</Badge>
                          <code className="text-xs">/api/stores/:id</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <Badge className="bg-red-100 text-red-800 text-xs">DELETE</Badge>
                          <code className="text-xs">/api/stores/:id</code>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-700">Supplies API</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                          <code className="text-xs">/api/supplies</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">POST</Badge>
                          <code className="text-xs">/api/supplies</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                          <code className="text-xs">/api/stores/:id/medicines</code>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge className="bg-green-100 text-green-800 text-xs">GET</Badge>
                          <code className="text-xs">/api/medicines/:id/stores</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
