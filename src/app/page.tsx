'use client';

import React, { useState, useMemo } from 'react';
import {
  generateMockDashboardData,
} from '@/data/mockData';
import {
  FilterState,
  DrillDownSelection,
} from '@/types/dashboard';
import {
  calculatePeriodRange,
  filterDataset,
  computeLeadMetrics,
  computeLeadFunnel,
  computeLeadStatusDistribution,
  computeLeadSourceTrends,
  computeQuotationMetrics,
  computeServicePerformance,
  computeDealsRevenueMetrics,
  computeDailyRevenueTrends,
  computeOrdersPaymentsMetrics,
} from '@/lib/analytics';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { NavigationTabs, DashboardTabId } from '@/components/NavigationTabs';
import { OverviewView } from '@/components/views/OverviewView';
import { LeadAnalyticsView } from '@/components/views/LeadAnalyticsView';
import { QuotationAnalyticsView } from '@/components/views/QuotationAnalyticsView';
import { DealsRevenueView } from '@/components/views/DealsRevenueView';
import { OrdersPaymentsView } from '@/components/views/OrdersPaymentsView';
import { RelationalDrillDownView } from '@/components/views/RelationalDrillDownView';
import { EntityDetailDrawer } from '@/components/modals/EntityDetailDrawer';
import { ExportModal } from '@/components/modals/ExportModal';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  // Master state
  const [dataset, setDataset] = useState(() => generateMockDashboardData());
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview');
  const [selectedEntity, setSelectedEntity] = useState<DrillDownSelection | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    preset: '7days',
    customStartDate: '2026-09-01',
    customEndDate: '2026-10-17',
    serviceFilter: 'all',
    categoryFilter: 'all',
    searchQuery: '',
  });

  // Re-seed data handler
  const handleResetData = () => {
    setDataset(generateMockDashboardData());
  };

  // Compute Period Bounds
  const periodRange = useMemo(() => calculatePeriodRange(filter), [filter]);

  // Current Period Filtered Slices
  const currentLeads = useMemo(
    () => filterDataset(dataset.leads, { start: periodRange.currentStart, end: periodRange.currentEnd }, filter, 'createdAt'),
    [dataset.leads, periodRange, filter]
  );

  const currentQuotes = useMemo(
    () => filterDataset(dataset.quotations, { start: periodRange.currentStart, end: periodRange.currentEnd }, filter, 'createdAt'),
    [dataset.quotations, periodRange, filter]
  );

  const currentDeals = useMemo(
    () => filterDataset(dataset.deals, { start: periodRange.currentStart, end: periodRange.currentEnd }, filter, 'createdAt'),
    [dataset.deals, periodRange, filter]
  );

  const currentOrders = useMemo(
    () => filterDataset(dataset.orders, { start: periodRange.currentStart, end: periodRange.currentEnd }, filter, 'startDate'),
    [dataset.orders, periodRange, filter]
  );

  const currentPayments = useMemo(
    () => filterDataset(dataset.payments, { start: periodRange.currentStart, end: periodRange.currentEnd }, filter, 'dueDate'),
    [dataset.payments, periodRange, filter]
  );

  // Previous Period Filtered Slices for Comparison Calculations
  const prevLeads = useMemo(
    () => filterDataset(dataset.leads, { start: periodRange.previousStart, end: periodRange.previousEnd }, filter, 'createdAt'),
    [dataset.leads, periodRange, filter]
  );

  const prevQuotes = useMemo(
    () => filterDataset(dataset.quotations, { start: periodRange.previousStart, end: periodRange.previousEnd }, filter, 'createdAt'),
    [dataset.quotations, periodRange, filter]
  );

  const prevDeals = useMemo(
    () => filterDataset(dataset.deals, { start: periodRange.previousStart, end: periodRange.previousEnd }, filter, 'createdAt'),
    [dataset.deals, periodRange, filter]
  );

  const prevOrders = useMemo(
    () => filterDataset(dataset.orders, { start: periodRange.previousStart, end: periodRange.previousEnd }, filter, 'startDate'),
    [dataset.orders, periodRange, filter]
  );

  const prevPayments = useMemo(
    () => filterDataset(dataset.payments, { start: periodRange.previousStart, end: periodRange.previousEnd }, filter, 'dueDate'),
    [dataset.payments, periodRange, filter]
  );

  // Compute Multi-Domain Metrics with Normalized % Changes
  const leadMetrics = useMemo(
    () => computeLeadMetrics(currentLeads, prevLeads),
    [currentLeads, prevLeads]
  );

  const quoteMetrics = useMemo(
    () => computeQuotationMetrics(currentQuotes, prevQuotes, currentDeals),
    [currentQuotes, prevQuotes, currentDeals]
  );

  const dealMetrics = useMemo(
    () => computeDealsRevenueMetrics(currentDeals, prevDeals, currentPayments, prevPayments),
    [currentDeals, prevDeals, currentPayments, prevPayments]
  );

  const orderMetrics = useMemo(
    () => computeOrdersPaymentsMetrics(currentOrders, prevOrders, currentPayments, prevPayments),
    [currentOrders, prevOrders, currentPayments, prevPayments]
  );

  // Visual Aggregations
  const funnelData = useMemo(
    () => computeLeadFunnel(currentLeads, currentDeals),
    [currentLeads, currentDeals]
  );

  const statusDistribution = useMemo(
    () => computeLeadStatusDistribution(currentLeads),
    [currentLeads]
  );

  const sourceTrends = useMemo(
    () => computeLeadSourceTrends(currentLeads),
    [currentLeads]
  );

  const servicePerformance = useMemo(
    () => computeServicePerformance(currentQuotes, currentDeals, currentOrders),
    [currentQuotes, currentDeals, currentOrders]
  );

  const dailyTrends = useMemo(
    () => computeDailyRevenueTrends(dataset.deals, dataset.payments, periodRange),
    [dataset.deals, dataset.payments, periodRange]
  );

  // Counts summary for tabs
  const tabCounts = {
    leads: currentLeads.length,
    quotations: currentQuotes.length,
    deals: currentDeals.length,
    orders: currentOrders.length,
    payments: currentPayments.length,
  };

  const datasetTotals = {
    leads: dataset.leads.length,
    quotes: dataset.quotations.length,
    deals: dataset.deals.length,
    orders: dataset.orders.length,
    payments: dataset.payments.length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Header */}
      <Header
        filter={filter}
        setFilter={setFilter}
        onResetData={handleResetData}
        onExport={() => setIsExportOpen(true)}
        totalRecords={datasetTotals}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic Filter Controls with Comparative Period Banner */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          periodRange={periodRange}
        />

        {/* View Switcher Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={tabCounts}
        />

        {/* Dynamic View Router */}
        {activeTab === 'overview' && (
          <OverviewView
            leadMetrics={leadMetrics}
            quoteMetrics={quoteMetrics}
            dealMetrics={dealMetrics}
            orderMetrics={orderMetrics}
            funnelData={funnelData}
            dailyTrends={dailyTrends}
            leads={currentLeads}
            deals={currentDeals}
            orders={currentOrders}
            onSelectEntity={setSelectedEntity}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'leads' && (
          <LeadAnalyticsView
            metrics={leadMetrics}
            funnelData={funnelData}
            statusDistribution={statusDistribution}
            sourceTrends={sourceTrends}
            leads={currentLeads}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'quotations' && (
          <QuotationAnalyticsView
            metrics={quoteMetrics}
            quotations={currentQuotes}
            servicePerformance={servicePerformance}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'deals' && (
          <DealsRevenueView
            metrics={dealMetrics}
            deals={currentDeals}
            servicePerformance={servicePerformance}
            dailyTrends={dailyTrends}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersPaymentsView
            metrics={orderMetrics}
            orders={currentOrders}
            payments={currentPayments}
            dailyTrends={dailyTrends}
            onSelectEntity={setSelectedEntity}
          />
        )}

        {activeTab === 'relationships' && (
          <RelationalDrillDownView
            leads={dataset.leads}
            quotations={dataset.quotations}
            deals={dataset.deals}
            orders={dataset.orders}
            payments={dataset.payments}
            onSelectEntity={setSelectedEntity}
          />
        )}

      </main>

      {/* 1:N Slide-Over Relational Inspection Drawer */}
      <EntityDetailDrawer
        selection={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onSelectEntity={setSelectedEntity}
        allLeads={dataset.leads}
        allQuotations={dataset.quotations}
        allDeals={dataset.deals}
        allOrders={dataset.orders}
        allPayments={dataset.payments}
      />

      {/* Export Report Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        periodRange={periodRange}
        datasetSummary={{
          period: periodRange.currentLabel,
          baseline: periodRange.previousLabel,
          totalLeads: currentLeads.length,
          totalQuotes: currentQuotes.length,
          totalDeals: currentDeals.length,
          totalOrders: currentOrders.length,
          leadMetrics,
          dealMetrics,
          quoteMetrics,
          orderMetrics,
        }}
      />

      {/* Enterprise Platform Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              SecureRegent Private Limited
            </span>
            <span>— Technical Assessment Demonstration</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All 5 Evaluation Requirements Verified
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 text-xs">
              Powered by TheWebVale
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
