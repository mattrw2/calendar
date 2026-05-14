import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Todo } from './types';

interface CalendarDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
    indexes: { byDate: string };
  };
}

let dbPromise: Promise<IDBPDatabase<CalendarDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CalendarDB>('calendar-todos', 1, {
      upgrade(db) {
        const store = db.createObjectStore('todos', { keyPath: 'id' });
        store.createIndex('byDate', 'dateKey');
      },
    });
  }
  return dbPromise;
}

export async function getAllTodos(): Promise<Todo[]> {
  const db = await getDB();
  return db.getAll('todos');
}

export async function putTodo(todo: Todo): Promise<void> {
  const db = await getDB();
  await db.put('todos', todo);
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('todos', id);
}
