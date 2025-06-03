
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

const ActionPlan: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Target className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Plano de Ação</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pink-900">Seus Objetivos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pink-600">
            Plano de ação em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionPlan;
