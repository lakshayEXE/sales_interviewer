import { Hand, Search, Phone, ShieldAlert, Megaphone, Lightbulb, Pencil, Flag, FileText, Mail, MonitorPlay, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NodeCategory } from '../../types/flow';

export const CATEGORY_ICONS: Record<NodeCategory, LucideIcon> = {
  greeting: Hand,
  research: Search,
  roleplay: Phone,
  'objection-handling': ShieldAlert,
  pitch: Megaphone,
  scenario: Lightbulb,
  'resume-review': FileText,
  'email-followup': Mail,
  presentation: MonitorPlay,
  negotiation: Handshake,
  custom: Pencil,
  wrapup: Flag,
};
