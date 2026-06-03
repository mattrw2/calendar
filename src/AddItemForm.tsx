import { useState, type FormEvent } from 'react';

interface Props {
  onAdd: (text: string) => void;
  placeholder?: string;
}

export function AddItemForm({ onAdd, placeholder = 'Add a task…' }: Props) {
  const [draft, setDraft] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') e.currentTarget.blur();
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-base text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none py-2"
      />
    </form>
  );
}
