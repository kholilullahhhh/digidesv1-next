import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export function PageHeader({ eyebrow, title, description, breadcrumb, className }: PageHeaderProps) {
  return (
    <section className={cn('relative border-b bg-muted/30', className)}>
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="container-mx relative py-12 lg:py-16">
        {breadcrumb && (
          <nav className="mb-4 text-xs text-muted-foreground">
            <ol className="flex items-center gap-1.5 flex-wrap">
              {breadcrumb.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                  ) : (
                    <span className="text-foreground/70">{item.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span className="text-muted-foreground/50">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
