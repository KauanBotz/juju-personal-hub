const express = require('express');
const { join } = require('path');
const { Low, JSONFile } = require('lowdb');

// Initialize database using a JSON file
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {
  notes: [],
  habits: [],
  events: [],
  pages: [],
  books: [],
  settings: { profile: {}, notifications: {} },
  home: { pendingTasks: 0, habitsToday: 0, appointments: 0 },
});

async function initDB() {
  await db.read();
  db.data ||= {
    notes: [],
    habits: [],
    events: [],
    pages: [],
    books: [],
    settings: { profile: {}, notifications: {} },
    home: { pendingTasks: 0, habitsToday: 0, appointments: 0 },
  };
  await db.write();
}

initDB();

const app = express();
app.use(express.json());

// ---- Notes Endpoints ----
app.get('/notes', async (_req, res) => {
  await db.read();
  res.json(db.data.notes);
});

app.post('/notes', async (req, res) => {
  await db.read();
  const newNote = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.data.notes.push(newNote);
  await db.write();
  res.status(201).json(newNote);
});

app.put('/notes/:id', async (req, res) => {
  await db.read();
  const index = db.data.notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Note not found' });
  db.data.notes[index] = {
    ...db.data.notes[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  await db.write();
  res.json(db.data.notes[index]);
});

app.delete('/notes/:id', async (req, res) => {
  await db.read();
  const index = db.data.notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Note not found' });
  const removed = db.data.notes.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

// ---- Habits Endpoints ----
app.get('/habits', async (_req, res) => {
  await db.read();
  res.json(db.data.habits);
});

app.post('/habits', async (req, res) => {
  await db.read();
  const newHabit = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completions: {},
    ...req.body,
  };
  db.data.habits.push(newHabit);
  await db.write();
  res.status(201).json(newHabit);
});

app.put('/habits/:id', async (req, res) => {
  await db.read();
  const index = db.data.habits.findIndex((h) => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Habit not found' });
  db.data.habits[index] = {
    ...db.data.habits[index],
    ...req.body,
  };
  await db.write();
  res.json(db.data.habits[index]);
});

app.delete('/habits/:id', async (req, res) => {
  await db.read();
  const index = db.data.habits.findIndex((h) => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Habit not found' });
  const removed = db.data.habits.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

// ---- Events Endpoints ----
app.get('/events', async (_req, res) => {
  await db.read();
  res.json(db.data.events);
});

app.post('/events', async (req, res) => {
  await db.read();
  const newEvent = { id: Date.now().toString(), ...req.body };
  db.data.events.push(newEvent);
  await db.write();
  res.status(201).json(newEvent);
});

app.put('/events/:id', async (req, res) => {
  await db.read();
  const index = db.data.events.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  db.data.events[index] = { ...db.data.events[index], ...req.body };
  await db.write();
  res.json(db.data.events[index]);
});

app.delete('/events/:id', async (req, res) => {
  await db.read();
  const index = db.data.events.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  const removed = db.data.events.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

// ---- Notebook Pages Endpoints ----
app.get('/pages', async (_req, res) => {
  await db.read();
  res.json(db.data.pages);
});

app.post('/pages', async (req, res) => {
  await db.read();
  const newPage = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.data.pages.push(newPage);
  await db.write();
  res.status(201).json(newPage);
});

app.put('/pages/:id', async (req, res) => {
  await db.read();
  const index = db.data.pages.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Page not found' });
  db.data.pages[index] = {
    ...db.data.pages[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  await db.write();
  res.json(db.data.pages[index]);
});

app.delete('/pages/:id', async (req, res) => {
  await db.read();
  const index = db.data.pages.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Page not found' });
  const removed = db.data.pages.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

// ---- Books Endpoints ----
app.get('/books', async (_req, res) => {
  await db.read();
  res.json(db.data.books);
});

app.post('/books', async (req, res) => {
  await db.read();
  const newBook = {
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
    ...req.body,
  };
  db.data.books.push(newBook);
  await db.write();
  res.status(201).json(newBook);
});

app.put('/books/:id', async (req, res) => {
  await db.read();
  const index = db.data.books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Book not found' });
  db.data.books[index] = { ...db.data.books[index], ...req.body };
  await db.write();
  res.json(db.data.books[index]);
});

app.delete('/books/:id', async (req, res) => {
  await db.read();
  const index = db.data.books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Book not found' });
  const removed = db.data.books.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

// ---- Settings Endpoints ----
app.get('/settings', async (_req, res) => {
  await db.read();
  res.json(db.data.settings);
});

app.put('/settings', async (req, res) => {
  await db.read();
  db.data.settings = { ...db.data.settings, ...req.body };
  await db.write();
  res.json(db.data.settings);
});

// ---- Home Data Endpoints ----
app.get('/home', async (_req, res) => {
  await db.read();
  res.json(db.data.home);
});

app.put('/home', async (req, res) => {
  await db.read();
  db.data.home = { ...db.data.home, ...req.body };
  await db.write();
  res.json(db.data.home);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});