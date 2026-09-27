'use client';

import { Share2 } from 'lucide-react';

export function ShareButton() {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        // clipboard not available
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <Share2 className="h-4 w-4" />
      Bagikan
    </button>
  );
}
