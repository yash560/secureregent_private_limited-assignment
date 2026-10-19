'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Moon,
  Sun,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  Database,
} from 'lucide-react';
import { FilterState } from '@/types/dashboard';

interface HeaderProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetData: () => void;
  onExport: () => void;
  totalRecords: { leads: number; quotes: number; deals: number; orders: number; payments: number };
}

export function Header({
  filter,
  setFilter,
  onResetData,
  onExport,
  totalRecords,
}: HeaderProps) {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Check initial theme
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light') {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20 text-white">
                <ShieldCheck className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    SecureRegent
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Business Performance & Revenue Analytics Dashboard
                </p>
              </div>
            </div>

            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-mobile"
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads, deals, services..."
                value={filter.searchQuery}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Seed Re-generation */}
            <button
              onClick={onResetData}
              title="Re-seed relational dataset"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            {/* Export Report */}
            <button
              onClick={onExport}
              title="Export Analytics Summary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            {/* Desktop Theme toggle */}
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-desktop"
              className="hidden md:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

        </div>

        {/* Live System Invariant Telemetry Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live Pipeline Active
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden sm:inline">
              Ref Date: <strong className="font-semibold text-slate-700 dark:text-slate-300">17 Oct 2026</strong>
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline">
              Total Dataset: <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords.leads} Leads</strong>,{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords.quotes} Quotes</strong>,{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords.deals} Deals</strong>,{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords.orders} Orders</strong>,{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords.payments} Payments</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-[10px] font-mono text-slate-600 dark:text-slate-400">
              1:N Relational Engine
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-mono">
              Auto Comparative Periods
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
