import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import dayjs from 'dayjs';
import type { Todo } from './types';
import { getAllTodos, putTodo, deleteTodo as dbDelete } from './db';
import { DayCard } from './DayCard';
import { WeekView } from './WeekView';

const DAYS_BACK = 7;
const DAYS_FORWARD = 13;

type View = 'calendar' | 'week';

function withTransition(fn: () => void) {
  const start = (document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  }).startViewTransition;
  if (start) {
    start.call(document, () => flushSync(fn));
  } else {
    fn();
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>('calendar');
  const todayRef = useRef<HTMLDivElement>(null);
  const didScrollRef = useRef(false);

  useEffect(() => {
    getAllTodos()
      .then((all) => setTodos(all))
      .catch((err) => console.error('Failed to load todos', err))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && view === 'calendar' && !didScrollRef.current && todayRef.current) {
      todayRef.current.scrollIntoView({ block: 'start' });
      didScrollRef.current = true;
    }
  }, [loaded, view]);

  const days = useMemo(() => {
    const start = dayjs().startOf('day').subtract(DAYS_BACK, 'day');
    return Array.from(
      { length: DAYS_BACK + DAYS_FORWARD + 1 },
      (_, i) => start.add(i, 'day'),
    );
  }, []);

  const todayKey = dayjs().format('YYYY-MM-DD');

  const byDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of todos) {
      const arr = map.get(t.dateKey) ?? [];
      arr.push(t);
      map.set(t.dateKey, arr);
    }
    return map;
  }, [todos]);

  function handleAdd(dateKey: string, text: string) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      dateKey,
      text,
      done: false,
      createdAt: Date.now(),
    };
    withTransition(() => setTodos((prev) => [...prev, todo]));
    putTodo(todo).catch((err) => console.error('Failed to save todo', err));
  }

  function handleToggle(id: string) {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    const updated: Todo = { ...current, done: !current.done };
    withTransition(() =>
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t))),
    );
    putTodo(updated).catch((err) => console.error('Failed to save todo', err));
  }

  function handleDelete(id: string) {
    withTransition(() => setTodos((prev) => prev.filter((t) => t.id !== id)));
    dbDelete(id).catch((err) => console.error('Failed to delete todo', err));
  }

  function handleEdit(id: string, text: string) {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    const updated: Todo = { ...current, text };
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    putTodo(updated).catch((err) => console.error('Failed to save todo', err));
  }

  function handleMoveToToday(id: string) {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    const updated: Todo = { ...current, dateKey: todayKey };
    withTransition(() =>
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t))),
    );
    putTodo(updated).catch((err) => console.error('Failed to save todo', err));
  }

  return (
    <>
      <main className="mx-auto max-w-md px-4 py-6 pb-28">
        {loaded && view === 'calendar' &&
          days.map((d) => {
            const key = d.format('YYYY-MM-DD');
            const isToday = key === todayKey;
            const isPast = key < todayKey;
            return (
              <div key={key} ref={isToday ? todayRef : undefined}>
                <DayCard
                  date={d}
                  isToday={isToday}
                  isPast={isPast}
                  todos={byDate.get(key) ?? []}
                  onAdd={handleAdd}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onMoveToToday={handleMoveToToday}
                />
              </div>
            );
          })}

        {loaded && view === 'week' && (
          <WeekView
            todos={todos.filter((t) => t.dateKey === 'week')}
            onAdd={(text) => handleAdd('week', text)}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onMoveToToday={handleMoveToToday}
          />
        )}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-md flex divide-x divide-stone-200 dark:divide-stone-800">
          <TabButton
            label="Calendar"
            active={view === 'calendar'}
            onClick={() => setView('calendar')}
          />
          <TabButton
            label="Unscheduled"
            active={view === 'week'}
            onClick={() => setView('week')}
          />
        </div>
      </nav>
    </>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex-1 py-3 text-sm font-medium transition-colors ' +
        (active
          ? 'text-stone-900 dark:text-stone-100'
          : 'text-stone-500 dark:text-stone-400')
      }
    >
      {label}
    </button>
  );
}
