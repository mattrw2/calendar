import { useState, type FormEvent } from 'react';
import type { Todo } from './types';

interface Props {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToToday: (id: string) => void;
}

export function WeekView({ todos, onAdd, onToggle, onDelete, onMoveToToday }: Props) {
  const [draft, setDraft] = useState('');

  const sorted = [...todos].sort((a, b) => a.createdAt - b.createdAt);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft('');
  }

  return (
    <section>
      <header className="mb-2">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          Unscheduled
        </h2>
      </header>

      {sorted.length > 0 && (
        <ul className="divide-y divide-stone-100 dark:divide-stone-800 mb-2">
          {sorted.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => onToggle(t.id)}
                className="h-5 w-5 shrink-0 rounded border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100 focus:ring-stone-400 dark:focus:ring-stone-500 cursor-pointer"
              />
              <span
                className={
                  'flex-1 text-base leading-snug break-words ' +
                  (t.done
                    ? 'line-through text-stone-400 dark:text-stone-500'
                    : 'text-stone-800 dark:text-stone-200')
                }
              >
                {t.text}
              </span>
              <button
                type="button"
                onClick={() => onMoveToToday(t.id)}
                className="text-xs font-medium text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 whitespace-nowrap"
              >
                → Today
              </button>
              <button
                type="button"
                onClick={() => onDelete(t.id)}
                aria-label="Delete"
                className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 active:text-stone-700 dark:active:text-stone-300 text-base leading-none w-8 h-8 -mr-2 flex items-center justify-center"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a todo…"
          className="flex-1 bg-transparent text-base text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none py-2"
        />
        {draft.trim() && (
          <button
            type="submit"
            className="text-sm font-medium text-stone-900 dark:text-stone-100 px-3 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Add
          </button>
        )}
      </form>
    </section>
  );
}
