import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  ClipboardList,
  FileText,
  Heart,
  HeartHandshake,
  HeartPulse,
  Store,
  Users,
} from 'lucide-react';

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Baby,
  ClipboardList,
  FileText,
  Heart,
  HeartHandshake,
  HeartPulse,
  Store,
  Users,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export function getServiceIcon(name?: string | null): LucideIcon {
  return (name && SERVICE_ICONS[name]) || FileText;
}
