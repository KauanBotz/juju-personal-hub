import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, Plus, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  status: 'active' | 'paused';
  created_at: string;
}

const Habits: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure frequency is properly typed
      const typedHabits = (data || []).map(habit => ({
        ...habit,
        frequency: habit.frequency as 'daily' | 'weekly' | 'monthly',
        status: habit.status as 'active' | 'paused'
      }));
      
      setHabits(typedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar hábitos",
        variant: "destructive"
      });
    }
  };

  const handleSaveHabit = async () => {
    if (!newHabit.title || !user) return;

    try {
      if (editingHabit) {
        const { error } = await supabase
          .from('habits')
          .update({
            title: newHabit.title,
            description: newHabit.description,
            frequency: newHabit.frequency
          })
          .eq('id', editingHabit.id);

        if (error) throw error;

        setHabits(habits.map(h => 
          h.id === editingHabit.id 
            ? { ...h, ...newHabit }
            : h
        ));
      } else {
        const { data, error } = await supabase
          .from('habits')
          .insert({
            title: newHabit.title,
            description: newHabit.description,
            frequency: newHabit.frequency,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        const typedData = {
          ...data,
          frequency: data.frequency as 'daily' | 'weekly' | 'monthly',
          status: data.status as 'active' | 'paused'
        };
        
        setHabits([typedData, ...habits]);
      }

      setNewHabit({ title: '', description: '', frequency: 'daily' });
      setEditingHabit(null);
      setIsDialogOpen(false);

      toast({
        title: "Sucesso",
        description: editingHabit ? "Hábito atualizado!" : "Hábito criado!"
      });
    } catch (error) {
      console.error('Error saving habit:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar hábito",
        variant: "destructive"
      });
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency
    });
    setIsDialogOpen(true);
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      
      setHabits(habits.filter(habit => habit.id !== habitId));
      toast({
        title: "Sucesso",
        description: "Hábito excluído!"
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir hábito",
        variant: "destructive"
      });
    }
  };

  const updateStreak = async (habitId: string, increment: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newStreak = Math.max(0, habit.streak + increment);
    
    try {
      const { error } = await supabase
        .from('habits')
        .update({ streak: newStreak })
        .eq('id', habitId);

      if (error) throw error;

      setHabits(habits.map(h => 
        h.id === habitId ? { ...h, streak: newStreak } : h
      ));
    } catch (error) {
      console.error('Error updating streak:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar sequência",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">{t('habits')}</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              {t('newHabit')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingHabit ? t('editHabit') : t('newHabit')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('title')}</Label>
                <Input
                  id="name"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  placeholder={t('habitTitlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('description')}</Label>
                <Input
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder={t('habitDescriptionPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="frequency">{t('frequency')}</Label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as 'daily' | 'weekly' | 'monthly'})}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="daily">{t('daily')}</option>
                  <option value="weekly">{t('weekly')}</option>
                  <option value="monthly">{t('monthly')}</option>
                </select>
              </div>
              <Button onClick={handleSaveHabit} className="w-full bg-primary hover:bg-primary">
                {editingHabit ? t('update') : t('create')} {t('habit')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <Card key={habit.id} className="border-primary">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-primary text-lg">{habit.title}</CardTitle>
                  <p className="text-primary text-sm">{habit.description}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditHabit(habit)}
                    className="border-primary text-primary hover:bg-primary"
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
                    <span className="text-sm text-primary">{t('streak')}</span>
                    <span className="text-sm font-semibold text-primary">
                      {habit.streak} {t('days')}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(habit.streak * 10, 100)} 
                    className="h-2"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStreak(habit.id, -1)}
                    disabled={habit.streak === 0}
                    className="border-primary text-primary hover:bg-primary"
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold text-primary">
                    {habit.streak}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => updateStreak(habit.id, 1)}
                    className="bg-primary hover:bg-primary"
                  >
                    +
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">
                    {t('frequency')}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {t(habit.frequency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-primary">{t('noHabitsCreated')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Habits;
