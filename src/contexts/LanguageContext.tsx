
import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navegação
    login: 'Login',
    home: 'Início',
    calendar: 'Calendário',
    notes: 'Notas',
    habits: 'Hábitos',
    actionPlan: 'Plano de Ação',
    readingList: 'Lista de Leitura',
    notebook: 'Caderno',
    settings: 'Configurações',
    welcome: 'Bem-vinda',
    logout: 'Sair',
    
    // Geral
    title: 'Título',
    description: 'Descrição',
    category: 'Categoria',
    priority: 'Prioridade',
    status: 'Status',
    date: 'Data',
    time: 'Horário',
    search: 'Buscar',
    all: 'Todas',
    create: 'Criar',
    update: 'Atualizar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    add: 'Adicionar',
    remove: 'Remover',
    
    // Prioridades
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
    
    // Status
    completed: 'Concluído',
    inProgress: 'Em progresso',
    notStarted: 'Não iniciado',
    active: 'Ativo',
    paused: 'Pausado',
    
    // Calendário
    newEvent: 'Novo Evento',
    editEvent: 'Editar Evento',
    eventTitlePlaceholder: 'Digite o título do evento',
    eventDescriptionPlaceholder: 'Descrição do evento',
    eventsFor: 'Eventos para',
    noEventsForDate: 'Nenhum evento para esta data',
    
    // Notas
    newNote: 'Nova Nota',
    editNote: 'Editar Nota',
    noteTitlePlaceholder: 'Título da nota',
    noteContentPlaceholder: 'Escreva sua nota aqui...',
    categoryPlaceholder: 'Ex: Trabalho, Pessoal...',
    searchNotes: 'Buscar notas...',
    noNotesFound: 'Nenhuma nota encontrada',
    noNotesCreated: 'Nenhuma nota criada ainda',
    updated: 'Atualizada',
    
    // Plano de Ação
    newGoal: 'Novo Objetivo',
    editGoal: 'Editar Objetivo',
    goal: 'Objetivo',
    goals: 'Objetivos',
    goalTitlePlaceholder: 'Título do objetivo',
    detailedDescription: 'Descrição detalhada',
    targetDate: 'Data Alvo',
    progress: 'Progresso',
    tasks: 'Tarefas',
    newTask: 'Nova Tarefa',
    addTask: 'Adicionar Tarefa',
    enterTask: 'Digite a tarefa...',
    target: 'Meta',
    noTasksAdded: 'Nenhuma tarefa adicionada',
    noGoalsCreated: 'Nenhum objetivo criado ainda',
    
    // Hábitos
    newHabit: 'Novo Hábito',
    editHabit: 'Editar Hábito',
    habit: 'Hábito',
    habits: 'Hábitos',
    habitTitlePlaceholder: 'Nome do hábito',
    habitDescriptionPlaceholder: 'Descrição do hábito',
    frequency: 'Frequência',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    streak: 'Sequência',
    days: 'dias',
    markCompleted: 'Marcar como concluído',
    noHabitsCreated: 'Nenhum hábito criado ainda',
    
    // Lista de Leitura
    newBook: 'Novo Livro',
    editBook: 'Editar Livro',
    book: 'Livro',
    books: 'Livros',
    bookTitlePlaceholder: 'Título do livro',
    author: 'Autor',
    authorPlaceholder: 'Nome do autor',
    pages: 'Páginas',
    currentPage: 'Página atual',
    toRead: 'Para ler',
    reading: 'Lendo',
    read: 'Lido',
    noBooksAdded: 'Nenhum livro adicionado ainda',
    
    // Caderno
    newPage: 'Nova Página',
    editPage: 'Editar Página',
    page: 'Página',
    pages: 'Páginas',
    pageTitlePlaceholder: 'Título da página',
    pageContentPlaceholder: 'Escreva o conteúdo da página...',
    noPagesCreated: 'Nenhuma página criada ainda',
    
    // Configurações
    language: 'Idioma',
    portuguese: 'Português',
    english: 'Inglês',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    notifications: 'Notificações',
    emailNotifications: 'Notificações por email',
    pushNotifications: 'Notificações push',
    profile: 'Perfil',
    name: 'Nome',
    email: 'Email',
    changePassword: 'Alterar senha',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar senha',
    
    // Resumo do dia
    dailySummary: 'Resumo do Dia',
    pendingTasks: 'Tarefas Pendentes',
    habitsToday: 'Hábitos Hoje',
    appointments: 'Compromissos',
    
    // Login
    loginTitle: 'Bem-vinda de volta!',
    loginSubtitle: 'Entre na sua conta para continuar',
    username: 'Nome de usuário',
    password: 'Senha',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu a senha?',
    loginButton: 'Entrar',
    
    // Home
    homeWelcome: 'Bem-vinda ao seu hub pessoal de produtividade',
    manageAppointments: 'Gerencie seus compromissos',
    noteIdeas: 'Anote suas ideias',
    trackHabits: 'Acompanhe seus hábitos',
    organizeGoals: 'Organize seus objetivos',
    readingListDesc: 'Lista de leituras',
    personalNotebook: 'Seu caderno pessoal'
  },
  en: {
    // Navigation
    login: 'Login',
    home: 'Home',
    calendar: 'Calendar',
    notes: 'Notes',
    habits: 'Habits',
    actionPlan: 'Action Plan',
    readingList: 'Reading List',
    notebook: 'Notebook',
    settings: 'Settings',
    welcome: 'Welcome',
    logout: 'Logout',
    
    // General
    title: 'Title',
    description: 'Description',
    category: 'Category',
    priority: 'Priority',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    search: 'Search',
    all: 'All',
    create: 'Create',
    update: 'Update',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    remove: 'Remove',
    
    // Priorities
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Status
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    active: 'Active',
    paused: 'Paused',
    
    // Calendar
    newEvent: 'New Event',
    editEvent: 'Edit Event',
    eventTitlePlaceholder: 'Enter event title',
    eventDescriptionPlaceholder: 'Event description',
    eventsFor: 'Events for',
    noEventsForDate: 'No events for this date',
    
    // Notes
    newNote: 'New Note',
    editNote: 'Edit Note',
    noteTitlePlaceholder: 'Note title',
    noteContentPlaceholder: 'Write your note here...',
    categoryPlaceholder: 'e.g., Work, Personal...',
    searchNotes: 'Search notes...',
    noNotesFound: 'No notes found',
    noNotesCreated: 'No notes created yet',
    updated: 'Updated',
    
    // Action Plan
    newGoal: 'New Goal',
    editGoal: 'Edit Goal',
    goal: 'Goal',
    goals: 'Goals',
    goalTitlePlaceholder: 'Goal title',
    detailedDescription: 'Detailed description',
    targetDate: 'Target Date',
    progress: 'Progress',
    tasks: 'Tasks',
    newTask: 'New Task',
    addTask: 'Add Task',
    enterTask: 'Enter task...',
    target: 'Target',
    noTasksAdded: 'No tasks added',
    noGoalsCreated: 'No goals created yet',
    
    // Habits
    newHabit: 'New Habit',
    editHabit: 'Edit Habit',
    habit: 'Habit',
    habits: 'Habits',
    habitTitlePlaceholder: 'Habit name',
    habitDescriptionPlaceholder: 'Habit description',
    frequency: 'Frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    streak: 'Streak',
    days: 'days',
    markCompleted: 'Mark as completed',
    noHabitsCreated: 'No habits created yet',
    
    // Reading List
    newBook: 'New Book',
    editBook: 'Edit Book',
    book: 'Book',
    books: 'Books',
    bookTitlePlaceholder: 'Book title',
    author: 'Author',
    authorPlaceholder: 'Author name',
    pages: 'Pages',
    currentPage: 'Current page',
    toRead: 'To Read',
    reading: 'Reading',
    read: 'Read',
    noBooksAdded: 'No books added yet',
    
    // Notebook
    newPage: 'New Page',
    editPage: 'Edit Page',
    page: 'Page',
    pages: 'Pages',
    pageTitlePlaceholder: 'Page title',
    pageContentPlaceholder: 'Write page content...',
    noPagesCreated: 'No pages created yet',
    
    // Settings
    language: 'Language',
    portuguese: 'Portuguese',
    english: 'English',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    notifications: 'Notifications',
    emailNotifications: 'Email notifications',
    pushNotifications: 'Push notifications',
    profile: 'Profile',
    name: 'Name',
    email: 'Email',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    
    // Daily Summary
    dailySummary: 'Daily Summary',
    pendingTasks: 'Pending Tasks',
    habitsToday: 'Habits Today',
    appointments: 'Appointments',
    
    // Login
    loginTitle: 'Welcome back!',
    loginSubtitle: 'Sign in to your account to continue',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign In',
    
    // Home
    homeWelcome: 'Welcome to your personal productivity hub',
    manageAppointments: 'Manage your appointments',
    noteIdeas: 'Note your ideas',
    trackHabits: 'Track your habits',
    organizeGoals: 'Organize your goals',
    readingListDesc: 'Reading list',
    personalNotebook: 'Your personal notebook'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
