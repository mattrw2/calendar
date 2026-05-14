import type { Todo } from './types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 shrink-0 rounded border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100 focus:ring-stone-400 dark:focus:ring-stone-500 cursor-pointer"
      />
      <span
        className={
          'flex-1 text-base leading-snug break-words ' +
          (todo.done
            ? 'line-through text-stone-400 dark:text-stone-500'
            : 'text-stone-800 dark:text-stone-200')
        }
      >
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete"
        className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 active:text-stone-700 dark:active:text-stone-300 text-base leading-none w-8 h-8 -mr-2 flex items-center justify-center"
      >
        ×
      </button>
    </li>
  );
}
