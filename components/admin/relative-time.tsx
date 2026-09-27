'use client';

import { useEffect, useState } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

function absolute(value: string): string {
  try {
    return format(parseISO(value), 'd MMM yyyy, HH.mm', { locale: localeId });
  } catch {
    return value;
  }
}

function relative(value: string): string {
  try {
    return formatDistanceToNow(parseISO(value), { addSuffix: true, locale: localeId });
  } catch {
    return value;
  }
}

export function RelativeTime({ value, className }: { value: string; className?: string }) {
  const [label, setLabel] = useState(() => absolute(value));

  useEffect(() => {
    setLabel(relative(value));
  }, [value]);

  return (
    <time dateTime={value} className={className}>
      {label}
    </time>
  );
}
