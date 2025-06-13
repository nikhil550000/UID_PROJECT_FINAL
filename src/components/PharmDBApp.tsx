
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/auth/AuthContainer';
import PharmaLanding from '@/components/PharmaLanding';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/Dashboard';
import MedicineManagement from '@/components/MedicineManagement';
import StoreManagement from '@/components/StoreManagement';
import SupplyManagement from '@/components/SupplyManagement';
import OrderManagement from '@/components/OrderManagement';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import ReportsManagement from '@/components/ReportsManagement';
import AlertsManagement from '@/components/AlertsManagement';
import UserManagement from '@/components/UserManagement';
import SettingsManagement from '@/components/SettingsManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PharmDBApp = () => {
  const { isAuthenticated, isLoading, user, hasAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show authentication form when requested
  if (showAuth && !isAuthenticated) {
    return <AuthContainer />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <PharmaLanding 
        onGetStarted={() => setShowAuth(true)}
        onLogin={() => setShowAuth(true)}
      />
    );
  }

  // Role-based access control for different sections
  const getAccessibleContent = () => {
    // Check if user has access to the current tab
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setActiveTab(page)} />;
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
      case 'orders':
        if (!hasAccess('employer')) {
          return <AccessDenied requiredRole="Employer or Admin" />;
        }
        return <OrderManagement />;
      case 'analytics':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return <AnalyticsDashboard />;      case 'reports':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return <ReportsManagement />;      case 'alerts':
        if (!hasAccess('employer')) {
          return <AccessDenied requiredRole="Employer or Admin" />;
        }
        return <AlertsManagement />;      case 'users':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return <UserManagement />;      case 'settings':
        if (!hasAccess('admin')) {
          return <AccessDenied requiredRole="Admin" />;
        }
        return <SettingsManagement />;
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
