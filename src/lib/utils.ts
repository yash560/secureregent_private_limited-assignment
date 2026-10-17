import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getStatusBadgeClasses(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status.toLowerCase()) {
    case 'converted':
    case 'won':
    case 'completed':
    case 'collected':
    case 'accepted':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    case 'qualified':
    case 'in progress':
    case 'fulfillment':
    case 'negotiation':
    case 'under review':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-500',
      };
    case 'sent':
    case 'proposal':
    case 'proposal sent':
    case 'delivered':
      return {
        bg: 'bg-purple-500/10 dark:bg-purple-500/15',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-500/30',
        dot: 'bg-purple-500',
      };
    case 'contacted':
    case 'discovery':
    case 'pending':
    case 'draft':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case 'unqualified':
    case 'lost':
    case 'cancelled':
    case 'rejected':
    case 'failed':
    case 'expired':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
      };
    case 'new':
    default:
      return {
        bg: 'bg-zinc-500/10 dark:bg-zinc-500/15',
        text: 'text-zinc-700 dark:text-zinc-400',
        border: 'border-zinc-500/30',
        dot: 'bg-zinc-400',
      };
  }
}

export function getPriorityBadgeClasses(priority: string): { bg: string; text: string; border: string } {
  switch (priority.toLowerCase()) {
    case 'high':
      return {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/20',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20',
      };
    case 'low':
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/20',
      };
  }
}
