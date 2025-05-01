import fs from 'fs';
import path from 'path';

// Define the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to get the file path for a collection
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

// Helper function to read a collection
const readCollection = (collection) => {
  const filePath = getFilePath(collection);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${collection} collection:`, error);
    return [];
  }
};

// Helper function to write to a collection
const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${collection} collection:`, error);
    return false;
  }
};

// CRUD operations for collections
export const db = {
  // Save all items in a collection (replace entire collection)
  saveAll: (collection, items) => {
    return writeCollection(collection, items);
  },
  // Get all items in a collection
  getAll: (collection) => {
    return readCollection(collection);
  },

  // Get a single item by ID
  getById: (collection, id) => {
    const items = readCollection(collection);
    return items.find(item => item.id === parseInt(id) || item.id === id);
  },

  // Create a new item
  create: (collection, item) => {
    const items = readCollection(collection);

    // Generate a new ID (simple approach)
    const newId = items.length > 0
      ? Math.max(...items.map(i => typeof i.id === 'number' ? i.id : 0)) + 1
      : 1;

    const newItem = { ...item, id: newId, createdAt: new Date().toISOString() };
    items.push(newItem);

    const success = writeCollection(collection, items);
    return success ? newItem : null;
  },

  // Update an existing item
  update: (collection, id, updates) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === parseInt(id) || item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      id: items[index].id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    const success = writeCollection(collection, items);
    return success ? updatedItem : null;
  },

  // Delete an item
  delete: (collection, id) => {
    const items = readCollection(collection);
    const filteredItems = items.filter(item => item.id !== parseInt(id) && item.id !== id);

    if (filteredItems.length === items.length) {
      return false; // No item was removed
    }

    return writeCollection(collection, filteredItems);
  }
};
