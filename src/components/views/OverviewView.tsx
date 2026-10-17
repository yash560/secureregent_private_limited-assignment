'use client';

import React from 'react';
import {
  Users,
  FileText,
  BadgeDollarSign,
  Package,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Lead,
  Quotation,
  Deal,
  Order,
  Payment,
  PeriodDateRange,
  LeadAnalyticsMetrics,
  QuotationAnalyticsMetrics,
  DealsRevenueMetrics,
  OrdersPaymentsMetrics,
  FunnelStageData,
  DrillDownSelection,
} from '@/types/dashboard';
import { MetricCard } from '../MetricCard';
import { formatCurrency, formatDate, getStatusBadgeClasses } from '@/lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface OverviewViewProps {
  leadMetrics: LeadAnalyticsMetrics;
  quoteMetrics: QuotationAnalyticsMetrics;
  dealMetrics: DealsRevenueMetrics;
  orderMetrics: OrdersPaymentsMetrics;
  funnelData: FunnelStageData[];
  dailyTrends: { date: string; currentRevenue: number; previousRevenue: number; currentCollected: number }[];
  leads: Lead[];
  deals: Deal[];
  orders: Order[];
  onSelectEntity: (selection: DrillDownSelection) => void;
  onNavigateTab: (tabId: any) => void;
}

export function OverviewView({
  leadMetrics,
  quoteMetrics,
  dealMetrics,
  orderMetrics,
  funnelData,
  dailyTrends,
  leads,
  deals,
  orders,
  onSelectEntity,
  onNavigateTab,
}: OverviewViewProps) {
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const activeOrders = orders.filter((o) => o.status === 'In Progress' || o.status === 'Fulfillment').slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Multi-Domain KPI Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Executive Performance Summary
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Cross-Domain Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Booked Revenue"
            metric={dealMetrics.wonRevenue}
            icon={<BadgeDollarSign className="w-5 h-5 text-emerald-500" />}
            subtitle="Closed-Won Enterprise Contracts"
          />
          <MetricCard
            title="Cash Collected"
            metric={dealMetrics.collectedRevenue}
            icon={<CheckCircle2 className="w-5 h-5 text-blue-500" />}
            subtitle={`Outstanding: ${dealMetrics.outstandingRevenue.formattedCurrent}`}
          />
          <MetricCard
            title="Lead Conversion Rate"
            metric={leadMetrics.conversionRate}
            icon={<Users className="w-5 h-5 text-indigo-500" />}
            subtitle={`${leadMetrics.convertedLeads.formattedCurrent} converted / ${leadMetrics.totalLeads.formattedCurrent} total`}
          />
          <MetricCard
            title="Quote-to-Deal Rate"
            metric={quoteMetrics.quoteToDealConversionRate}
            icon={<FileText className="w-5 h-5 text-purple-500" />}
            subtitle={`${quoteMetrics.acceptedQuotations.formattedCurrent} accepted quotes`}
          />
        </div>
      </div>

      {/* Main Charts Row: Daily Revenue Trends & Lead Funnel Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Revenue Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Revenue & Cash Collection Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current period daily booked revenue vs collected cash with baseline
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('deals')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              Full Revenue View <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                          <p className="text-blue-400">
                            Booked Revenue: <strong className="font-mono">{formatCurrency(payload[0]?.value as number)}</strong>
                          </p>
                          <p className="text-emerald-400">
                            Collected Cash: <strong className="font-mono">{formatCurrency(payload[1]?.value as number)}</strong>
                          </p>
                          {payload[2] && (
                            <p className="text-slate-400">
                              Prev Period Baseline: <strong className="font-mono">{formatCurrency(payload[2]?.value as number)}</strong>
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="currentRevenue"
                  name="Booked Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#currentRevGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="currentCollected"
                  name="Collected Cash"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#collectedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="previousRevenue"
                  name="Prev Baseline"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              Booked Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Collected Cash
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
              Previous Baseline
            </span>
          </div>
        </div>

        {/* Lead Funnel Snapshot (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Pipeline Conversion Funnel
              </h3>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Explore <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Drop-off telemetry from initial ingest to won contracts
            </p>

            <div className="space-y-3">
              {funnelData.map((stage, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {stage.stage}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {stage.count} <span className="text-[10px] text-slate-400 font-normal">({stage.conversionFromTop.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(5, stage.conversionFromTop)}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Overall Win Efficiency:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {leadMetrics.conversionRate.formattedCurrent}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Ingested Leads & Active Order Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Ingested Leads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Ingested Leads & Inquiries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any row for 1:N relational inspection
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              View All ({leads.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentLeads.map((lead) => {
              const badge = getStatusBadgeClasses(lead.status);
              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectEntity({ type: 'lead', id: lead.id })}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {lead.company.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{lead.company}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({lead.leadNumber})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.industry} • via {lead.source}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                      {lead.status}
                    </span>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Order Deliverables */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Order Delivery & Execution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Milestones in flight across client engagements
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              All Orders ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {activeOrders.map((ord) => {
              const badge = getStatusBadgeClasses(ord.status);
              return (
                <div
                  key={ord.id}
                  onClick={() => onSelectEntity({ type: 'order', id: ord.id })}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{ord.company}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                        {ord.status}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(ord.orderValue)}
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500">
                    {ord.service} • Target: {formatDate(ord.targetCompletionDate)}
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{ord.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${ord.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
