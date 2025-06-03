
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
    <div className="w-64 bg-pink-50 border-r border-pink-200 flex flex-col">
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-pink-200 text-pink-800">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-pink-900">Julia Pena</h2>
            <p className="text-sm text-pink-600">Personal Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-pink-200 text-pink-900' 
                      : 'text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-pink-200">
        <Button 
          onClick={logout}
          variant="outline"
          className="w-full border-pink-300 text-pink-700 hover:bg-pink-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};
