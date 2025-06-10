import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
}

const Calendar: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: ''
  });

  const eventsForSelectedDate = events.filter(event =>
    event.date.toDateString() === selectedDate?.toDateString()
  );

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedEvents = data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar eventos",
        variant: "destructive"
      });
    }
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title || !selectedDate || !user) return;

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('calendar_events')
          .update({
            title: newEvent.title,
            description: newEvent.description,
            time: newEvent.time,
            date: selectedDate.toISOString().split('T')[0]
          })
          .eq('id', editingEvent.id);

        if (error) throw error;

        setEvents(events.map(e => 
          e.id === editingEvent.id 
            ? { ...e, ...newEvent, date: selectedDate }
            : e
        ));
      } else {
        const { data, error } = await supabase
          .from('calendar_events')
          .insert({
            title: newEvent.title,
            description: newEvent.description,
            time: newEvent.time,
            date: selectedDate.toISOString().split('T')[0],
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;

        const newEventWithDate = {
          ...data,
          date: new Date(data.date)
        };
        setEvents([...events, newEventWithDate]);
      }

      setNewEvent({ title: '', description: '', time: '' });
      setEditingEvent(null);
      setIsDialogOpen(false);

      toast({
        title: "Sucesso",
        description: editingEvent ? "Evento atualizado!" : "Evento criado!"
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar evento",
        variant: "destructive"
      });
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      time: event.time
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
      toast({
        title: "Sucesso",
        description: "Evento excluído!"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir evento",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">{t('calendar')}</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t('newEvent')}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingEvent ? t('editEvent') : t('newEvent')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('title')}</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder={t('eventTitlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="time">{t('time')}</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder={t('eventDescriptionPlaceholder')}
                />
              </div>
              <Button onClick={handleSaveEvent} className="w-full bg-primary hover:bg-primary">
                {editingEvent ? t('update') : t('create')} {t('newEvent')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t('calendar')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-primary w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              {t('eventsFor')} {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : t('date')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-primary text-center py-4">
                {t('noEventsForDate')}
              </p>
            ) : (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="p-3 border border-primary rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary break-words">{event.title}</h3>
                        <p className="text-primary text-sm">{event.time}</p>
                        {event.description && (
                          <p className="text-primary text-sm mt-1 break-words">{event.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEvent(event)}
                          className="border-primary text-primary hover:bg-primary"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
