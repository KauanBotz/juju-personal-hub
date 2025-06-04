import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Target, CheckSquare, BookOpen, NotebookPen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const API_BASE = 'http://localhost:3000';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const [summary, setSummary] = useState({ pendingTasks: 0, habitsToday: 0, appointments: 0 });

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/home`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    };
    load();
  }, []);

  const quickAccess = [
    { path: '/calendar', icon: Calendar, title: t('calendar'), description: t('manageAppointments') },
    { path: '/notes', icon: FileText, title: t('notes'), description: t('noteIdeas') },
    { path: '/habits', icon: CheckSquare, title: t('habits'), description: t('trackHabits') },
    { path: '/action-plan', icon: Target, title: t('actionPlan'), description: t('organizeGoals') },
    { path: '/reading-list', icon: BookOpen, title: t('readingList'), description: t('readingListDesc') },
    { path: '/notebook', icon: NotebookPen, title: t('notebook'), description: t('personalNotebook') },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-2">
          {t('welcome')}, Julia! 💕
        </h1>
        <p className="text-pink-600 text-sm sm:text-base">
          {t('homeWelcome')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {quickAccess.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Card className="hover:shadow-lg transition-shadow border-pink-200 hover:border-pink-300 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 shrink-0" />
                    <div className="min-w-0">
                      <CardTitle className="text-pink-900 text-base sm:text-lg break-words">{item.title}</CardTitle>
                      <CardDescription className="text-pink-600 text-sm break-words">
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
          <CardTitle className="text-pink-900 text-lg sm:text-xl">{t('dailySummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-pink-700">{summary.pendingTasks}</p>
              <p className="text-pink-600 text-sm sm:text-base">{t('pendingTasks')}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-pink-700">{summary.habitsToday}</p>
              <p className="text-pink-600 text-sm sm:text-base">{t('habitsToday')}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-pink-700">{summary.appointments}</p>
              <p className="text-pink-600 text-sm sm:text-base">{t('appointments')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;