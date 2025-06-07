import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Database, 
  User,
  Globe,
  Clock,
  FileText,
  Palette,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface SystemSettings {
  // General Settings
  systemName: string;
  systemVersion: string;
  companyName: string;
  companyAddress: string;
  timezone: string;
  dateFormat: string;
  currencySymbol: string;
  language: string;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  expiryAlerts: boolean;
  lowStockAlerts: boolean;
  expiryThresholdDays: number;
  lowStockThreshold: number;
  
  // Security Settings
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  requirePasswordComplexity: boolean;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  
  // Database Settings
  autoBackup: boolean;
  backupInterval: string;
  dataRetentionDays: number;
  
  // Display Settings
  theme: string;
  recordsPerPage: number;
  showAdvancedFeatures: boolean;
  compactMode: boolean;
  
  // Business Settings
  defaultSupplier: string;
  defaultPaymentTerms: string;
  taxRate: number;
  enableInventoryTracking: boolean;
  enableBarcodeScanning: boolean;
}

const SettingsManagement = () => {
  const { user, hasAccess } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [settings, setSettings] = useState<SystemSettings>({
    // General Settings
    systemName: 'PharmaCover System',
    systemVersion: '1.0.0',
    companyName: 'PharmaCare Solutions',
    companyAddress: '123 Medical District, Healthcare City',
    timezone: 'UTC-05:00',
    dateFormat: 'YYYY-MM-DD',
    currencySymbol: '$',
    language: 'en',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    expiryAlerts: true,
    lowStockAlerts: true,
    expiryThresholdDays: 30,
    lowStockThreshold: 10,
    
    // Security Settings
    sessionTimeoutMinutes: 60,
    passwordMinLength: 8,
    requirePasswordComplexity: true,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    // Database Settings
    autoBackup: true,
    backupInterval: 'daily',
    dataRetentionDays: 365,
    
    // Display Settings
    theme: 'light',
    recordsPerPage: 20,
    showAdvancedFeatures: false,
    compactMode: false,
    
    // Business Settings
    defaultSupplier: '',
    defaultPaymentTerms: 'Net 30',
    taxRate: 8.5,
    enableInventoryTracking: true,
    enableBarcodeScanning: false,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pharmaCover_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        setLastSaved(new Date(localStorage.getItem('pharmaCover_settings_lastSaved') || Date.now()));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleSettingsChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      localStorage.setItem('pharmaCover_settings', JSON.stringify(settings));
      localStorage.setItem('pharmaCover_settings_lastSaved', new Date().toISOString());
      
      setLastSaved(new Date());
      setHasChanges(false);
      
      toast({ 
        title: "Settings saved successfully!", 
        description: "Your configuration has been updated."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ 
        title: "Error saving settings", 
        description: "Failed to save configuration",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      systemName: 'PharmaCover System',
      systemVersion: '1.0.0',
      companyName: 'PharmaCare Solutions',
      companyAddress: '123 Medical District, Healthcare City',
      timezone: 'UTC-05:00',
      dateFormat: 'YYYY-MM-DD',
      currencySymbol: '$',
      language: 'en',
      emailNotifications: true,
      smsNotifications: false,
      expiryAlerts: true,
      lowStockAlerts: true,
      expiryThresholdDays: 30,
      lowStockThreshold: 10,
      sessionTimeoutMinutes: 60,
      passwordMinLength: 8,
      requirePasswordComplexity: true,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      autoBackup: true,
      backupInterval: 'daily',
      dataRetentionDays: 365,
      theme: 'light',
      recordsPerPage: 20,
      showAdvancedFeatures: false,
      compactMode: false,
      defaultSupplier: '',
      defaultPaymentTerms: 'Net 30',
      taxRate: 8.5,
      enableInventoryTracking: true,
      enableBarcodeScanning: false,
    });
    setHasChanges(true);
    toast({ title: "Settings reset to defaults" });
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    return lastSaved.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure your pharmaceutical management system</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {formatLastSaved()}
            </div>
          )}
          {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Configuration Management</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading || !hasChanges}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Globe className="w-5 h-5" />
                General Configuration
              </CardTitle>
              <CardDescription>Basic system information and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingsChange('systemName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemVersion">System Version</Label>
                  <Input
                    id="systemVersion"
                    value={settings.systemVersion}
                    onChange={(e) => handleSettingsChange('systemVersion', e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => handleSettingsChange('companyAddress', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingsChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-05:00">Eastern Time (UTC-05:00)</SelectItem>
                      <SelectItem value="UTC-06:00">Central Time (UTC-06:00)</SelectItem>
                      <SelectItem value="UTC-07:00">Mountain Time (UTC-07:00)</SelectItem>
                      <SelectItem value="UTC-08:00">Pacific Time (UTC-08:00)</SelectItem>
                      <SelectItem value="UTC+00:00">GMT (UTC+00:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingsChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Select value={settings.currencySymbol} onValueChange={(value) => handleSettingsChange('currencySymbol', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (USD)</SelectItem>
                      <SelectItem value="€">€ (EUR)</SelectItem>
                      <SelectItem value="£">£ (GBP)</SelectItem>
                      <SelectItem value="¥">¥ (JPY)</SelectItem>
                      <SelectItem value="₹">₹ (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingsChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-yellow-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alerts and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingsChange('smsNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="expiryAlerts">Medicine Expiry Alerts</Label>
                    <p className="text-sm text-gray-500">Alert when medicines are nearing expiry</p>
                  </div>
                  <Switch
                    id="expiryAlerts"
                    checked={settings.expiryAlerts}
                    onCheckedChange={(checked) => handleSettingsChange('expiryAlerts', checked)}
                  />
                </div>
                
                {settings.expiryAlerts && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="expiryThresholdDays">Alert Threshold (Days)</Label>
                    <Input
                      id="expiryThresholdDays"
                      type="number"
                      min="1"
                      max="365"
                      value={settings.expiryThresholdDays}
                      onChange={(e) => handleSettingsChange('expiryThresholdDays', parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-500">Alert when inventory is running low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onCheckedChange={(checked) => handleSettingsChange('lowStockAlerts', checked)}
                  />
                </div>
                
                {settings.lowStockAlerts && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      min="1"
                      max="1000"
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleSettingsChange('lowStockThreshold', parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>Manage authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min="5"
                    max="480"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => handleSettingsChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="4"
                    max="32"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingsChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingsChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="requirePasswordComplexity">Require Complex Passwords</Label>
                    <p className="text-sm text-gray-500">Enforce uppercase, lowercase, numbers, and symbols</p>
                  </div>
                  <Switch
                    id="requirePasswordComplexity"
                    checked={settings.requirePasswordComplexity}
                    onCheckedChange={(checked) => handleSettingsChange('requirePasswordComplexity', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for user logins</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingsChange('twoFactorAuth', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Database className="w-5 h-5" />
                Database Management
              </CardTitle>
              <CardDescription>Configure backup and data retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-gray-500">Enable scheduled database backups</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingsChange('autoBackup', checked)}
                  />
                </div>
                
                {settings.autoBackup && (
                  <>
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="backupInterval">Backup Interval</Label>
                      <Select value={settings.backupInterval} onValueChange={(value) => handleSettingsChange('backupInterval', value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Data Retention Period (Days)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    min="30"
                    max="3650"
                    value={settings.dataRetentionDays}
                    onChange={(e) => handleSettingsChange('dataRetentionDays', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500">How long to keep historical data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Eye className="w-5 h-5" />
                Display Preferences
              </CardTitle>
              <CardDescription>Customize the user interface and display options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingsChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recordsPerPage">Records Per Page</Label>
                  <Select 
                    value={settings.recordsPerPage.toString()} 
                    onValueChange={(value) => handleSettingsChange('recordsPerPage', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="showAdvancedFeatures">Show Advanced Features</Label>
                    <p className="text-sm text-gray-500">Display advanced functionality and options</p>
                  </div>
                  <Switch
                    id="showAdvancedFeatures"
                    checked={settings.showAdvancedFeatures}
                    onCheckedChange={(checked) => handleSettingsChange('showAdvancedFeatures', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <p className="text-sm text-gray-500">Use a more compact interface layout</p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingsChange('compactMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <FileText className="w-5 h-5" />
                Business Configuration
              </CardTitle>
              <CardDescription>Configure business rules and operational settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultSupplier">Default Supplier</Label>
                  <Input
                    id="defaultSupplier"
                    value={settings.defaultSupplier}
                    onChange={(e) => handleSettingsChange('defaultSupplier', e.target.value)}
                    placeholder="Enter default supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                  <Select value={settings.defaultPaymentTerms} onValueChange={(value) => handleSettingsChange('defaultPaymentTerms', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingsChange('taxRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="enableInventoryTracking">Inventory Tracking</Label>
                    <p className="text-sm text-gray-500">Enable detailed inventory tracking</p>
                  </div>
                  <Switch
                    id="enableInventoryTracking"
                    checked={settings.enableInventoryTracking}
                    onCheckedChange={(checked) => handleSettingsChange('enableInventoryTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="enableBarcodeScanning">Barcode Scanning</Label>
                    <p className="text-sm text-gray-500">Enable barcode scanning for medicines</p>
                  </div>
                  <Switch
                    id="enableBarcodeScanning"
                    checked={settings.enableBarcodeScanning}
                    onCheckedChange={(checked) => handleSettingsChange('enableBarcodeScanning', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Online</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Current User</p>
              <p className="text-gray-600">{user?.name} ({user?.role})</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Last Login</p>
              <p className="text-gray-600">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
