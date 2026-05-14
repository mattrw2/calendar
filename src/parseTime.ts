export interface TimeMatch {
  minutes: number;
  start: number;
  end: number;
}

export function findTime(text: string): TimeMatch | null {
  const range = text.match(
    /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*-\s*\d{1,2}(?::\d{2})?\s*(am|pm)?\b/i,
  );
  if (range && range.index !== undefined) {
    let h = parseInt(range[1], 10);
    const m = range[2] ? parseInt(range[2], 10) : 0;
    const period = (range[3] ?? range[4])?.toLowerCase();
    if (h > 23 || m > 59) return null;
    if (period === 'pm' && h < 12) h += 12;
    else if (period === 'am' && h === 12) h = 0;
    return { minutes: h * 60 + m, start: range.index, end: range.index + range[0].length };
  }

  const ampm = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (ampm && ampm.index !== undefined) {
    let h = parseInt(ampm[1], 10);
    const m = ampm[2] ? parseInt(ampm[2], 10) : 0;
    if (h > 12 || m > 59) return null;
    if (h === 12) h = 0;
    if (ampm[3].toLowerCase() === 'pm') h += 12;
    return { minutes: h * 60 + m, start: ampm.index, end: ampm.index + ampm[0].length };
  }

  const h24 = text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (h24 && h24.index !== undefined) {
    const h = parseInt(h24[1], 10);
    const m = parseInt(h24[2], 10);
    if (h < 24 && m < 60) {
      return { minutes: h * 60 + m, start: h24.index, end: h24.index + h24[0].length };
    }
  }

  return null;
}
