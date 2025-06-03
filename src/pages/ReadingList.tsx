
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Edit, Trash2, Star, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: 'to-read' | 'reading' | 'completed';
  rating: number;
  notes: string;
  pages: number;
  currentPage: number;
  startDate?: string;
  endDate?: string;
  addedAt: Date;
}

const ReadingList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Tecnologia',
      status: 'reading',
      rating: 0,
      notes: 'Excelente livro sobre boas práticas de programação',
      pages: 464,
      currentPage: 150,
      startDate: '2024-05-01',
      addedAt: new Date('2024-05-01')
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Desenvolvimento Pessoal',
      status: 'completed',
      rating: 5,
      notes: 'Transformador! Mudou minha perspectiva sobre formação de hábitos.',
      pages: 320,
      currentPage: 320,
      startDate: '2024-04-01',
      endDate: '2024-04-20',
      addedAt: new Date('2024-04-01')
    },
    {
      id: '3',
      title: 'The Psychology of Programming',
      author: 'Gerald M. Weinberg',
      genre: 'Tecnologia',
      status: 'to-read',
      rating: 0,
      notes: '',
      pages: 288,
      currentPage: 0,
      addedAt: new Date('2024-06-01')
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    pages: 0,
    notes: ''
  });

  const genres = Array.from(new Set(books.map(book => book.genre))).filter(Boolean);

  const filteredBooks = books.filter(book => 
    !selectedStatus || book.status === selectedStatus
  );

  const handleSaveBook = () => {
    if (!newBook.title || !newBook.author) return;

    if (editingBook) {
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...newBook }
          : book
      ));
    } else {
      const book: Book = {
        id: Date.now().toString(),
        ...newBook,
        status: 'to-read',
        rating: 0,
        currentPage: 0,
        addedAt: new Date()
      };
      setBooks([...books, book]);
    }

    setNewBook({ title: '', author: '', genre: '', pages: 0, notes: '' });
    setEditingBook(null);
    setIsDialogOpen(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      pages: book.pages,
      notes: book.notes
    });
    setIsDialogOpen(true);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleStatusChange = (bookId: string, status: 'to-read' | 'reading' | 'completed') => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        const updates: Partial<Book> = { status };
        
        if (status === 'reading' && book.status === 'to-read') {
          updates.startDate = new Date().toISOString().split('T')[0];
        } else if (status === 'completed') {
          updates.endDate = new Date().toISOString().split('T')[0];
          updates.currentPage = book.pages;
        }
        
        return { ...book, ...updates };
      }
      return book;
    }));
  };

  const handleProgressUpdate = (bookId: string, currentPage: number) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, currentPage: Math.min(currentPage, book.pages) }
        : book
    ));
  };

  const handleRatingChange = (bookId: string, rating: number) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, rating } : book
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'to-read': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'reading': return 'Lendo';
      case 'to-read': return 'Para ler';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-pink-900">Lista de Leitura</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Livro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-pink-900">
                {editingBook ? 'Editar Livro' : 'Adicionar Livro'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  placeholder="Título do livro"
                />
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  placeholder="Nome do autor"
                />
              </div>
              <div>
                <Label htmlFor="genre">Gênero</Label>
                <Input
                  id="genre"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                  placeholder="Ex: Ficção, Tecnologia, Biografia..."
                />
              </div>
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={newBook.pages || ''}
                  onChange={(e) => setNewBook({...newBook, pages: parseInt(e.target.value) || 0})}
                  placeholder="Número de páginas"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={newBook.notes}
                  onChange={(e) => setNewBook({...newBook, notes: e.target.value})}
                  placeholder="Suas notas sobre o livro..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveBook} className="w-full bg-pink-500 hover:bg-pink-600">
                {editingBook ? 'Atualizar' : 'Adicionar'} Livro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedStatus === '' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('')}
          className={selectedStatus === '' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
        >
          Todos
        </Button>
        <Button
          variant={selectedStatus === 'to-read' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('to-read')}
          className={selectedStatus === 'to-read' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
        >
          Para ler
        </Button>
        <Button
          variant={selectedStatus === 'reading' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('reading')}
          className={selectedStatus === 'reading' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
        >
          Lendo
        </Button>
        <Button
          variant={selectedStatus === 'completed' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('completed')}
          className={selectedStatus === 'completed' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-300 text-pink-700 hover:bg-pink-100'}
        >
          Concluídos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const progress = book.pages > 0 ? (book.currentPage / book.pages) * 100 : 0;
          
          return (
            <Card key={book.id} className="border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-pink-900 text-lg">{book.title}</CardTitle>
                    <p className="text-pink-600 text-sm">{book.author}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getStatusColor(book.status)}>
                        {getStatusText(book.status)}
                      </Badge>
                      {book.genre && (
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                          {book.genre}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBook(book)}
                      className="border-pink-300 text-pink-700 hover:bg-pink-100"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBook(book.id)}
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
                    <Label htmlFor={`status-${book.id}`}>Status</Label>
                    <Select 
                      value={book.status} 
                      onValueChange={(value: 'to-read' | 'reading' | 'completed') => 
                        handleStatusChange(book.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-read">Para ler</SelectItem>
                        <SelectItem value="reading">Lendo</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {book.status === 'reading' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Progresso</Label>
                        <span className="text-sm text-pink-700">
                          {book.currentPage}/{book.pages}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <Input
                        type="number"
                        min="0"
                        max={book.pages}
                        value={book.currentPage}
                        onChange={(e) => handleProgressUpdate(book.id, parseInt(e.target.value) || 0)}
                        placeholder="Página atual"
                      />
                    </div>
                  )}

                  {book.status === 'completed' && (
                    <div>
                      <Label>Avaliação</Label>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRatingChange(book.id, star)}
                            className="p-1"
                          >
                            <Star 
                              className={`h-4 w-4 ${
                                star <= book.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {book.startDate && (
                    <div className="flex items-center text-sm text-pink-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Iniciado: {new Date(book.startDate).toLocaleDateString()}
                    </div>
                  )}

                  {book.endDate && (
                    <div className="flex items-center text-sm text-pink-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Concluído: {new Date(book.endDate).toLocaleDateString()}
                    </div>
                  )}

                  {book.notes && (
                    <div>
                      <Label>Notas</Label>
                      <p className="text-sm text-pink-600 mt-1">{book.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-pink-300 mx-auto mb-4" />
            <p className="text-pink-600">
              {selectedStatus ? 'Nenhum livro encontrado nesta categoria' : 'Nenhum livro adicionado ainda'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReadingList;
