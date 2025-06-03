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
  const { logout, user } = useAuth();
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
    <aside className="w-20 bg-white shadow-lg flex flex-col justify-between">
      {/* Avatar + collapse hint */}
      <div className="flex flex-col items-center py-6 space-y-4">
        <Avatar className="ring-2 ring-pink-300">
          <AvatarFallback className="bg-pink-200 text-pink-800">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-pink-600 truncate w-full text-center">
          {'Júlia Pena'}
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
                  ? 'bg-pink-100 text-pink-600 shadow-md' 
                  : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'}
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
          onClick={logout}
          variant="ghost"
          className="p-2 rounded-full text-pink-400 hover:bg-pink-50 hover:text-pink-600"
          title={t('logout')}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
    </aside>
  );
};
