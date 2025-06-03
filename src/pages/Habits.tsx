
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

const Habits: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CheckSquare className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Hábitos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pink-900">Acompanhamento de Hábitos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pink-600">
            Sistema de hábitos em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
