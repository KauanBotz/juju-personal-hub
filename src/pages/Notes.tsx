
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Notes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Notas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pink-900">Suas Anotações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pink-600">
            Sistema de notas em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;
