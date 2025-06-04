
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, User, Bell, Palette, Download, Upload, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccentColor } from '@/contexts/AccentColorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { color, setColor } = useAccentColor();
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    habits: true,
    calendar: true,
    goals: false
  });
  const [profile, setProfile] = useState({
    name: 'Julia Pena',
    email: 'juliapena002@gmail.com',
    timezone: 'America/Sao_Paulo'
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportData = () => {
    // Simular exportação de dados
    console.log('Exportando dados...');
    alert('Dados exportados com sucesso!');
  };

  const handleImportData = () => {
    // Simular importação de dados
    console.log('Importando dados...');
    alert('Dados importados com sucesso!');
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      console.log('Resetando dados...');
      alert('Dados resetados com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pink-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select value={profile.timezone} onValueChange={(value) => handleProfileChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-pink-500 hover:bg-pink-600">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pink-900 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Personalização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Modo Escuro</Label>
                  <p className="text-sm text-pink-600">
                    Alternar entre modo claro e escuro
                  </p>
                </div>
                <Switch
                  id="theme"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <p className="text-sm text-pink-600 mb-2">
                  Selecione o idioma da interface
                </p>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cor do Tema</Label>
                <p className="text-sm text-pink-600 mb-3">
                  Personalize as cores do sistema
                </p>
                <div className="grid grid-cols-4 gap-3">
                <div
                    className={`w-12 h-12 bg-pink-500 rounded-lg border cursor-pointer ${color === 'pink' ? 'ring-2 ring-pink-700' : ''}`}
                    onClick={() => setColor('pink')}
                  ></div>
                  <div
                    className={`w-12 h-12 bg-purple-500 rounded-lg border cursor-pointer ${color === 'purple' ? 'ring-2 ring-purple-700' : ''}`}
                    onClick={() => setColor('purple')}
                  ></div>
                  <div
                    className={`w-12 h-12 bg-blue-500 rounded-lg border cursor-pointer ${color === 'blue' ? 'ring-2 ring-blue-700' : ''}`}
                    onClick={() => setColor('blue')}
                  ></div>
                  <div
                    className={`w-12 h-12 bg-green-500 rounded-lg border cursor-pointer ${color === 'green' ? 'ring-2 ring-green-700' : ''}`}
                    onClick={() => setColor('green')}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pink-900 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-pink-600">
                    Receber notificações importantes por email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <p className="text-sm text-pink-600">
                    Receber notificações no navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="habits-notifications">Lembretes de Hábitos</Label>
                  <p className="text-sm text-pink-600">
                    Receber lembretes para completar hábitos
                  </p>
                </div>
                <Switch
                  id="habits-notifications"
                  checked={notifications.habits}
                  onCheckedChange={(value) => handleNotificationChange('habits', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar-notifications">Eventos do Calendário</Label>
                  <p className="text-sm text-pink-600">
                    Notificações sobre eventos próximos
                  </p>
                </div>
                <Switch
                  id="calendar-notifications"
                  checked={notifications.calendar}
                  onCheckedChange={(value) => handleNotificationChange('calendar', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="goals-notifications">Progresso de Objetivos</Label>
                  <p className="text-sm text-pink-600">
                    Notificações sobre progresso de objetivos
                  </p>
                </div>
                <Switch
                  id="goals-notifications"
                  checked={notifications.goals}
                  onCheckedChange={(value) => handleNotificationChange('goals', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pink-900">Gerenciar Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-pink-900 mb-2">Backup de Dados</h3>
                <p className="text-sm text-pink-600 mb-4">
                  Exporte ou importe seus dados para fazer backup ou migrar para outro dispositivo.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button 
                    onClick={handleImportData}
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-100"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Dados
                  </Button>
                </div>
              </div>

              <div className="border-t border-pink-200 pt-6">
                <h3 className="font-semibold text-red-700 mb-2">Zona de Perigo</h3>
                <p className="text-sm text-red-600 mb-4">
                  Ações irreversíveis. Use com cuidado.
                </p>
                <Button 
                  onClick={handleResetData}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Resetar Todos os Dados
                </Button>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-medium text-pink-900 mb-2">Estatísticas de Uso</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-pink-600">Total de notas</p>
                    <p className="font-semibold text-pink-900">42</p>
                  </div>
                  <div>
                    <p className="text-pink-600">Eventos criados</p>
                    <p className="font-semibold text-pink-900">28</p>
                  </div>
                  <div>
                    <p className="text-pink-600">Hábitos ativos</p>
                    <p className="font-semibold text-pink-900">8</p>
                  </div>
                  <div>
                    <p className="text-pink-600">Objetivos concluídos</p>
                    <p className="font-semibold text-pink-900">12</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
