
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Target, CheckSquare, BookOpen, NotebookPen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const quickAccess = [
    { path: '/calendar', icon: Calendar, title: t('calendar'), description: 'Gerencie seus compromissos' },
    { path: '/notes', icon: FileText, title: t('notes'), description: 'Anote suas ideias' },
    { path: '/habits', icon: CheckSquare, title: t('habits'), description: 'Acompanhe seus hábitos' },
    { path: '/action-plan', icon: Target, title: t('actionPlan'), description: 'Organize seus objetivos' },
    { path: '/reading-list', icon: BookOpen, title: t('readingList'), description: 'Lista de leituras' },
    { path: '/notebook', icon: NotebookPen, title: t('notebook'), description: 'Seu caderno pessoal' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pink-900 mb-2">
          {t('welcome')}, Julia! 💕
        </h1>
        <p className="text-pink-600">
          Bem-vinda ao seu hub pessoal de produtividade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccess.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Card className="hover:shadow-lg transition-shadow border-pink-200 hover:border-pink-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-pink-500" />
                    <div>
                      <CardTitle className="text-pink-900">{item.title}</CardTitle>
                      <CardDescription className="text-pink-600">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-900">Resumo do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-pink-700">3</p>
              <p className="text-pink-600">Tarefas Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-700">5</p>
              <p className="text-pink-600">Hábitos Hoje</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-700">2</p>
              <p className="text-pink-600">Compromissos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
