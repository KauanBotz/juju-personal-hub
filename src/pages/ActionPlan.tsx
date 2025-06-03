
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
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Aprender React Avançado',
      description: 'Dominar hooks avançados, context API e performance optimization',
      category: 'Desenvolvimento',
      priority: 'high',
      status: 'in-progress',
      targetDate: '2024-12-31',
      progress: 60,
      tasks: [
        { id: '1', title: 'Estudar useCallback e useMemo', completed: true, createdAt: new Date() },
        { id: '2', title: 'Implementar Context API', completed: true, createdAt: new Date() },
        { id: '3', title: 'Otimizar performance da aplicação', completed: false, createdAt: new Date() }
      ],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: 'Formar hábito de exercícios',
      description: 'Exercitar-se 5 vezes por semana por 3 meses',
      category: 'Saúde',
      priority: 'medium',
      status: 'in-progress',
      targetDate: '2024-09-30',
      progress: 40,
      tasks: [
        { id: '4', title: 'Definir rotina de exercícios', completed: true, createdAt: new Date() },
        { id: '5', title: 'Comprar equipamentos necessários', completed: false, createdAt: new Date() }
      ],
      createdAt: new Date('2024-02-01')
    }
  ]);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-pink-900">Plano de Ação</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-pink-900">
                {editingGoal ? 'Editar Objetivo' : 'Novo Objetivo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Título do objetivo"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Descrição detalhada"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  placeholder="Ex: Carreira, Saúde, Pessoal..."
                />
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal({...newGoal, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetDate">Data Alvo</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                />
              </div>
              <Button onClick={handleSaveGoal} className="w-full bg-pink-500 hover:bg-pink-600">
                {editingGoal ? 'Atualizar' : 'Criar'} Objetivo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('')}
          className={selectedCategory === '' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
        >
          Todas
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className="border-pink-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-pink-900 text-lg">{goal.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status === 'completed' ? 'Concluído' : 
                       goal.status === 'in-progress' ? 'Em progresso' : 'Não iniciado'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditGoal(goal)}
                    className="border-pink-300 text-pink-700 hover:bg-pink-100"
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
                <p className="text-pink-600 text-sm">{goal.description}</p>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-pink-700">Progresso</span>
                    <span className="text-sm font-semibold text-pink-900">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {goal.targetDate && (
                  <div className="flex items-center text-sm text-pink-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Meta: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-pink-700">Tarefas</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsTaskDialogOpen(true);
                      }}
                      className="border-pink-300 text-pink-700 hover:bg-pink-100"
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
                        <span className={`text-sm flex-1 ${task.completed ? 'line-through text-pink-400' : 'text-pink-700'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {goal.tasks.length === 0 && (
                      <p className="text-pink-400 text-sm">Nenhuma tarefa adicionada</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-pink-900">Adicionar Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task">Nova Tarefa</Label>
              <Input
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Digite a tarefa..."
              />
            </div>
            <Button onClick={handleAddTask} className="w-full bg-pink-500 hover:bg-pink-600">
              Adicionar Tarefa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Flag className="h-12 w-12 text-pink-300 mx-auto mb-4" />
            <p className="text-pink-600">Nenhum objetivo criado ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActionPlan;
