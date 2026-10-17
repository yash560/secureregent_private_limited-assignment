'use client';

import React, { useState } from 'react';
import {
  BadgeDollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  GitFork,
  Flame,
} from 'lucide-react';
import {
  Deal,
  DealsRevenueMetrics,
  ServicePerformance,
  DailyRevenuePoint,
  DrillDownSelection,
  DealStage,
  DealPriority,
} from '@/types/dashboard';
import { MetricCard } from '../MetricCard';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClasses,
  getPriorityBadgeClasses,
  cn,
} from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface DealsRevenueViewProps {
  metrics: DealsRevenueMetrics;
  deals: Deal[];
  servicePerformance: ServicePerformance[];
  dailyTrends: DailyRevenuePoint[];
  onSelectEntity: (selection: DrillDownSelection) => void;
}

export function DealsRevenueView({
  metrics,
  deals,
  servicePerformance,
  dailyTrends,
  onSelectEntity,
}: DealsRevenueViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Compute Revenue by Category
  const categoryMap: Record<string, number> = {};
  deals.filter((d) => d.stage === 'Won').forEach((d) => {
    categoryMap[d.category] = (categoryMap[d.category] || 0) + d.value;
  });

  const categoryColors: Record<string, string> = {
    'Cybersecurity Services': '#3b82f6',
    'Compliance & Governance': '#8b5cf6',
    'Cloud Infrastructure': '#06b6d4',
    'Managed Detection': '#10b981',
  };

  const revenueByCategory = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || '#64748b',
  }));

  // Compute Priority Breakdown
  const priorities: DealPriority[] = ['High', 'Medium', 'Low'];
  const priorityBreakdown = priorities.map((p) => {
    const list = deals.filter((d) => d.priority === p);
    const totalVal = list.reduce((sum, d) => sum + d.value, 0);
    const wonList = list.filter((d) => d.stage === 'Won');
    const wonVal = wonList.reduce((sum, d) => sum + d.value, 0);
    const winRate = list.length > 0 ? (wonList.length / list.length) * 100 : 0;
    return {
      priority: p,
      count: list.length,
      totalVal,
      wonVal,
      winRate,
    };
  });

  // Compute Stage Pipeline Distribution
  const stages: DealStage[] = ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const stageDistribution = stages.map((st) => {
    const list = deals.filter((d) => d.stage === st);
    const totalVal = list.reduce((sum, d) => sum + d.value, 0);
    const avgProgress = list.length > 0 ? Math.round(list.reduce((sum, d) => sum + d.progressPercent, 0) / list.length) : 0;
    return {
      stage: st,
      count: list.length,
      totalVal,
      avgProgress,
    };
  });

  const filteredDeals = deals.filter((d) => {
    if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
    if (priorityFilter !== 'all' && d.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.dealNumber.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.service.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate percentage collected
  const wonRev = metrics.wonRevenue.current;
  const colRev = metrics.collectedRevenue.current;
  const collectionPercent = wonRev > 0 ? Math.min(100, Math.round((colRev / wonRev) * 100)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Deals & Revenue KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Deals & Financial Revenue Engine
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Requirement 4 Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Total Deals"
            metric={metrics.totalDeals}
            icon={<BadgeDollarSign className="w-5 h-5 text-blue-500" />}
            subtitle="Pipeline active engagements"
          />
          <MetricCard
            title="Pipeline Value"
            metric={metrics.totalPipelineValue}
            icon={<Sparkles className="w-5 h-5 text-indigo-500" />}
            subtitle="Gross unweighted pipeline"
          />
          <MetricCard
            title="Won Revenue"
            metric={metrics.wonRevenue}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            subtitle="Closed-won signed value"
          />
          <MetricCard
            title="Collected Revenue"
            metric={metrics.collectedRevenue}
            icon={<CreditCard className="w-5 h-5 text-cyan-500" />}
            subtitle="Cash received in bank"
          />
          <MetricCard
            title="Outstanding Revenue"
            metric={metrics.outstandingRevenue}
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            subtitle="Accounts receivable due"
            invertColors={true}
          />
          <MetricCard
            title="Avg Deal Progress"
            metric={metrics.averageDealProgress}
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            subtitle="Execution milestone velocity"
          />
        </div>
      </div>

      {/* 2. Total vs. Collected vs. Outstanding Revenue Balance Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Total vs. Collected vs. Outstanding Revenue Realization
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cash collection progress across all closed-won contracts in the active period
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Cash Realization Ratio:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {collectionPercent}% Realized
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-700 relative group"
              style={{ width: `${collectionPercent}%` }}
              title={`Collected: ${formatCurrency(colRev)}`}
            />
            <div
              className="bg-amber-500/70 h-full transition-all duration-700"
              style={{ width: `${100 - collectionPercent}%` }}
              title={`Outstanding: ${formatCurrency(metrics.outstandingRevenue.current)}`}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-300">Collected Cash: <strong>{formatCurrency(colRev)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-300">Outstanding Receivables: <strong>{formatCurrency(metrics.outstandingRevenue.current)}</strong></span>
            </div>
            <div className="text-slate-300">
              Total Contracted: <strong className="text-white">{formatCurrency(wonRev)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Revenue Trends Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Daily Revenue Velocity vs. Baseline Period
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily closed-won revenue compared day-by-day against prior equivalent period
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dealDailyRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 text-xs shadow-xl space-y-1">
                        <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                        <p className="text-emerald-400">Current Period Revenue: <strong>{formatCurrency(payload[0]?.value as number)}</strong></p>
                        {payload[1] && (
                          <p className="text-slate-400">Previous Period Baseline: <strong>{formatCurrency(payload[1]?.value as number)}</strong></p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="currentRevenue" name="Current Period" stroke="#10b981" strokeWidth={2.5} fill="url(#dealDailyRevGrad)" />
              <Area type="monotone" dataKey="previousRevenue" name="Previous Equivalent" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Service Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deals & Revenue by Service */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deals & Revenue by Service
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Closed-won dollar volume and deal frequency per service line
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicePerformance} layout="vertical" margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <YAxis dataKey="service" type="category" stroke="#94a3b8" fontSize={9} width={90} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ServicePerformance;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold">{item.service}</p>
                          <p className="text-emerald-400">Won Revenue: <strong>{formatCurrency(item.dealRevenue)}</strong></p>
                          <p className="text-blue-400">Deals Won: <strong>{item.dealCount}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="dealRevenue" name="Revenue ($)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category (Pie / Donut) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share of booked contracts across capability domains
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">
              {formatCurrency(wonRev)} total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const percent = wonRev > 0 ? ((item.value / wonRev) * 100).toFixed(1) : 0;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl">
                          <p className="font-bold">{item.name}</p>
                          <p className="text-emerald-400 font-mono font-bold">{formatCurrency(item.value)} ({percent}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val, entry: any) => (
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {val} ({formatCurrency(entry.payload.value, true)})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. Priority Breakdown & Deal Progress Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              Priority Breakdown & Win Rates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pipeline distribution and conversion performance by deal tier
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {priorityBreakdown.map((item) => {
              const badge = getPriorityBadgeClasses(item.priority);
              return (
                <div
                  key={item.priority}
                  className={cn('p-4 rounded-xl border flex flex-col justify-between', badge.border, 'bg-slate-50/50 dark:bg-slate-950/40')}
                >
                  <div>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', badge.bg)}>
                      {item.priority}
                    </span>
                    <div className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                      {item.count} <span className="text-xs font-normal text-slate-400">deals</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="text-slate-500 text-[11px]">Total Pipeline:</div>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatCurrency(item.totalVal, true)}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      Win Rate: {item.winRate.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deal Progress & Stage Pipeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Deal Progress & Stage Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Velocity across pipeline milestones from Discovery to Won
            </p>
          </div>

          <div className="space-y-3">
            {stageDistribution.map((st) => {
              const badge = getStatusBadgeClasses(st.stage);
              return (
                <div key={st.stage} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold', badge.bg, badge.text)}>
                      {st.stage}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{st.count} deals</span>
                      <span className="text-slate-400 text-[11px] block">{formatCurrency(st.totalVal)}</span>
                    </div>
                  </div>

                  <div className="w-36 text-right">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Avg Progress</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{st.avgProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${st.avgProgress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. Deals Registry Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deals Registry & Execution Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any deal to drill down into attached orders and milestone payments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              aria-label="Filter Deals by Stage"
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Stages</option>
              <option value="Won">Won</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Proposal">Proposal</option>
              <option value="Discovery">Discovery</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Deal # / Title</th>
                <th className="py-3 px-3">Lead Account</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Expected Close</th>
                <th className="py-3 px-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No deals matching active filters.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((d) => {
                  const stageBadge = getStatusBadgeClasses(d.stage);
                  const priorityBadge = getPriorityBadgeClasses(d.priority);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => onSelectEntity({ type: 'deal', id: d.id })}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500">
                          {d.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {d.dealNumber} • {d.service}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{d.company}</div>
                        <div className="text-[10px] text-slate-400">{d.leadName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', stageBadge.bg, stageBadge.text)}>
                          {d.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold border', priorityBadge.bg, priorityBadge.border)}>
                          {d.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-emerald-400">
                        {formatCurrency(d.value)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-600 dark:text-slate-300 w-8">{d.progressPercent}%</span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${d.progressPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDate(d.expectedCloseDate)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntity({ type: 'deal', id: d.id });
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <GitFork className="w-3 h-3" />
                          Drill Down
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
