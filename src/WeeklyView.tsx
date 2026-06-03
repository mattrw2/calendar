import type { Todo } from './types';
import { AddItemForm } from './AddItemForm';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const WEEKLY_PREFIX = 'dow-';

interface Props {
  todos: Todo[];
  onAdd: (dateKey: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function WeeklyView({ todos, onAdd, onDelete }: Props) {
  const byDay = new Map<string, Todo[]>();
  for (const t of todos) {
    const arr = byDay.get(t.dateKey) ?? [];
    arr.push(t);
    byDay.set(t.dateKey, arr);
  }

  return (
    <div>
      {DAYS.map((day) => {
        const dateKey = WEEKLY_PREFIX + day;
        const items = [...(byDay.get(dateKey) ?? [])].sort(
          (a, b) => a.createdAt - b.createdAt,
        );
        return (
          <DaySection
            key={day}
            day={day}
            dateKey={dateKey}
            items={items}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}

function DaySection({
  day,
  dateKey,
  items,
  onAdd,
  onDelete,
}: {
  day: string;
  dateKey: string;
  items: Todo[];
  onAdd: (dateKey: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="py-3 border-b border-stone-200 dark:border-stone-800 last:border-b-0">
      <header className="mb-1">
        <h2 className="text-base font-medium text-stone-700 dark:text-stone-300">
          {day}
        </h2>
      </header>

      {items.length > 0 && (
        <ul className="divide-y divide-stone-100 dark:divide-stone-800 mb-2">
          {items.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-2">
              <span className="flex-1 text-base leading-snug break-words text-stone-800 dark:text-stone-200">
                {t.text}
              </span>
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

      <AddItemForm
        onAdd={(text) => onAdd(dateKey, text)}
        placeholder="Add an item…"
      />
    </section>
  );
}
