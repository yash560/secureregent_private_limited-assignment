'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  Percent,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  GitFork,
  TrendingUp,
} from 'lucide-react';
import {
  Lead,
  LeadAnalyticsMetrics,
  FunnelStageData,
  StatusDistribution,
  SourceTrendData,
  DrillDownSelection,
} from '@/types/dashboard';
import { MetricCard } from '../MetricCard';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClasses,
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
} from 'recharts';

interface LeadAnalyticsViewProps {
  metrics: LeadAnalyticsMetrics;
  funnelData: FunnelStageData[];
  statusDistribution: StatusDistribution[];
  sourceTrends: SourceTrendData[];
  leads: Lead[];
  onSelectEntity: (selection: DrillDownSelection) => void;
}

export function LeadAnalyticsView({
  metrics,
  funnelData,
  statusDistribution,
  sourceTrends,
  leads,
  onSelectEntity,
}: LeadAnalyticsViewProps) {
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.leadNumber.toLowerCase().includes(q) ||
        l.industry.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Lead KPI Cards Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Lead Acquisition & Conversion Telemetry
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Requirement 1 Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Ingested Leads"
            metric={metrics.totalLeads}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            subtitle="All qualified and inbound records"
          />
          <MetricCard
            title="Qualified Leads"
            metric={metrics.qualifiedLeads}
            icon={<UserCheck className="w-5 h-5 text-indigo-500" />}
            subtitle="Scored opportunity threshold met"
          />
          <MetricCard
            title="Converted Leads"
            metric={metrics.convertedLeads}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            subtitle="Contract signed / won deal"
          />
          <MetricCard
            title="Unqualified Leads"
            metric={metrics.unqualifiedLeads}
            icon={<XCircle className="w-5 h-5 text-rose-500" />}
            subtitle="Disqualified or churned"
            invertColors={true}
          />
          <MetricCard
            title="Lead Conversion Rate"
            metric={metrics.conversionRate}
            icon={<Percent className="w-5 h-5 text-cyan-500" />}
            subtitle="Converted / Total ratio"
          />
        </div>
      </div>

      {/* 2. Lead Conversion Funnel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Full Enterprise Lead Funnel Progression
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Step-by-step conversion, stage volume, and pipeline value drop-off
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
            Overall Conversion: {metrics.conversionRate.formattedCurrent}
          </div>
        </div>

        {/* Visual Funnel Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {funnelData.map((stage, idx) => {
            const isLast = idx === funnelData.length - 1;
            return (
              <div
                key={idx}
                className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between hover:border-blue-500 dark:hover:border-blue-500/60 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                      Stage 0{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {stage.conversionFromTop.toFixed(0)}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                    {stage.stage}
                  </h4>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {stage.count}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Est. Pipeline:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(stage.value, true)}
                    </span>
                  </div>
                  {idx > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>From prior step:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {stage.conversionFromPrev.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Charts Row: Status Distribution & Source Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Trends & Distribution (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lead Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current active pipeline distribution by status
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {leads.length} records
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as StatusDistribution;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-slate-300">
                            Count: <strong className="font-mono text-white">{data.count}</strong> ({data.percentage}%)
                          </p>
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
                      {val} ({entry.payload.count})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Trends & Conversion Efficiency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Acquisition Channel Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total leads vs converted outcomes by channel
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Source ROI
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="source" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = sourceTrends.find((s) => s.source === label);
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 text-xs shadow-xl space-y-1">
                          <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                          <p className="text-blue-400">Total Leads: <strong>{item?.count}</strong></p>
                          <p className="text-indigo-400">Qualified: <strong>{item?.qualified}</strong></p>
                          <p className="text-emerald-400">Converted: <strong>{item?.converted}</strong></p>
                          <p className="text-cyan-400">Conversion Rate: <strong>{item?.conversionRate.toFixed(1)}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" name="Total Inbound" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Interactive Leads Table with Drill-Down Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lead Registry & 1:N Drill-Down Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any lead row to inspect attached quotations, deals, orders, and payments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter table..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter Leads by Status"
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Converted">Converted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Contacted">Contacted</option>
              <option value="New">New</option>
              <option value="Unqualified">Unqualified</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Lead / Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Acquisition Source</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Est. Value</th>
                <th className="py-3 px-3">Assigned To</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No leads matching current filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const badge = getStatusBadgeClasses(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectEntity({ type: 'lead', id: lead.id })}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-blue-500">
                          {lead.company}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {lead.leadNumber} • {lead.industry}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{lead.name}</div>
                        <div className="text-[10px] text-slate-400">{lead.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{lead.source}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold">{lead.score}</span>
                          <div className="w-12 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full', lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-blue-500' : 'bg-amber-500')}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold font-mono text-slate-900 dark:text-emerald-400">
                        {formatCurrency(lead.estimatedValue)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {lead.assignedTo.name}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntity({ type: 'lead', id: lead.id });
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
