import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from './types';
import { findTime } from './parseTime';

function TextWithTime({ text }: { text: string }) {
  const match = findTime(text);
  if (!match) return <>{text}</>;
  return (
    <>
      {text.slice(0, match.start)}
      <span className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
        {text.slice(match.start, match.end)}
      </span>
      {text.slice(match.end)}
    </>
  );
}

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMoveToToday?: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onMoveToToday }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    }
  }, [editing]);

  function startEdit() {
    setDraft(todo.text);
    setEditing(true);
  }

  function commit() {
    const next = draft.trim();
    if (next && next !== todo.text) onEdit(todo.id, next);
    setEditing(false);
  }

  function cancel() {
    setDraft(todo.text);
    setEditing(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  }

  return (
    <li className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 shrink-0 rounded border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100 focus:ring-stone-400 dark:focus:ring-stone-500 cursor-pointer"
      />

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          className="flex-1 bg-transparent text-base text-stone-800 dark:text-stone-200 outline-none py-1"
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          className={
            'flex-1 text-left text-base leading-snug break-words bg-transparent ' +
            (todo.done
              ? 'line-through text-stone-400 dark:text-stone-500'
              : 'text-stone-800 dark:text-stone-200')
          }
        >
          <TextWithTime text={todo.text} />
        </button>
      )}

      {!editing && onMoveToToday && (
        <button
          type="button"
          onClick={() => onMoveToToday(todo.id)}
          className="text-xs font-medium text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 whitespace-nowrap"
        >
          → Today
        </button>
      )}
      {!editing && (
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
          className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 active:text-stone-700 dark:active:text-stone-300 text-base leading-none w-8 h-8 -mr-2 flex items-center justify-center"
        >
          ×
        </button>
      )}
    </li>
  );
}
