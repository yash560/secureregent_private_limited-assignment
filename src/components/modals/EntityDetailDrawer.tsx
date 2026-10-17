'use client';

import React from 'react';
import {
  X,
  User,
  FileText,
  BadgeDollarSign,
  Package,
  CreditCard,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
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

interface EntityDetailDrawerProps {
  selection: DrillDownSelection | null;
  onClose: () => void;
  onSelectEntity: (selection: DrillDownSelection) => void;
  allLeads: Lead[];
  allQuotations: Quotation[];
  allDeals: Deal[];
  allOrders: Order[];
  allPayments: Payment[];
}

export function EntityDetailDrawer({
  selection,
  onClose,
  onSelectEntity,
  allLeads,
  allQuotations,
  allDeals,
  allOrders,
  allPayments,
}: EntityDetailDrawerProps) {
  if (!selection) return null;

  // Resolve target entity & full relational hierarchy
  let targetLead: Lead | undefined;
  let targetQuote: Quotation | undefined;
  let targetDeal: Deal | undefined;
  let targetOrder: Order | undefined;
  let targetPayment: Payment | undefined;

  let relatedLead: Lead | undefined;
  let relatedQuotes: Quotation[] = [];
  let relatedDeals: Deal[] = [];
  let relatedOrders: Order[] = [];
  let relatedPayments: Payment[] = [];

  if (selection.type === 'lead') {
    targetLead = allLeads.find((l) => l.id === selection.id);
    relatedLead = targetLead;
    if (targetLead) {
      relatedQuotes = allQuotations.filter((q) => q.leadId === targetLead!.id);
      relatedDeals = allDeals.filter((d) => d.leadId === targetLead!.id);
      relatedOrders = allOrders.filter((o) => o.leadId === targetLead!.id);
      relatedPayments = allPayments.filter((p) => p.leadId === targetLead!.id);
    }
  } else if (selection.type === 'quotation') {
    targetQuote = allQuotations.find((q) => q.id === selection.id);
    if (targetQuote) {
      relatedLead = allLeads.find((l) => l.id === targetQuote!.leadId);
      relatedQuotes = [targetQuote];
      if (targetQuote.convertedToDealId) {
        relatedDeals = allDeals.filter((d) => d.id === targetQuote!.convertedToDealId);
      } else {
        relatedDeals = allDeals.filter((d) => d.quotationId === targetQuote!.id);
      }
      const dealIds = relatedDeals.map((d) => d.id);
      relatedOrders = allOrders.filter((o) => dealIds.includes(o.dealId));
      relatedPayments = allPayments.filter((p) => dealIds.includes(p.dealId));
    }
  } else if (selection.type === 'deal') {
    targetDeal = allDeals.find((d) => d.id === selection.id);
    if (targetDeal) {
      relatedLead = allLeads.find((l) => l.id === targetDeal!.leadId);
      relatedDeals = [targetDeal];
      relatedQuotes = allQuotations.filter((q) => q.id === targetDeal!.quotationId || q.leadId === targetDeal!.leadId);
      relatedOrders = allOrders.filter((o) => o.dealId === targetDeal!.id);
      relatedPayments = allPayments.filter((p) => p.dealId === targetDeal!.id);
    }
  } else if (selection.type === 'order') {
    targetOrder = allOrders.find((o) => o.id === selection.id);
    if (targetOrder) {
      relatedLead = allLeads.find((l) => l.id === targetOrder!.leadId);
      relatedDeals = allDeals.filter((d) => d.id === targetOrder!.dealId);
      relatedQuotes = allQuotations.filter((q) => q.leadId === targetOrder!.leadId);
      relatedOrders = [targetOrder];
      relatedPayments = allPayments.filter((p) => p.orderId === targetOrder!.id || p.dealId === targetOrder!.dealId);
    }
  } else if (selection.type === 'payment') {
    targetPayment = allPayments.find((p) => p.id === selection.id);
    if (targetPayment) {
      relatedLead = allLeads.find((l) => l.id === targetPayment!.leadId);
      relatedDeals = allDeals.filter((d) => d.id === targetPayment!.dealId);
      relatedQuotes = allQuotations.filter((q) => q.leadId === targetPayment!.leadId);
      relatedOrders = allOrders.filter((o) => o.id === targetPayment!.orderId || o.dealId === targetPayment!.dealId);
      relatedPayments = [targetPayment];
    }
  }

  const title = targetLead
    ? targetLead.company
    : targetQuote
    ? targetQuote.quoteNumber
    : targetDeal
    ? targetDeal.title
    : targetOrder
    ? targetOrder.orderNumber
    : targetPayment
    ? targetPayment.paymentNumber
    : 'Entity Details';

  const subtitle = targetLead
    ? `Lead ID: ${targetLead.leadNumber} • ${targetLead.name}`
    : targetQuote
    ? `Quotation for ${targetQuote.company} • ${targetQuote.service}`
    : targetDeal
    ? `Deal ID: ${targetDeal.dealNumber} • Stage: ${targetDeal.stage}`
    : targetOrder
    ? `Order for ${targetOrder.company} • ${targetOrder.service}`
    : targetPayment
    ? `Payment Ref: ${targetPayment.referenceNumber} • ${formatCurrency(targetPayment.amount)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {selection.type} Inspection
              </span>
              <span className="text-xs text-slate-400">1:N Relational Chain</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Connected Lead Card if available */}
          {relatedLead && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4 text-blue-500" />
                  Lead Account: {relatedLead.company}
                </div>
                {selection.type !== 'lead' && (
                  <button
                    onClick={() => onSelectEntity({ type: 'lead', id: relatedLead!.id })}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Drill into Lead <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Contact</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{relatedLead.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Acquisition Source</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{relatedLead.source}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', getStatusBadgeClasses(relatedLead.status).bg, getStatusBadgeClasses(relatedLead.status).text)}>
                    {relatedLead.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Industry</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{relatedLead.industry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Value</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(relatedLead.estimatedValue)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Account Lead</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{relatedLead.assignedTo.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Linked Quotations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-500" />
                Linked Quotations ({relatedQuotes.length})
              </h3>
            </div>
            {relatedQuotes.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center">
                No quotations issued yet for this account.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedQuotes.map((q) => {
                  const badge = getStatusBadgeClasses(q.status);
                  const isSelected = selection.type === 'quotation' && selection.id === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => onSelectEntity({ type: 'quotation', id: q.id })}
                      className={cn(
                        'p-3.5 rounded-xl border text-xs transition-all cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{q.quoteNumber}</span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                            {q.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-emerald-400">
                          {formatCurrency(q.finalValue)}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span>{q.service} • {q.category}</span>
                        <span>Created: {formatDate(q.createdAt)}</span>
                      </div>
                      {/* Line items if this quotation is actively selected */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Statement of Work (Deliverables):</span>
                          {q.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                              <span>{item.description} ({item.hours}h @ ${item.rate}/hr)</span>
                              <span className="font-mono font-medium">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Linked Deals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                Linked Deals ({relatedDeals.length})
              </h3>
            </div>
            {relatedDeals.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center">
                No active deals attached.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedDeals.map((d) => {
                  const stageBadge = getStatusBadgeClasses(d.stage);
                  const priorityBadge = getPriorityBadgeClasses(d.priority);
                  const isSelected = selection.type === 'deal' && selection.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => onSelectEntity({ type: 'deal', id: d.id })}
                      className={cn(
                        'p-3.5 rounded-xl border text-xs transition-all cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{d.dealNumber}</span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', stageBadge.bg, stageBadge.text)}>
                            {d.stage}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold border', priorityBadge.bg, priorityBadge.border)}>
                            {d.priority} Priority
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-emerald-400">
                          {formatCurrency(d.value)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Deal Progress</span>
                          <span className="font-semibold">{d.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${d.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Linked Orders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-cyan-500" />
                Linked Orders & Fulfillment ({relatedOrders.length})
              </h3>
            </div>
            {relatedOrders.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center">
                No orders fulfilled or scheduled yet.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedOrders.map((o) => {
                  const badge = getStatusBadgeClasses(o.status);
                  const isSelected = selection.type === 'order' && selection.id === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => onSelectEntity({ type: 'order', id: o.id })}
                      className={cn(
                        'p-3.5 rounded-xl border text-xs transition-all cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{o.orderNumber}</span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                            {o.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(o.orderValue)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Milestone Execution: {o.progress}%</span>
                          <span>Target: {formatDate(o.targetCompletionDate)}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all"
                            style={{ width: `${o.progress}%` }}
                          />
                        </div>
                      </div>
                      {/* Milestones list */}
                      <div className="mt-2.5 space-y-1">
                        {o.milestones.map((m, mIdx) => (
                          <div key={mIdx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className={cn('w-3.5 h-3.5', m.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700')} />
                            <span className={m.completed ? 'line-through text-slate-400' : ''}>{m.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Linked Payments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Linked Payments & Invoices ({relatedPayments.length})
              </h3>
            </div>
            {relatedPayments.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center">
                No payment transactions recorded.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedPayments.map((p) => {
                  const badge = getStatusBadgeClasses(p.status);
                  const isSelected = selection.type === 'payment' && selection.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectEntity({ type: 'payment', id: p.id })}
                      className={cn(
                        'p-3 rounded-xl border text-xs transition-all flex items-center justify-between',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      )}
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{p.paymentNumber}</span>
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Method: {p.paymentMethod} • Ref: {p.referenceNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-emerald-400">
                          {formatCurrency(p.amount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.paidAt ? `Paid ${formatDate(p.paidAt)}` : `Due ${formatDate(p.dueDate)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span>SecureRegent Audit Log: Verified Deterministic</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
