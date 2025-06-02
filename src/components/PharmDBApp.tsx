
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/auth/AuthContainer';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/Dashboard';
import MedicineManagement from '@/components/MedicineManagement';
import StoreManagement from '@/components/StoreManagement';
import SupplyManagement from '@/components/SupplyManagement';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PharmDBApp = () => {
  const { isAuthenticated, isLoading, user, hasAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // Role-based access control for different sections
  const getAccessibleContent = () => {
    // Check if user has access to the current tab
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'medicines':
        if (!hasAccess('employer')) {
          return <AccessDenied requiredRole="Employer or Admin" />;
        }
        return <MedicineManagement />;
      case 'stores':
        if (!hasAccess('employer')) {
          return <AccessDenied requiredRole="Employer or Admin" />;
        }
        return <StoreManagement />;
      case 'supplies':
        if (!hasAccess('employer')) {
          return <AccessDenied requiredRole="Employer or Admin" />;
        }
        return <SupplyManagement />;
      case 'analytics':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return <AnalyticsDashboard />;
      case 'reports':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600">Report generation features coming soon...</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alerts & Notifications</h2>
            <p className="text-gray-600">Alert management features coming soon...</p>
          </div>
        );
      case 'users':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
          userRole={user?.role}
        />
          <main className="flex-1 p-6">
          {getAccessibleContent()}
        </main>
      </div>
    </div>
  );
};

// Component to show when user doesn't have access
const AccessDenied: React.FC<{ requiredRole: string }> = ({ requiredRole }) => (
  <div className="p-8 text-center">
    <Alert className="max-w-md mx-auto">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Access Denied</strong><br />
        This section requires {requiredRole} privileges.
      </AlertDescription>
    </Alert>
  </div>
);

export default PharmDBApp;
