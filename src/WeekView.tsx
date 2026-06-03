import type { Todo } from './types';
import { TodoItem } from './TodoItem';
import { AddItemForm } from './AddItemForm';

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
  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

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

      <AddItemForm onAdd={onAdd} />
    </section>
  );
}
