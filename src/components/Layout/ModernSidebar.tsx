
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
  User,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/home', icon: Home, label: t('home') },
    { path: '/calendar', icon: Calendar, label: t('calendar') },
    { path: '/notes', icon: FileText, label: t('notes') },
    { path: '/habits', icon: CheckSquare, label: t('habits') },
    { path: '/action-plan', icon: Target, label: t('actionPlan') },
    { path: '/reading-list', icon: BookOpen, label: t('readingList') },
    { path: '/notebook', icon: NotebookPen, label: t('notebook') },
  ];

  return (
    <aside className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  {user?.email || ''}
                </span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <Avatar className="h-8 w-8 mx-auto">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-6 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent z-10",
          "flex items-center justify-center"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-lg transition-colors group",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center px-2 py-2" : "justify-start px-3 py-2"
          )}
          title={isCollapsed ? (theme === 'dark' ? t('light') : t('dark')) : undefined}
        >
          {theme === 'dark' ? (
            <Sun className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          ) : (
            <Moon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          )}
          {!isCollapsed && (
            <span>{theme === 'dark' ? t('light') : t('dark')}</span>
          )}
        </Button>

        {/* Language Toggle */}
        <Button
          variant="ghost"
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className={cn(
            "w-full flex items-center text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center px-2 py-2" : "justify-start px-3 py-2"
          )}
          title={isCollapsed ? (language === 'pt' ? 'EN' : 'PT') : undefined}
        >
          <span className={cn("text-xs font-bold border border-sidebar-border rounded px-1.5 py-0.5", !isCollapsed && "mr-3")}>
            {language === 'pt' ? 'EN' : 'PT'}
          </span>
          {!isCollapsed && (
            <span>{language === 'pt' ? 'English' : 'Português'}</span>
          )}
        </Button>

        {/* Settings */}
        <Link
          to="/settings"
          className={cn(
            "flex items-center text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors",
            isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"
          )}
          title={isCollapsed ? t('settings') : undefined}
        >
          <Settings className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>{t('settings')}</span>}
        </Link>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full flex items-center text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center px-2 py-2" : "justify-start px-3 py-2"
          )}
          title={isCollapsed ? t('logout') : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>{t('logout')}</span>}
        </Button>
      </div>
    </aside>
  );
};
