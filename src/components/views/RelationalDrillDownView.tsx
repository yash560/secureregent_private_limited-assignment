'use client';

import React, { useState } from 'react';
import {
  GitFork,
  User,
  FileText,
  BadgeDollarSign,
  Package,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building,
} from 'lucide-react';
import {
  Lead,
  Quotation,
  Deal,
  Order,
  Payment,
  DrillDownSelection,
} from '@/types/dashboard';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClasses,
  getPriorityBadgeClasses,
  cn,
} from '@/lib/utils';

interface RelationalDrillDownViewProps {
  leads: Lead[];
  quotations: Quotation[];
  deals: Deal[];
  orders: Order[];
  payments: Payment[];
  onSelectEntity: (selection: DrillDownSelection) => void;
}

export function RelationalDrillDownView({
  leads,
  quotations,
  deals,
  orders,
  payments,
  onSelectEntity,
}: RelationalDrillDownViewProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [searchLeadQuery, setSearchLeadQuery] = useState('');

  // Selected lead and its related graph
  const currentLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const linkedQuotes = currentLead ? quotations.filter((q) => q.leadId === currentLead.id) : [];
  const linkedDeals = currentLead ? deals.filter((d) => d.leadId === currentLead.id) : [];
  const linkedOrders = currentLead ? orders.filter((o) => o.leadId === currentLead.id) : [];
  const linkedPayments = currentLead ? payments.filter((p) => p.leadId === currentLead.id) : [];

  // Financial roll-ups for this lead
  const totalQuotedValue = linkedQuotes.reduce((sum, q) => sum + q.finalValue, 0);
  const totalWonDealValue = linkedDeals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);
  const totalCashCollected = linkedPayments.filter((p) => p.status === 'Collected').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = Math.max(0, totalWonDealValue - totalCashCollected);

  // Filter leads list
  const filteredLeads = leads.filter((l) => {
    if (!searchLeadQuery.trim()) return true;
    const q = searchLeadQuery.toLowerCase();
    return l.company.toLowerCase().includes(q) || l.name.toLowerCase().includes(q) || l.leadNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                1:N Relational Graph Engine
              </span>
              <span className="text-xs text-slate-400">Core Assignment Relationship Model</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitFork className="w-5 h-5 text-indigo-500" />
              Hierarchical 1:N Relationship Explorer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              1 Lead ➔ Multiple Quotations & Deals ➔ Multiple Orders & Milestone Payments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Pick Lead Account:</span>
            <select
              value={currentLead?.id || ''}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              aria-label="Select Lead Account for 1:N Drill-Down"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.company} ({l.leadNumber} - {l.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Account Selector / Right Relational Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lead Accounts List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-[780px]">
          <div className="mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Client Account ({filteredLeads.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchLeadQuery}
                onChange={(e) => setSearchLeadQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredLeads.map((l) => {
              const isSelected = l.id === currentLead?.id;
              const badge = getStatusBadgeClasses(l.status);
              const qCount = quotations.filter((q) => q.leadId === l.id).length;
              const dCount = deals.filter((d) => d.leadId === l.id).length;

              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLeadId(l.id)}
                  className={cn(
                    'p-3 rounded-xl border text-xs cursor-pointer transition-all',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                      {l.company}
                    </span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold', badge.bg, badge.text)}>
                      {l.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {l.industry} • {l.name}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{qCount} Quotes</span>
                    <span>{dCount} Deals</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(l.estimatedValue, true)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 1:N Branching Cascade Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Lead Header & Financial Health */}
          {currentLead && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {currentLead.company}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">({currentLead.leadNumber})</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentLead.name} • {currentLead.email} • {currentLead.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectEntity({ type: 'lead', id: currentLead.id })}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm w-fit"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Lead Drawer
                </button>
              </div>

              {/* Financial Rollup for this Lead */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Quoted</span>
                  <span className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
                    {formatCurrency(totalQuotedValue)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Deals Won Value</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalWonDealValue)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cash Collected</span>
                  <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalCashCollected)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Receivables Due</span>
                  <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                    {formatCurrency(totalOutstanding)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 1:N Branch 1: Quotations Hierarchy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Branch 1: Quotations Issued ({linkedQuotes.length})
              </h4>
            </div>

            {linkedQuotes.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
                No quotations have been prepared for this lead yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {linkedQuotes.map((q) => {
                  const badge = getStatusBadgeClasses(q.status);
                  return (
                    <div
                      key={q.id}
                      onClick={() => onSelectEntity({ type: 'quotation', id: q.id })}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer bg-slate-50/40 dark:bg-slate-950/40 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-purple-500">
                          {q.quoteNumber}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                          {q.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
                        {q.service}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Quoted Value:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-emerald-400">
                          {formatCurrency(q.finalValue)}
                        </span>
                      </div>
                      {q.convertedToDealId && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1 text-[10px] text-blue-500 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Converted to Deal ➔
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 1:N Branch 2: Deals, Orders & Milestone Payments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                Branch 2: Deals ➔ Orders ➔ Payments Cascade ({linkedDeals.length} Deals)
              </h4>
            </div>

            {linkedDeals.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
                No deals closed or underway yet for this account.
              </div>
            ) : (
              <div className="space-y-4">
                {linkedDeals.map((deal) => {
                  const dealOrders = linkedOrders.filter((o) => o.dealId === deal.id);
                  const dealPayments = linkedPayments.filter((p) => p.dealId === deal.id);
                  const stageBadge = getStatusBadgeClasses(deal.stage);
                  const priorityBadge = getPriorityBadgeClasses(deal.priority);

                  return (
                    <div
                      key={deal.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3.5"
                    >
                      {/* Deal Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {deal.dealNumber}
                            </span>
                            <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', stageBadge.bg, stageBadge.text)}>
                              {deal.stage}
                            </span>
                            <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold border', priorityBadge.bg, priorityBadge.border)}>
                              {deal.priority}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                            {deal.title}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-emerald-400">
                            {formatCurrency(deal.value)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Milestone Progress: {deal.progressPercent}%
                          </div>
                        </div>
                      </div>

                      {/* Nested Orders under this Deal */}
                      <div className="pl-3 border-l-2 border-cyan-500/50 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          Attached Orders ({dealOrders.length})
                        </div>

                        {dealOrders.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">No orders provisioned yet.</div>
                        ) : (
                          dealOrders.map((ord) => {
                            const ordBadge = getStatusBadgeClasses(ord.status);
                            return (
                              <div
                                key={ord.id}
                                onClick={() => onSelectEntity({ type: 'order', id: ord.id })}
                                className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-cyan-400 transition-all cursor-pointer text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>{ord.orderNumber}</span>
                                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-semibold', ordBadge.bg, ordBadge.text)}>
                                      {ord.status}
                                    </span>
                                  </div>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {formatCurrency(ord.orderValue)}
                                  </span>
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                                  <span>{ord.service}</span>
                                  <span>Target: {formatDate(ord.targetCompletionDate)}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Nested Payments under this Deal */}
                      <div className="pl-3 border-l-2 border-emerald-500/50 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          Attached Milestone Payments ({dealPayments.length})
                        </div>

                        {dealPayments.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">No payment receipts logged.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dealPayments.map((pay) => {
                              const payBadge = getStatusBadgeClasses(pay.status);
                              return (
                                <div
                                  key={pay.id}
                                  onClick={() => onSelectEntity({ type: 'payment', id: pay.id })}
                                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-emerald-400 transition-all cursor-pointer text-xs flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                      <span>{pay.paymentNumber}</span>
                                      <span className={cn('px-1.5 py-0.2 rounded text-[9px] font-semibold', payBadge.bg, payBadge.text)}>
                                        {pay.status}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      {pay.paymentMethod} • {pay.referenceNumber}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                      {formatCurrency(pay.amount)}
                                    </div>
                                    <div className="text-[9px] text-slate-400">
                                      {pay.paidAt ? formatDate(pay.paidAt) : 'Pending'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
