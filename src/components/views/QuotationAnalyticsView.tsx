'use client';

import React, { useState } from 'react';
import {
  FileText,
  BadgeDollarSign,
  Percent,
  CheckCircle2,
  Clock,
  ArrowRight,
  GitFork,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Quotation,
  QuotationAnalyticsMetrics,
  ServicePerformance,
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
  Legend,
} from 'recharts';

interface QuotationAnalyticsViewProps {
  metrics: QuotationAnalyticsMetrics;
  quotations: Quotation[];
  servicePerformance: ServicePerformance[];
  onSelectEntity: (selection: DrillDownSelection) => void;
}

export function QuotationAnalyticsView({
  metrics,
  quotations,
  servicePerformance,
  onSelectEntity,
}: QuotationAnalyticsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQuotes = quotations.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.quoteNumber.toLowerCase().includes(query) ||
        q.company.toLowerCase().includes(query) ||
        q.service.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Quotation KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quotation & Proposal Analytics
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Requirement 3 Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Quotations"
            metric={metrics.totalQuotations}
            icon={<FileText className="w-5 h-5 text-purple-500" />}
            subtitle="Issued proposals in period"
          />
          <MetricCard
            title="Total Quotation Value"
            metric={metrics.totalQuotationValue}
            icon={<BadgeDollarSign className="w-5 h-5 text-emerald-500" />}
            subtitle="Gross quoted volume"
          />
          <MetricCard
            title="Average Quote Value"
            metric={metrics.averageQuotationValue}
            icon={<Sparkles className="w-5 h-5 text-blue-500" />}
            subtitle="Mean contract proposal size"
          />
          <MetricCard
            title="Quote-to-Deal Rate"
            metric={metrics.quoteToDealConversionRate}
            icon={<Percent className="w-5 h-5 text-cyan-500" />}
            subtitle="Proposals closed won"
          />
          <MetricCard
            title="Accepted Quotations"
            metric={metrics.acceptedQuotations}
            icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />}
            subtitle="Signed client statements"
          />
        </div>
      </div>

      {/* 2. Quotations by Service & Category Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              Quotations Volume & Value by Service Line
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison of proposal frequency and aggregate quotation value
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {servicePerformance.length} core services
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={servicePerformance} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="service" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const svc = servicePerformance.find((s) => s.service === label);
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 text-xs shadow-xl space-y-1">
                        <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                        <p className="text-purple-400">Category: <strong>{svc?.category}</strong></p>
                        <p className="text-blue-400">Quotations Issued: <strong>{svc?.quoteCount}</strong></p>
                        <p className="text-emerald-400">Total Quoted Value: <strong>{formatCurrency(svc?.quoteValue || 0)}</strong></p>
                        <p className="text-cyan-400">Deals Won: <strong>{svc?.dealCount}</strong> (Rate: {svc?.conversionRate.toFixed(1)}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar yAxisId="left" dataKey="quoteCount" name="Quotes Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="quoteValue" name="Total Quoted ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Service-Wise Details Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Service-Wise Breakdown Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Granular breakdown of quote counts, gross values, deal closures, and conversion rates
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Service Line</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Quotes Issued</th>
                <th className="py-3 px-3">Total Quoted Value</th>
                <th className="py-3 px-3">Avg Quote Size</th>
                <th className="py-3 px-3 text-center">Deals Won</th>
                <th className="py-3 px-3 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {servicePerformance.map((svc) => {
                const avgVal = svc.quoteCount > 0 ? svc.quoteValue / svc.quoteCount : 0;
                return (
                  <tr key={svc.service} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {svc.service}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {svc.category}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {svc.quoteCount}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-emerald-400">
                      {formatCurrency(svc.quoteValue)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {formatCurrency(avgVal)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                      {svc.dealCount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {svc.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Lead-Wise Quotation History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lead-Wise Quotation History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive proposal history linked directly to lead accounts and downstream deals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search quotes, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter Quotations by Status"
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Under Review">Under Review</option>
              <option value="Sent">Sent</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Quote #</th>
                <th className="py-3 px-3">Lead Account</th>
                <th className="py-3 px-3">Service Line</th>
                <th className="py-3 px-3">Quotation Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3">Valid Until</th>
                <th className="py-3 px-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No quotations found matching filters.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => {
                  const badge = getStatusBadgeClasses(q.status);
                  return (
                    <tr
                      key={q.id}
                      onClick={() => onSelectEntity({ type: 'quotation', id: q.id })}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white group-hover:text-blue-500">
                        {q.quoteNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-200">{q.company}</div>
                        <div className="text-[10px] text-slate-400">{q.leadName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-300">{q.service}</div>
                        <div className="text-[10px] text-slate-400">{q.category}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-emerald-400">
                        {formatCurrency(q.finalValue)}
                        {q.discountPercent > 0 && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            ({q.discountPercent}% off ${formatCurrency(q.value)})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDate(q.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDate(q.validUntil)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntity({ type: 'quotation', id: q.id });
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <GitFork className="w-3 h-3" />
                          Inspect
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
