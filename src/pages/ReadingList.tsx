
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const ReadingList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BookOpen className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-900">Lista de Leitura</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pink-900">Seus Livros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pink-600">
            Lista de leitura em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingList;
