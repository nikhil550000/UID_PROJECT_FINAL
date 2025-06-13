
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Package, 
  Building2, 
  Truck, 
  BarChart3, 
  Settings,
  Users,
  FileText,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, requiredRole: null },
  { id: 'medicines', label: 'Medicines', icon: Package, badge: null, requiredRole: 'EMPLOYEE' },
  { id: 'stores', label: 'Medical Stores', icon: Building2, badge: null, requiredRole: 'EMPLOYEE' },
  { id: 'supplies', label: 'Supply Records', icon: Truck, badge: null, requiredRole: 'EMPLOYEE' },
  { id: 'orders', label: 'Order Management', icon: ShoppingCart, badge: null, requiredRole: 'EMPLOYEE' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null, requiredRole: 'EMPLOYEE' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: 'New', requiredRole: 'EMPLOYEE' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '3', requiredRole: 'EMPLOYEE' },
  { id: 'users', label: 'Users', icon: Users, badge: null, requiredRole: 'ADMIN' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null, requiredRole: 'ADMIN' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange, userRole }) => {
  // Filter menu items based on user role
  const getVisibleMenuItems = () => {
    return menuItems.filter(item => {
      if (!item.requiredRole) return true; // No role requirement
      if (userRole?.toUpperCase() === 'ADMIN') return true; // Admin can see everything
      return item.requiredRole === userRole?.toUpperCase(); // Match exact role requirement
    });
  };

  const visibleItems = getVisibleMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40",
        "lg:relative lg:top-0 lg:h-full lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 space-y-2">
          {/* Role indicator */}
          {userRole && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500">Logged in as:</span>
              <div className="font-medium text-sm capitalize">{userRole}</div>
            </div>
          )}
          
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  isActive && "bg-blue-50 text-blue-700 border-blue-200"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badge === 'New' ? 'default' : 'destructive'}
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
