'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import {
  FilterState,
  DateFilterPreset,
  PeriodDateRange,
  SERVICES_LIST,
  SERVICE_CATEGORIES,
} from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  periodRange: PeriodDateRange;
}

export function FilterBar({ filter, setFilter, periodRange }: FilterBarProps) {
  const presets: { id: DateFilterPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Today', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: '7days', label: 'Last 7 Days', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: '30days', label: 'Last 30 Days', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'custom', label: 'Custom Range', icon: <Filter className="w-3.5 h-3.5" /> },
  ];

  const categories = Array.from(new Set(Object.values(SERVICE_CATEGORIES))) as string[];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Date Filter Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800/80 w-fit">
          {presets.map((preset) => {
            const isActive = filter.preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setFilter((prev) => ({ ...prev, preset: preset.id }))}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                {preset.icon}
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Dimension Filters: Service & Category */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Service Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Service:</span>
            <select
              value={filter.serviceFilter}
              onChange={(e) => setFilter((prev) => ({ ...prev, serviceFilter: e.target.value }))}
              aria-label="Filter by Service"
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="all">All Services ({SERVICES_LIST.length})</option>
              {SERVICES_LIST.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Category:</span>
            <select
              value={filter.categoryFilter}
              onChange={(e) => setFilter((prev) => ({ ...prev, categoryFilter: e.target.value }))}
              aria-label="Filter by Category"
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(filter.serviceFilter !== 'all' || filter.categoryFilter !== 'all' || filter.preset !== '7days') && (
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  preset: '7days',
                  serviceFilter: 'all',
                  categoryFilter: 'all',
                }))
              }
              title="Reset Filters"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Custom Range Picker Drawer if active */}
      {filter.preset === 'custom' && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">From:</span>
            <input
              type="date"
              value={filter.customStartDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, customStartDate: e.target.value }))}
              aria-label="Start Date"
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">To:</span>
            <input
              type="date"
              value={filter.customEndDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, customEndDate: e.target.value }))}
              aria-label="End Date"
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quick preset links */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Quick:</span>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  customStartDate: '2026-09-01',
                  customEndDate: '2026-10-17',
                }))
              }
              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Sept - Oct 2026
            </button>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  customStartDate: '2026-08-01',
                  customEndDate: '2026-10-17',
                }))
              }
              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Past 75 Days (Full Pipeline)
            </button>
          </div>
        </div>
      )}

      {/* Period Comparison Indicator Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-3.5 h-3.5" />
            Active Period:
          </span>
          <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {periodRange.currentLabel}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">
            Compared with Previous Equivalent Baseline:
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
            {periodRange.previousLabel}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Window: <strong>{periodRange.daysDiff} {periodRange.daysDiff === 1 ? 'day' : 'days'}</strong></span>
          <span>(100% Normalized Delta)</span>
        </div>
      </div>
    </div>
  );
}
