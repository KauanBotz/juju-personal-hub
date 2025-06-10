
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  Target, 
  CheckSquare, 
  BookOpen, 
  NotebookPen, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { path: '/home', icon: Home, label: t('home') },
    { path: '/calendar', icon: Calendar, label: t('calendar') },
    { path: '/notes', icon: FileText, label: t('notes') },
    { path: '/habits', icon: CheckSquare, label: t('habits') },
    { path: '/action-plan', icon: Target, label: t('actionPlan') },
    { path: '/reading-list', icon: BookOpen, label: t('readingList') },
    { path: '/notebook', icon: NotebookPen, label: t('notebook') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <aside className="w-20 bg-sidebar text-sidebar-foreground shadow-lg flex flex-col justify-between">
      {/* Avatar + collapse hint */}
      <div className="flex flex-col items-center py-6 space-y-4">
        <Avatar className="ring-2 ring-sidebar-ring">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-sidebar-foreground truncate w-full text-center">
          {user?.email?.split('@')[0] || 'Usuário'}
        </p>
      </div>

      {/* Ícones do menu */}
      <nav className="flex-1 flex flex-col items-center space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200
                ${isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
              `}
              title={item.label}
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        })}
      </nav>

      {/* Logout + settings extra */}
      <div className="flex flex-col items-center pb-6 space-y-2">
        <Button
          onClick={signOut}
          variant="ghost"
          className="p-2 rounded-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title={t('logout')}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
    </aside>
  );
};
