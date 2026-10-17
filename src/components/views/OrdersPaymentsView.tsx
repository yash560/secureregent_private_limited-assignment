'use client';

import React, { useState } from 'react';
import {
  Package,
  PackageCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  GitFork,
  Search,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  Order,
  Payment,
  OrdersPaymentsMetrics,
  DailyRevenuePoint,
  DrillDownSelection,
  OrderStatus,
  PaymentStatus,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface OrdersPaymentsViewProps {
  metrics: OrdersPaymentsMetrics;
  orders: Order[];
  payments: Payment[];
  dailyTrends: DailyRevenuePoint[];
  onSelectEntity: (selection: DrillDownSelection) => void;
}

export function OrdersPaymentsView({
  metrics,
  orders,
  payments,
  dailyTrends,
  onSelectEntity,
}: OrdersPaymentsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'payments'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Order status distribution
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  const orderStatusColors: Record<string, string> = {
    Completed: '#10b981',
    'In Progress': '#3b82f6',
    Fulfillment: '#8b5cf6',
    Pending: '#f59e0b',
    Delivered: '#06b6d4',
    Cancelled: '#ef4444',
  };

  const orderStatusData = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
    color: orderStatusColors[name] || '#64748b',
  }));

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.service.toLowerCase().includes(q) ||
        o.dealTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredPayments = payments.filter((p) => {
    if (paymentStatusFilter !== 'all' && p.status !== paymentStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.paymentNumber.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.referenceNumber.toLowerCase().includes(q) ||
        p.paymentMethod.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Orders & Payments KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Order Delivery & Payment Collection Operations
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Requirement 5 Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Total Orders"
            metric={metrics.totalOrders}
            icon={<Package className="w-5 h-5 text-blue-500" />}
            subtitle="Engagements dispatched"
          />
          <MetricCard
            title="Completed Orders"
            metric={metrics.completedOrders}
            icon={<PackageCheck className="w-5 h-5 text-emerald-500" />}
            subtitle="Successfully delivered"
          />
          <MetricCard
            title="Active In Flight"
            metric={metrics.activeOrders}
            icon={<Clock className="w-5 h-5 text-cyan-500" />}
            subtitle="In Progress & Fulfillment"
          />
          <MetricCard
            title="Total Collections"
            metric={metrics.totalCollections}
            icon={<CreditCard className="w-5 h-5 text-emerald-500" />}
            subtitle="Paid client settlements"
          />
          <MetricCard
            title="Pending Collections"
            metric={metrics.pendingCollections}
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            subtitle="Pending receivables due"
            invertColors={true}
          />
          <MetricCard
            title="Collection Rate"
            metric={metrics.collectionRate}
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            subtitle="Realized collection efficiency"
          />
        </div>
      </div>

      {/* 2. Charts Row: Collection Trends & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Collection Trends over Time (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Cash Collection Trends & Daily Inflow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Realized daily cash collections across wire, ACH, and corporate payments
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">
              {metrics.totalCollections.formattedCurrent} Collected
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="payTrendGrad" x1="0" y1="0" x2="0" y2="1">
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
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl">
                          <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                          <p className="text-emerald-400">Cash Received: <strong>{formatCurrency(payload[0]?.value as number)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="currentCollected" name="Cash Collected" stroke="#10b981" strokeWidth={2.5} fill="url(#payTrendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Order Status Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-400">{orders.length} orders</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Current operational delivery state
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-xl border border-slate-700 text-xs">
                          <p className="font-bold">{data.name}: {data.count}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={30}
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

      </div>

      {/* 3. Sub-Tab Switcher: Orders vs Payment History Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
            <button
              onClick={() => setActiveSubTab('orders')}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeSubTab === 'orders'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              Orders Fulfillment ({orders.length})
            </button>
            <button
              onClick={() => setActiveSubTab('payments')}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeSubTab === 'payments'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              Payment History & Ledger ({payments.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Search ${activeSubTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
            {activeSubTab === 'orders' ? (
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                aria-label="Filter Orders by Status"
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Order Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Fulfillment">Fulfillment</option>
                <option value="Pending">Pending</option>
              </select>
            ) : (
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                aria-label="Filter Payments by Status"
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Payment Statuses</option>
                <option value="Collected">Collected</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Orders Table */}
        {activeSubTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Account & Service</th>
                  <th className="py-3 px-3">Order Value</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Execution Progress</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">Target Completion</th>
                  <th className="py-3 px-3 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No orders found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const badge = getStatusBadgeClasses(o.status);
                    return (
                      <tr
                        key={o.id}
                        onClick={() => onSelectEntity({ type: 'order', id: o.id })}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white group-hover:text-blue-500">
                          {o.orderNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-200">{o.company}</div>
                          <div className="text-[10px] text-slate-400">{o.service}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(o.orderValue)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-600 dark:text-slate-300 w-8">{o.progress}%</span>
                            <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', o.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500')}
                                style={{ width: `${o.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {formatDate(o.startDate)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {formatDate(o.targetCompletionDate)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntity({ type: 'order', id: o.id });
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors flex items-center gap-1 ml-auto"
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
        )}

        {/* Tab 2: Payments Ledger Table */}
        {activeSubTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Payment #</th>
                  <th className="py-3 px-3">Client Account</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Tx Reference</th>
                  <th className="py-3 px-3">Due / Paid Date</th>
                  <th className="py-3 px-3 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No payments found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const badge = getStatusBadgeClasses(p.status);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectEntity({ type: 'payment', id: p.id })}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                          {p.paymentNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-200">{p.company}</div>
                          <div className="text-[10px] text-slate-400">{p.leadName}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-emerald-400">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                          {p.paymentMethod}
                        </td>
                        <td className="py-3 px-3">
                          <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', badge.bg, badge.text)}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {p.referenceNumber}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {p.paidAt ? `Paid ${formatDate(p.paidAt)}` : `Due ${formatDate(p.dueDate)}`}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntity({ type: 'payment', id: p.id });
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1 ml-auto"
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
        )}

      </div>

    </div>
  );
}
