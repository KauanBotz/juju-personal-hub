import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NotebookPen, Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_BASE = 'http://localhost:3000';

interface NotebookPage {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

const Notebook: React.FC = () => {
  const [pages, setPages] = useState<NotebookPage[]>([
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<NotebookPage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [newPage, setNewPage] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(
          data.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          }))
        );
      }
    };
    load();
  }, []);

  const allTags = Array.from(new Set(pages.flatMap(page => page.tags))).sort();
  const categories = Array.from(new Set(pages.map(page => page.category))).filter(Boolean);

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || page.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const recentPages = pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  const handleSavePage = () => {
    if (!newPage.title) return;

    const tags = newPage.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    if (editingPage) {
      const updated = {
        ...editingPage,
        title: newPage.title,
        content: newPage.content,
        category: newPage.category,
        tags,
        updatedAt: new Date(),
      };
      fetch(`${API_BASE}/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        }),
      }).then(res => res.json()).then(() => {
        setPages(pages.map(page => page.id === editingPage.id ? updated : page));
      });
    } else {
      const page: NotebookPage = {
        id: Date.now().toString(),
        title: newPage.title,
        content: newPage.content,
        category: newPage.category,
        tags,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          createdAt: page.createdAt.toISOString(),
          updatedAt: page.updatedAt.toISOString(),
        }),
      }).then(res => res.json()).then(created => {
        created.createdAt = new Date(created.createdAt);
        created.updatedAt = new Date(created.updatedAt);
        setPages([...pages, created]);
      });
    }

    setNewPage({ title: '', content: '', category: '', tags: '' });
    setEditingPage(null);
    setIsDialogOpen(false);
  };

  const handleEditPage = (page: NotebookPage) => {
    setEditingPage(page);
    setNewPage({
      title: page.title,
      content: page.content,
      category: page.category,
      tags: page.tags.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDeletePage = (pageId: string) => {
    fetch(`${API_BASE}/pages/${pageId}`, { method: 'DELETE' })
      .then(res => res.ok && setPages(pages.filter(page => page.id !== pageId)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <NotebookPen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Caderno</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Página
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingPage ? 'Editar Página' : 'Nova Página'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newPage.title}
                  onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                  placeholder="Título da página"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newPage.category}
                  onChange={(e) => setNewPage({...newPage, category: e.target.value})}
                  placeholder="Ex: Pessoal, Trabalho, Educação..."
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={newPage.tags}
                  onChange={(e) => setNewPage({...newPage, tags: e.target.value})}
                  placeholder="Ex: reflexão, ideias, projeto"
                />
              </div>
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={newPage.content}
                  onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                  placeholder="Escreva o conteúdo da página aqui... (Suporte a Markdown)"
                  rows={12}
                  className="font-mono"
                />
              </div>
              <Button onClick={handleSavePage} className="w-full bg-primary hover:bg-primary">
                {editingPage ? 'Atualizar' : 'Criar'} Página
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas as Páginas</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="search">Buscar</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              onClick={() => setSelectedTag('')}
              className={selectedTag === '' ? 'bg-primary hover:bg-primary' : 'border-primary text-primary hover:bg-primary'}
            >
              Todas
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                onClick={() => setSelectedTag(tag)}
                className={selectedTag === tag ? 'bg-primary hover:bg-primary' : 'border-primary text-primary hover:bg-primary'}
              >
                #{tag}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map((page) => (
              <Card key={page.id} className="border-primary hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-primary text-lg">{page.title}</CardTitle>
                      {page.category && (
                        <Badge variant="secondary" className="mt-2 bg-primary text-primary">
                          {page.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPage(page)}
                        className="border-primary text-primary hover:bg-primary"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePage(page.id)}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-primary text-sm line-clamp-4">
                      {page.content.substring(0, 150)}...
                    </p>
                    
                    {page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {page.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary text-primary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-primary text-xs">
                      Atualizada: {page.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPages.map((page) => (
              <Card key={page.id} className="border-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-primary text-lg">{page.title}</CardTitle>
                      {page.category && (
                        <Badge variant="secondary" className="mt-2 bg-primary text-primary">
                          {page.category}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPage(page)}
                      className="border-primary text-primary hover:bg-primary"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-primary text-sm line-clamp-3">
                    {page.content.substring(0, 200)}...
                  </p>
                  <p className="text-primary text-xs mt-3">
                    {page.updatedAt.toLocaleDateString()} às {page.updatedAt.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
            <Input
              placeholder="Buscar em páginas, conteúdo e tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary focus:border-primary"
            />
          </div>

          {searchTerm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPages.map((page) => (
                <Card key={page.id} className="border-primary">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-primary text-lg">{page.title}</CardTitle>
                        {page.category && (
                          <Badge variant="secondary" className="mt-2 bg-primary text-primary">
                            {page.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPage(page)}
                        className="border-primary text-primary hover:bg-primary"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary text-sm line-clamp-3">
                      {page.content.substring(0, 200)}...
                    </p>
                    {page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {page.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary text-primary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchTerm && filteredPages.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-primary">Nenhuma página encontrada para "{searchTerm}"</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {pages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-primary">Nenhuma página criada ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notebook;