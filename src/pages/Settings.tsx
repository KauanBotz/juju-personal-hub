
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Configurações</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pink-900">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-pink-900">Tema Escuro</h3>
              <p className="text-sm text-pink-600">Alterne entre tema claro e escuro</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-pink-900">Idioma</h3>
              <p className="text-sm text-pink-600">Escolha seu idioma preferido</p>
            </div>
            <div className="space-x-2">
              <Button
                size="sm"
                variant={language === 'pt' ? 'default' : 'outline'}
                onClick={() => setLanguage('pt')}
                className={language === 'pt' ? 'bg-pink-500 hover:bg-pink-600' : ''}
              >
                PT
              </Button>
              <Button
                size="sm"
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-pink-500 hover:bg-pink-600' : ''}
              >
                EN
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
