
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
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
  { id: 'medicines', label: 'Medicines', icon: Package, badge: null },
  { id: 'stores', label: 'Medical Stores', icon: Building2, badge: null },
  { id: 'supplies', label: 'Supply Records', icon: Truck, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'reports', label: 'Reports', icon: FileText, badge: 'New' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '3' },
  { id: 'users', label: 'Users', icon: Users, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50",
        "lg:relative lg:top-0 lg:h-full lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
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
