import { useState, type FormEvent } from 'react';
import type { Todo } from './types';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMoveToToday: (id: string) => void;
}

export function WeekView({
  todos,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onMoveToToday,
}: Props) {
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
      {sorted.length > 0 && (
        <ul className="divide-y divide-stone-100 dark:divide-stone-800 mb-2">
          {sorted.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onMoveToToday={onMoveToToday}
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
