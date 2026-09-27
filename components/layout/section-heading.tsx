import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
