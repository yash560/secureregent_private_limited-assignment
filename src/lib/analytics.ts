import {
  Lead,
  Quotation,
  Deal,
  Order,
  Payment,
  FilterState,
  PeriodDateRange,
  MetricComparison,
  LeadAnalyticsMetrics,
  QuotationAnalyticsMetrics,
  DealsRevenueMetrics,
  OrdersPaymentsMetrics,
  FunnelStageData,
  StatusDistribution,
  SourceTrendData,
  ServicePerformance,
  DailyRevenuePoint,
  ServiceName,
  SERVICES_LIST,
  SERVICE_CATEGORIES,
} from '@/types/dashboard';
import { formatCurrency, formatPercent } from './utils';

// Anchor date: Oct 17, 2026 23:59:59 (Today)
export const ANCHOR_DATE = new Date('2026-10-17T23:59:59.999Z');

/**
 * Calculates current and previous equivalent period dates.
 */
export function calculatePeriodRange(filter: FilterState): PeriodDateRange {
  const anchor = new Date(ANCHOR_DATE.getTime());

  let currentStart: Date;
  let currentEnd: Date;
  let previousStart: Date;
  let previousEnd: Date;
  let currentLabel: string;
  let previousLabel: string;
  let daysDiff: number;

  if (filter.preset === 'today') {
    currentStart = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 0, 0, 0);
    currentEnd = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 23, 59, 59, 999);

    previousStart = new Date(currentStart.getTime() - 86400000);
    previousEnd = new Date(currentEnd.getTime() - 86400000);

    currentLabel = 'Today (Oct 17, 2026)';
    previousLabel = 'Yesterday (Oct 16, 2026)';
    daysDiff = 1;
  } else if (filter.preset === '7days') {
    currentEnd = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 23, 59, 59, 999);
    currentStart = new Date(currentEnd.getTime() - 6 * 86400000);
    currentStart.setHours(0, 0, 0, 0);

    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getTime() - 6 * 86400000);
    previousStart.setHours(0, 0, 0, 0);

    currentLabel = 'Last 7 Days (Oct 11 - 17, 2026)';
    previousLabel = 'Previous 7 Days (Oct 04 - 10, 2026)';
    daysDiff = 7;
  } else if (filter.preset === '30days') {
    currentEnd = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 23, 59, 59, 999);
    currentStart = new Date(currentEnd.getTime() - 29 * 86400000);
    currentStart.setHours(0, 0, 0, 0);

    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getTime() - 29 * 86400000);
    previousStart.setHours(0, 0, 0, 0);

    currentLabel = 'Last 30 Days (Sep 18 - Oct 17, 2026)';
    previousLabel = 'Previous 30 Days (Aug 19 - Sep 17, 2026)';
    daysDiff = 30;
  } else {
    // Custom range
    currentStart = new Date(filter.customStartDate);
    currentStart.setHours(0, 0, 0, 0);
    currentEnd = new Date(filter.customEndDate);
    currentEnd.setHours(23, 59, 59, 999);

    if (isNaN(currentStart.getTime()) || isNaN(currentEnd.getTime()) || currentStart > currentEnd) {
      // Fallback to 7 days
      currentEnd = new Date(anchor.getTime());
      currentStart = new Date(currentEnd.getTime() - 6 * 86400000);
      currentStart.setHours(0, 0, 0, 0);
    }

    const durationMs = currentEnd.getTime() - currentStart.getTime() + 1;
    daysDiff = Math.max(1, Math.round(durationMs / 86400000));

    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getTime() - durationMs + 1);

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    currentLabel = `${fmt(currentStart)} - ${fmt(currentEnd)}`;
    previousLabel = `${fmt(previousStart)} - ${fmt(previousEnd)}`;
  }

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    currentLabel,
    previousLabel,
    daysDiff,
  };
}

/**
 * Filter an array of items by date range and optional service/category and search query.
 */
function isDateInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr).getTime();
  return d >= start.getTime() && d <= end.getTime();
}

export function filterDataset<T extends { createdAt?: string; startDate?: string; dueDate?: string; service?: string; category?: string; company?: string; name?: string; title?: string }>(
  items: T[],
  range: { start: Date; end: Date },
  filter: FilterState,
  dateField: keyof T = 'createdAt'
): T[] {
  return items.filter((item) => {
    const dStr = (item[dateField] as unknown as string) || (item.createdAt as unknown as string);
    if (!dStr || !isDateInRange(dStr, range.start, range.end)) return false;

    if (filter.serviceFilter && filter.serviceFilter !== 'all' && item.service) {
      if (item.service !== filter.serviceFilter) return false;
    }

    if (filter.categoryFilter && filter.categoryFilter !== 'all' && item.category) {
      if (item.category !== filter.categoryFilter) return false;
    }

    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchComp = item.company?.toLowerCase().includes(q);
      const matchName = item.name?.toLowerCase().includes(q);
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchService = item.service?.toLowerCase().includes(q);
      if (!matchComp && !matchName && !matchTitle && !matchService) return false;
    }

    return true;
  });
}

/**
 * Computes comparative metric calculation with percentage diff.
 */
export function computeComparison(
  current: number,
  previous: number,
  isCurrency: boolean = false,
  isPercentage: boolean = false,
  isPositiveGood: boolean = true
): MetricComparison {
  const diff = current - previous;
  let percentChange: number;

  if (previous === 0) {
    percentChange = current > 0 ? 100 : 0;
  } else {
    percentChange = (diff / Math.abs(previous)) * 100;
  }

  let formattedCurrent: string;
  let formattedPrevious: string;

  if (isCurrency) {
    formattedCurrent = formatCurrency(current);
    formattedPrevious = formatCurrency(previous);
  } else if (isPercentage) {
    formattedCurrent = `${current.toFixed(1)}%`;
    formattedPrevious = `${previous.toFixed(1)}%`;
  } else {
    formattedCurrent = current.toLocaleString('en-US');
    formattedPrevious = previous.toLocaleString('en-US');
  }

  return {
    current,
    previous,
    percentChange,
    absoluteChange: diff,
    isPositiveGood,
    formattedCurrent,
    formattedPrevious,
  };
}

/**
 * Lead Analytics Metrics calculation
 */
export function computeLeadMetrics(
  currentLeads: Lead[],
  prevLeads: Lead[]
): LeadAnalyticsMetrics {
  const curTotal = currentLeads.length;
  const prevTotal = prevLeads.length;

  const curQualified = currentLeads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Converted').length;
  const prevQualified = prevLeads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Converted').length;

  const curConverted = currentLeads.filter((l) => l.status === 'Converted').length;
  const prevConverted = prevLeads.filter((l) => l.status === 'Converted').length;

  const curUnqualified = currentLeads.filter((l) => l.status === 'Unqualified').length;
  const prevUnqualified = prevLeads.filter((l) => l.status === 'Unqualified').length;

  const curRate = curTotal > 0 ? (curConverted / curTotal) * 100 : 0;
  const prevRate = prevTotal > 0 ? (prevConverted / prevTotal) * 100 : 0;

  return {
    totalLeads: computeComparison(curTotal, prevTotal, false, false, true),
    qualifiedLeads: computeComparison(curQualified, prevQualified, false, false, true),
    convertedLeads: computeComparison(curConverted, prevConverted, false, false, true),
    unqualifiedLeads: computeComparison(curUnqualified, prevUnqualified, false, false, false), // Down is good
    conversionRate: computeComparison(curRate, prevRate, false, true, true),
  };
}

/**
 * Lead Funnel breakdown
 */
export function computeLeadFunnel(leads: Lead[], deals: Deal[]): FunnelStageData[] {
  const total = leads.length;
  const contacted = leads.filter((l) => l.status !== 'New').length;
  const qualified = leads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Converted').length;
  const proposal = leads.filter((l) => l.status === 'Proposal Sent' || l.status === 'Converted').length;
  const converted = leads.filter((l) => l.status === 'Converted').length;

  const totalValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const qualifiedValue = leads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Converted').reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const wonDealValue = deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);

  const stages: FunnelStageData[] = [
    {
      stage: 'Total Leads Ingested',
      count: total,
      conversionFromPrev: 100,
      conversionFromTop: 100,
      value: totalValue,
      color: '#6366f1', // Indigo
    },
    {
      stage: 'Contacted & Discovery',
      count: contacted,
      conversionFromPrev: total > 0 ? (contacted / total) * 100 : 0,
      conversionFromTop: total > 0 ? (contacted / total) * 100 : 0,
      value: Math.round(totalValue * 0.85),
      color: '#3b82f6', // Blue
    },
    {
      stage: 'Qualified Opportunities',
      count: qualified,
      conversionFromPrev: contacted > 0 ? (qualified / contacted) * 100 : 0,
      conversionFromTop: total > 0 ? (qualified / total) * 100 : 0,
      value: qualifiedValue,
      color: '#06b6d4', // Cyan
    },
    {
      stage: 'Security Proposals Sent',
      count: proposal,
      conversionFromPrev: qualified > 0 ? (proposal / qualified) * 100 : 0,
      conversionFromTop: total > 0 ? (proposal / total) * 100 : 0,
      value: Math.round(qualifiedValue * 0.72),
      color: '#8b5cf6', // Violet
    },
    {
      stage: 'Converted Enterprise Deals',
      count: converted,
      conversionFromPrev: proposal > 0 ? (converted / proposal) * 100 : 0,
      conversionFromTop: total > 0 ? (converted / total) * 100 : 0,
      value: wonDealValue,
      color: '#10b981', // Emerald
    },
  ];

  return stages;
}

/**
 * Lead Status distribution
 */
export function computeLeadStatusDistribution(leads: Lead[]): StatusDistribution[] {
  const counts: Record<string, number> = {};
  leads.forEach((l) => {
    counts[l.status] = (counts[l.status] || 0) + 1;
  });

  const total = leads.length || 1;
  const colorMap: Record<string, string> = {
    Converted: '#10b981',
    Qualified: '#3b82f6',
    'Proposal Sent': '#8b5cf6',
    Contacted: '#f59e0b',
    New: '#64748b',
    Unqualified: '#ef4444',
  };

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
    color: colorMap[name] || '#94a3b8',
  }));
}

/**
 * Lead Source trends
 */
export function computeLeadSourceTrends(leads: Lead[]): SourceTrendData[] {
  const sourceGroups: Record<string, { total: number; qualified: number; converted: number }> = {};

  leads.forEach((l) => {
    if (!sourceGroups[l.source]) {
      sourceGroups[l.source] = { total: 0, qualified: 0, converted: 0 };
    }
    sourceGroups[l.source].total += 1;
    if (l.status === 'Qualified' || l.status === 'Proposal Sent' || l.status === 'Converted') {
      sourceGroups[l.source].qualified += 1;
    }
    if (l.status === 'Converted') {
      sourceGroups[l.source].converted += 1;
    }
  });

  const colorMap: Record<string, string> = {
    'Inbound Website': '#3b82f6',
    'Google Ads': '#f59e0b',
    'LinkedIn Campaign': '#0ea5e9',
    'Enterprise Referral': '#10b981',
    'Partner Network': '#8b5cf6',
    'Organic Search': '#ec4899',
  };

  return Object.entries(sourceGroups).map(([source, stats]) => ({
    source,
    count: stats.total,
    qualified: stats.qualified,
    converted: stats.converted,
    conversionRate: stats.total > 0 ? (stats.converted / stats.total) * 100 : 0,
    color: colorMap[source] || '#6366f1',
  }));
}

/**
 * Quotation Analytics Metrics
 */
export function computeQuotationMetrics(
  currentQuotes: Quotation[],
  prevQuotes: Quotation[],
  deals: Deal[]
): QuotationAnalyticsMetrics {
  const curTotal = currentQuotes.length;
  const prevTotal = prevQuotes.length;

  const curVal = currentQuotes.reduce((acc, q) => acc + q.finalValue, 0);
  const prevVal = prevQuotes.reduce((acc, q) => acc + q.finalValue, 0);

  const curAvg = curTotal > 0 ? curVal / curTotal : 0;
  const prevAvg = prevTotal > 0 ? prevVal / prevTotal : 0;

  const curAccepted = currentQuotes.filter((q) => q.status === 'Accepted').length;
  const prevAccepted = prevQuotes.filter((q) => q.status === 'Accepted').length;

  const curRate = curTotal > 0 ? (curAccepted / curTotal) * 100 : 0;
  const prevRate = prevTotal > 0 ? (prevAccepted / prevTotal) * 100 : 0;

  return {
    totalQuotations: computeComparison(curTotal, prevTotal, false, false, true),
    totalQuotationValue: computeComparison(curVal, prevVal, true, false, true),
    averageQuotationValue: computeComparison(curAvg, prevAvg, true, false, true),
    quoteToDealConversionRate: computeComparison(curRate, prevRate, false, true, true),
    acceptedQuotations: computeComparison(curAccepted, prevAccepted, false, false, true),
  };
}

/**
 * Service & Category detailed breakdown
 */
export function computeServicePerformance(
  quotations: Quotation[],
  deals: Deal[],
  orders: Order[]
): ServicePerformance[] {
  const map: Record<string, ServicePerformance> = {};

  SERVICES_LIST.forEach((s) => {
    map[s] = {
      service: s,
      category: SERVICE_CATEGORIES[s],
      quoteCount: 0,
      quoteValue: 0,
      dealCount: 0,
      dealRevenue: 0,
      orderCount: 0,
      conversionRate: 0,
    };
  });

  quotations.forEach((q) => {
    if (map[q.service]) {
      map[q.service].quoteCount += 1;
      map[q.service].quoteValue += q.finalValue;
    }
  });

  deals.forEach((d) => {
    if (map[d.service]) {
      map[d.service].dealCount += 1;
      if (d.stage === 'Won') {
        map[d.service].dealRevenue += d.value;
      }
    }
  });

  orders.forEach((o) => {
    if (map[o.service]) {
      map[o.service].orderCount += 1;
    }
  });

  Object.values(map).forEach((item) => {
    item.conversionRate = item.quoteCount > 0 ? (item.dealCount / item.quoteCount) * 100 : 0;
  });

  return Object.values(map);
}

/**
 * Deals & Revenue Metrics
 */
export function computeDealsRevenueMetrics(
  currentDeals: Deal[],
  prevDeals: Deal[],
  currentPayments: Payment[],
  prevPayments: Payment[]
): DealsRevenueMetrics {
  const curTotal = currentDeals.length;
  const prevTotal = prevDeals.length;

  const curPipeline = currentDeals.reduce((acc, d) => acc + d.value, 0);
  const prevPipeline = prevDeals.reduce((acc, d) => acc + d.value, 0);

  const curWonDeals = currentDeals.filter((d) => d.stage === 'Won');
  const prevWonDeals = prevDeals.filter((d) => d.stage === 'Won');

  const curWonRev = curWonDeals.reduce((acc, d) => acc + d.value, 0);
  const prevWonRev = prevWonDeals.reduce((acc, d) => acc + d.value, 0);

  const curCollected = currentPayments.filter((p) => p.status === 'Collected').reduce((acc, p) => acc + p.amount, 0);
  const prevCollected = prevPayments.filter((p) => p.status === 'Collected').reduce((acc, p) => acc + p.amount, 0);

  const curOutstanding = Math.max(0, curWonRev - curCollected);
  const prevOutstanding = Math.max(0, prevWonRev - prevCollected);

  const curAvgProgress = curTotal > 0 ? currentDeals.reduce((acc, d) => acc + d.progressPercent, 0) / curTotal : 0;
  const prevAvgProgress = prevTotal > 0 ? prevDeals.reduce((acc, d) => acc + d.progressPercent, 0) / prevTotal : 0;

  return {
    totalDeals: computeComparison(curTotal, prevTotal, false, false, true),
    totalPipelineValue: computeComparison(curPipeline, prevPipeline, true, false, true),
    wonRevenue: computeComparison(curWonRev, prevWonRev, true, false, true),
    collectedRevenue: computeComparison(curCollected, prevCollected, true, false, true),
    outstandingRevenue: computeComparison(curOutstanding, prevOutstanding, true, false, false), // Down is good
    averageDealProgress: computeComparison(curAvgProgress, prevAvgProgress, false, true, true),
  };
}

/**
 * Daily Revenue Trends with previous equivalent period comparison
 */
export function computeDailyRevenueTrends(
  deals: Deal[],
  payments: Payment[],
  range: PeriodDateRange
): DailyRevenuePoint[] {
  const points: DailyRevenuePoint[] = [];
  const days = range.daysDiff;

  for (let i = 0; i < days; i++) {
    const curDate = new Date(range.currentStart.getTime() + i * 86400000);
    const prevDate = new Date(range.previousStart.getTime() + i * 86400000);

    const curDateStr = curDate.toISOString().split('T')[0];
    const prevDateStr = prevDate.toISOString().split('T')[0];

    // Current period day metrics
    const curWonDeals = deals.filter((d) => d.stage === 'Won' && d.createdAt.startsWith(curDateStr));
    const curRev = curWonDeals.reduce((sum, d) => sum + d.value, 0);
    const curPaid = payments.filter((p) => p.status === 'Collected' && (p.paidAt || p.dueDate).startsWith(curDateStr)).reduce((sum, p) => sum + p.amount, 0);

    // Prev period day metrics
    const prevWonDeals = deals.filter((d) => d.stage === 'Won' && d.createdAt.startsWith(prevDateStr));
    const prevRev = prevWonDeals.reduce((sum, d) => sum + d.value, 0);

    points.push({
      date: curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      currentRevenue: curRev,
      previousRevenue: prevRev,
      currentCollected: curPaid,
      currentDealsWon: curWonDeals.length,
    });
  }

  return points;
}

/**
 * Orders & Payments Metrics
 */
export function computeOrdersPaymentsMetrics(
  currentOrders: Order[],
  prevOrders: Order[],
  currentPayments: Payment[],
  prevPayments: Payment[]
): OrdersPaymentsMetrics {
  const curTotalOrders = currentOrders.length;
  const prevTotalOrders = prevOrders.length;

  const curCompletedOrders = currentOrders.filter((o) => o.status === 'Completed').length;
  const prevCompletedOrders = prevOrders.filter((o) => o.status === 'Completed').length;

  const curActive = currentOrders.filter((o) => o.status === 'In Progress' || o.status === 'Fulfillment').length;
  const prevActive = prevOrders.filter((o) => o.status === 'In Progress' || o.status === 'Fulfillment').length;

  const curCollected = currentPayments.filter((p) => p.status === 'Collected').reduce((acc, p) => acc + p.amount, 0);
  const prevCollected = prevPayments.filter((p) => p.status === 'Collected').reduce((acc, p) => acc + p.amount, 0);

  const curPending = currentPayments.filter((p) => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
  const prevPending = prevPayments.filter((p) => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);

  const curTotalBilled = curCollected + curPending;
  const prevTotalBilled = prevCollected + prevPending;

  const curRate = curTotalBilled > 0 ? (curCollected / curTotalBilled) * 100 : 0;
  const prevRate = prevTotalBilled > 0 ? (prevCollected / prevTotalBilled) * 100 : 0;

  return {
    totalOrders: computeComparison(curTotalOrders, prevTotalOrders, false, false, true),
    completedOrders: computeComparison(curCompletedOrders, prevCompletedOrders, false, false, true),
    activeOrders: computeComparison(curActive, prevActive, false, false, true),
    totalCollections: computeComparison(curCollected, prevCollected, true, false, true),
    pendingCollections: computeComparison(curPending, prevPending, true, false, false), // Down is good
    collectionRate: computeComparison(curRate, prevRate, false, true, true),
  };
}
