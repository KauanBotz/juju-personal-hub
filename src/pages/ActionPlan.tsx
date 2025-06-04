
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Plus, Edit, Trash2, CheckCircle, Clock, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  targetDate: string;
  progress: number;
  tasks: Task[];
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const ActionPlan: React.FC = () => {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newTask, setNewTask] = useState('');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetDate: ''
  });

  const categories = Array.from(new Set(goals.map(goal => goal.category))).filter(Boolean);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredGoals = goals.filter(goal => 
    !selectedCategory || goal.category === selectedCategory
  );

  const handleSaveGoal = () => {
    if (!newGoal.title) return;

    if (editingGoal) {
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { ...goal, ...newGoal }
          : goal
      ));
    } else {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        status: 'not-started',
        progress: 0,
        tasks: [],
        createdAt: new Date()
      };
      setGoals([...goals, goal]);
    }

    setNewGoal({ title: '', description: '', category: '', priority: 'medium', targetDate: '' });
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleAddTask = () => {
    if (!newTask || !selectedGoal) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      createdAt: new Date()
    };

    setGoals(goals.map(goal => 
      goal.id === selectedGoal.id
        ? { ...goal, tasks: [...goal.tasks, task] }
        : goal
    ));

    setNewTask('');
    setIsTaskDialogOpen(false);
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedTasks = updatedTasks.filter(task => task.completed).length;
        const progress = updatedTasks.length > 0 ? (completedTasks / updatedTasks.length) * 100 : 0;
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
        };
      }
      return goal;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">{t('actionPlan')}</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('newGoal')}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingGoal ? t('editGoal') : t('newGoal')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('title')}</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder={t('goalTitlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder={t('detailedDescription')}
                />
              </div>
              <div>
                <Label htmlFor="category">{t('category')}</Label>
                <Input
                  placeholder={t('categoryPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="priority">{t('priority')}</Label>
                <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal({...newGoal, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('low')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="high">{t('high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetDate">{t('targetDate')}</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                />
              </div>
              <Button onClick={handleSaveGoal} className="w-full bg-primary hover:bg-primary">
                {editingGoal ? t('update') : t('create')} {t('goal')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('')}
          className={selectedCategory === '' ? 'bg-primary hover:bg-primary' : 'border-primary text-primary hover:bg-primary'}
          size="sm"
        >
          {t('all')}
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-primary hover:bg-primary' : 'border-primary text-primary hover:bg-primary'}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className="border-primary">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-primary text-base sm:text-lg break-words">{goal.title}</CardTitle>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                      {goal.priority === 'high' ? t('high') : goal.priority === 'medium' ? t('medium') : t('low')}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)} variant="secondary">
                      {goal.status === 'completed' ? t('completed') : 
                       goal.status === 'in-progress' ? t('inProgress') : t('notStarted')}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditGoal(goal)}
                    className="border-primary text-primary hover:bg-primary"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-primary text-sm break-words">{goal.description}</p>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-primary">{t('progress')}</span>
                    <span className="text-sm font-semibold text-primary">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {goal.targetDate && (
                  <div className="flex items-center text-sm text-primary">
                    <Clock className="h-4 w-4 mr-2 shrink-0" />
                    <span className="break-words">{t('target')}: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-primary">{t('tasks')}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsTaskDialogOpen(true);
                      }}
                      className="border-primary text-primary hover:bg-primary"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(goal.id, task.id)}
                        />
                        <span className={`text-sm flex-1 break-words ${task.completed ? 'line-through text-primary' : 'text-primary'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {goal.tasks.length === 0 && (
                      <p className="text-primary text-sm">{t('noTasksAdded')}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">{t('addTask')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task">{t('newTask')}</Label>
              <Input
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder={t('enterTask')}
              />
            </div>
            <Button onClick={handleAddTask} className="w-full bg-primary hover:bg-primary">
              {t('addTask')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Flag className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-primary">{t('noGoalsCreated')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActionPlan;

