'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { MetricComparison } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  metric: MetricComparison;
  subtitle?: string;
  icon?: React.ReactNode;
  invertColors?: boolean; // If true, negative change is considered good
  prefix?: string;
  suffix?: string;
}

export function MetricCard({
  title,
  metric,
  subtitle,
  icon,
  invertColors = false,
  prefix = '',
  suffix = '',
}: MetricCardProps) {
  const isNeutral = Math.abs(metric.percentChange) < 0.1;
  const isPositive = metric.percentChange > 0;
  
  // Decide whether positive is good
  const isGood = invertColors ? !isPositive : (metric.isPositiveGood ? isPositive : !isPositive);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Subtle top glowing bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {prefix}{metric.formattedCurrent}{suffix}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {/* Percentage badge */}
        <span
          className={cn(
            'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold',
            isNeutral
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              : isGood
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          )}
        >
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {Math.abs(metric.percentChange).toFixed(1)}%
        </span>

        <span className="text-slate-400 dark:text-slate-500">
          vs prev ({metric.formattedPrevious})
        </span>
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
