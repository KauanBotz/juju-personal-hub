
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Ideias para o projeto',
      content: 'Implementar sistema de notificações\nMelhorar interface do usuário\nAdicionar modo escuro',
      category: 'Trabalho',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: 'Lista de compras',
      content: 'Frutas\nVerduras\nProdutos de limpeza\nCafé',
      category: 'Pessoal',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: ''
  });

  const categories = Array.from(new Set(notes.map(note => note.category))).filter(Boolean);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveNote = () => {
    if (!newNote.title) return;

    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...newNote, updatedAt: new Date() }
          : note
      ));
    } else {
      const note: Note = {
        id: Date.now().toString(),
        ...newNote,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([...notes, note]);
    }

    setNewNote({ title: '', content: '', category: '' });
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setIsDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-pink-900">Notas</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-pink-900">
                {editingNote ? 'Editar Nota' : 'Nova Nota'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Título da nota"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                  placeholder="Ex: Trabalho, Pessoal..."
                />
              </div>
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Escreva sua nota aqui..."
                  rows={6}
                />
              </div>
              <Button onClick={handleSaveNote} className="w-full bg-pink-500 hover:bg-pink-600">
                {editingNote ? 'Atualizar' : 'Criar'} Nota
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
          <Input
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-pink-200 focus:border-pink-400"
          />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-pink-900 text-lg">{note.title}</CardTitle>
                  {note.category && (
                    <Badge variant="secondary" className="mt-2 bg-pink-100 text-pink-700">
                      {note.category}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditNote(note)}
                    className="border-pink-300 text-pink-700 hover:bg-pink-100"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteNote(note.id)}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-pink-600 text-sm whitespace-pre-wrap line-clamp-4">
                {note.content}
              </p>
              <p className="text-pink-400 text-xs mt-3">
                Atualizada: {note.updatedAt.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-pink-300 mx-auto mb-4" />
            <p className="text-pink-600">
              {searchTerm || selectedCategory ? 'Nenhuma nota encontrada' : 'Nenhuma nota criada ainda'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;
