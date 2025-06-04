const express = require('express');
const { join } = require('path');
const { Low, JSONFile } = require('lowdb');

// Initialize database using a JSON file
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { items: [] });

async function initDB() {
  await db.read();
  db.data ||= { items: [] };
  await db.write();
}

initDB();

const app = express();
app.use(express.json());

// Read all items
app.get('/items', async (_req, res) => {
  await db.read();
  res.json(db.data.items);
});

// Read single item
app.get('/items/:id', async (req, res) => {
  await db.read();
  const item = db.data.items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// Create item
app.post('/items', async (req, res) => {
  await db.read();
  const newItem = { id: Date.now(), ...req.body };
  db.data.items.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

// Update item
app.put('/items/:id', async (req, res) => {
  await db.read();
  const index = db.data.items.findIndex(i => i.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Item not found' });
  db.data.items[index] = { ...db.data.items[index], ...req.body };
  await db.write();
  res.json(db.data.items[index]);
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  await db.read();
  const index = db.data.items.findIndex(i => i.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Item not found' });
  const removed = db.data.items.splice(index, 1);
  await db.write();
  res.json(removed[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});