import { useState, type FormEvent } from 'react';
import type { Dayjs } from 'dayjs';
import type { Todo } from './types';
import { TodoItem } from './TodoItem';

interface Props {
  date: Dayjs;
  isToday: boolean;
  todos: Todo[];
  onAdd: (dateKey: string, text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSetTime: (id: string, time: string | undefined) => void;
}

export function DayCard({
  date,
  isToday,
  todos,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onSetTime,
}: Props) {
  const [draft, setDraft] = useState('');
  const dateKey = date.format('YYYY-MM-DD');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(dateKey, text);
    setDraft('');
  }

  const sorted = [...todos].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return a.createdAt - b.createdAt;
  });

  return (
    <section className="py-3 border-b border-stone-200 dark:border-stone-800 last:border-b-0">
      <header className="flex items-baseline justify-between mb-1">
        <h2
          className={
            'text-base ' +
            (isToday
              ? 'font-semibold text-stone-900 dark:text-stone-100'
              : 'font-medium text-stone-700 dark:text-stone-300')
          }
        >
          {date.format('dddd')}
          {isToday && (
            <span className="ml-2 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Today
            </span>
          )}
        </h2>
        <span className="text-sm text-stone-400 dark:text-stone-500">{date.format('MMM D')}</span>
      </header>

      {sorted.length > 0 && (
        <ul className="divide-y divide-stone-100 dark:divide-stone-800 mb-2">
          {sorted.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onSetTime={onSetTime}
            />
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') e.currentTarget.blur();
          }}
          placeholder="Add a task…"
          className="flex-1 bg-transparent text-base text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none py-2"
        />
      </form>
    </section>
  );
}
