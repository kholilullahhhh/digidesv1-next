'use client';

import { useState } from 'react';
import { Megaphone, X, ChevronRight } from 'lucide-react';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export function AnnouncementBar({ items }: { items: AnnouncementItem[] }) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);

  if (!open || items.length === 0) return null;

  const current = items[index % items.length];

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container-mx">
        <div className="flex items-center gap-3 py-2 text-sm">
          <div className="flex items-center gap-1.5 shrink-0 font-medium">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Pengumuman</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate">
              <span className="font-semibold">{current.title}:</span>{' '}
              <span className="opacity-90">{current.content}</span>
            </p>
          </div>
          {items.length > 1 && (
            <button
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-primary-foreground/15"
              aria-label="Pengumuman berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-primary-foreground/15"
            aria-label="Tutup pengumuman"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
