'use client';

import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileCheck,
  BadgeDollarSign,
  PackageCheck,
  GitFork,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type DashboardTabId =
  | 'overview'
  | 'leads'
  | 'quotations'
  | 'deals'
  | 'orders'
  | 'relationships';

interface TabItem {
  id: DashboardTabId;
  label: string;
  badge?: string | number;
  icon: React.ReactNode;
}

interface NavigationTabsProps {
  activeTab: DashboardTabId;
  setActiveTab: (tab: DashboardTabId) => void;
  counts: {
    leads: number;
    quotations: number;
    deals: number;
    orders: number;
    payments: number;
  };
}

export function NavigationTabs({ activeTab, setActiveTab, counts }: NavigationTabsProps) {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Executive Cockpit',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'leads',
      label: '1. Lead Analytics',
      badge: counts.leads,
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: 'quotations',
      label: '2. Quotation Analytics',
      badge: counts.quotations,
      icon: <FileCheck className="w-4 h-4" />,
    },
    {
      id: 'deals',
      label: '3. Deals & Revenue',
      badge: counts.deals,
      icon: <BadgeDollarSign className="w-4 h-4" />,
    },
    {
      id: 'orders',
      label: '4. Orders & Payments',
      badge: counts.orders,
      icon: <PackageCheck className="w-4 h-4" />,
    },
    {
      id: 'relationships',
      label: '5. Relational Drill-Down',
      badge: '1:N Explorer',
      icon: <GitFork className="w-4 h-4" />,
    },
  ];

  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800 mb-6 overflow-x-auto scrollbar-none">
      <nav className="flex items-center space-x-1 sm:space-x-2 min-w-max pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative',
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute -bottom-1 left-3 right-3 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
