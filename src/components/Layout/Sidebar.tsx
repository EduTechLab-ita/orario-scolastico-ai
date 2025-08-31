import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'teachers', label: 'Docenti', icon: Users },
  { id: 'classes', label: 'Classi', icon: GraduationCap },
  { id: 'subjects', label: 'Materie', icon: BookOpen },
  { id: 'rooms', label: 'Aule', icon: MapPin },
  { id: 'schedule', label: 'Orario', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Impostazioni', icon: Settings }
];

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10",
                      isCollapsed ? "px-2" : "px-3",
                      isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                    )}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      isCollapsed ? "mx-auto" : "mr-3"
                    )} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>OrarioAI v1.0</p>
              <p>© 2025 EduTechLab</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}