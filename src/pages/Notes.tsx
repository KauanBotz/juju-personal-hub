
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const Notes: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-900">{t('notes')}</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('newNote')}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-pink-900">
                {editingNote ? t('editNote') : t('newNote')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('title')}</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder={t('noteTitlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="category">{t('category')}</Label>
                <Input
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                  placeholder={t('categoryPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="content">{t('description')}</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder={t('noteContentPlaceholder')}
                  rows={6}
                />
              </div>
              <Button onClick={handleSaveNote} className="w-full bg-pink-500 hover:bg-pink-600">
                {editingNote ? t('update') : t('create')} {t('newNote')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
          <Input
            placeholder={t('searchNotes')}
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
            size="sm"
          >
            {t('all')}
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-pink-900 text-base sm:text-lg break-words">{note.title}</CardTitle>
                  {note.category && (
                    <Badge variant="secondary" className="mt-2 bg-pink-100 text-pink-700">
                      {note.category}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-1 shrink-0">
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
              <p className="text-pink-600 text-sm whitespace-pre-wrap line-clamp-4 break-words">
                {note.content}
              </p>
              <p className="text-pink-400 text-xs mt-3">
                {t('updated')}: {note.updatedAt.toLocaleDateString()}
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
              {searchTerm || selectedCategory ? t('noNotesFound') : t('noNotesCreated')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;
