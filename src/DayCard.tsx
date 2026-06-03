import type { Dayjs } from 'dayjs';
import type { Todo } from './types';
import { TodoItem } from './TodoItem';
import { AddItemForm } from './AddItemForm';
import { findTime } from './parseTime';

interface Props {
  date: Dayjs;
  isToday: boolean;
  isPast: boolean;
  todos: Todo[];
  onAdd: (dateKey: string, text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMoveToToday: (id: string) => void;
  onMoveToUnscheduled: (id: string) => void;
}

export function DayCard({
  date,
  isToday,
  isPast,
  todos,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onMoveToToday,
  onMoveToUnscheduled,
}: Props) {
  const dateKey = date.format('YYYY-MM-DD');

  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const ta = findTime(a.text)?.minutes ?? null;
    const tb = findTime(b.text)?.minutes ?? null;
    if (ta !== null && tb !== null) return ta - tb;
    if (ta !== null) return -1;
    if (tb !== null) return 1;
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
              onMoveToToday={isPast && !t.done ? onMoveToToday : undefined}
              onMoveToUnscheduled={isPast && !t.done ? onMoveToUnscheduled : undefined}
            />
          ))}
        </ul>
      )}

      {!isPast && <AddItemForm onAdd={(text) => onAdd(dateKey, text)} />}
    </section>
  );
}
