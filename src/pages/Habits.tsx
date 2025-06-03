
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, Plus, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  description: string;
  target: number;
  frequency: 'daily' | 'weekly';
  completions: { [date: string]: number };
  createdAt: Date;
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Beber água',
      description: 'Beber 8 copos de água por dia',
      target: 8,
      frequency: 'daily',
      completions: {
        '2024-06-03': 6,
        '2024-06-02': 8,
        '2024-06-01': 5
      },
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Exercícios',
      description: 'Fazer exercícios físicos',
      target: 1,
      frequency: 'daily',
      completions: {
        '2024-06-03': 1,
        '2024-06-02': 1,
        '2024-06-01': 0
      },
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Leitura',
      description: 'Ler por 30 minutos',
      target: 1,
      frequency: 'daily',
      completions: {
        '2024-06-03': 0,
        '2024-06-02': 1,
        '2024-06-01': 1
      },
      createdAt: new Date('2024-01-01')
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    target: 1,
    frequency: 'daily' as 'daily' | 'weekly'
  });

  const today = new Date().toISOString().split('T')[0];

  const getTodayCompletion = (habit: Habit) => {
    return habit.completions[today] || 0;
  };

  const getWeekProgress = (habit: Habit) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const completed = last7Days.filter(date => 
      (habit.completions[date] || 0) >= habit.target
    ).length;

    return (completed / 7) * 100;
  };

  const updateHabitCompletion = (habitId: string, increment: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const currentCompletion = getTodayCompletion(habit);
        const newCompletion = Math.max(0, currentCompletion + increment);
        return {
          ...habit,
          completions: {
            ...habit.completions,
            [today]: newCompletion
          }
        };
      }
      return habit;
    }));
  };

  const handleSaveHabit = () => {
    if (!newHabit.name) return;

    if (editingHabit) {
      setHabits(habits.map(habit => 
        habit.id === editingHabit.id 
          ? { ...habit, ...newHabit }
          : habit
      ));
    } else {
      const habit: Habit = {
        id: Date.now().toString(),
        ...newHabit,
        completions: {},
        createdAt: new Date()
      };
      setHabits([...habits, habit]);
    }

    setNewHabit({ name: '', description: '', target: 1, frequency: 'daily' });
    setEditingHabit(null);
    setIsDialogOpen(false);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description,
      target: habit.target,
      frequency: habit.frequency
    });
    setIsDialogOpen(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckSquare className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-pink-900">Hábitos</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-pink-900">
                {editingHabit ? 'Editar Hábito' : 'Novo Hábito'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Hábito</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="Ex: Beber água"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="Descrição do hábito"
                />
              </div>
              <div>
                <Label htmlFor="target">Meta Diária</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({...newHabit, target: parseInt(e.target.value) || 1})}
                />
              </div>
              <Button onClick={handleSaveHabit} className="w-full bg-pink-500 hover:bg-pink-600">
                {editingHabit ? 'Atualizar' : 'Criar'} Hábito
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const todayCompletion = getTodayCompletion(habit);
          const progressPercentage = (todayCompletion / habit.target) * 100;
          const weekProgress = getWeekProgress(habit);
          const isCompleted = todayCompletion >= habit.target;

          return (
            <Card key={habit.id} className="border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-pink-900 text-lg">{habit.name}</CardTitle>
                    <p className="text-pink-600 text-sm">{habit.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditHabit(habit)}
                      className="border-pink-300 text-pink-700 hover:bg-pink-100"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-pink-700">Hoje</span>
                      <span className="text-sm font-semibold text-pink-900">
                        {todayCompletion}/{habit.target}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(progressPercentage, 100)} 
                      className="h-2"
                    />
                    {isCompleted && (
                      <p className="text-green-600 text-sm mt-2 flex items-center">
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Meta atingida!
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateHabitCompletion(habit.id, -1)}
                      disabled={todayCompletion === 0}
                      className="border-pink-300 text-pink-700 hover:bg-pink-100"
                    >
                      -
                    </Button>
                    <span className="text-lg font-semibold text-pink-900">
                      {todayCompletion}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => updateHabitCompletion(habit.id, 1)}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      +
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-pink-700 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Últimos 7 dias
                      </span>
                      <span className="text-sm font-semibold text-pink-900">
                        {Math.round(weekProgress)}%
                      </span>
                    </div>
                    <Progress value={weekProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-pink-300 mx-auto mb-4" />
            <p className="text-pink-600">Nenhum hábito criado ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Habits;
