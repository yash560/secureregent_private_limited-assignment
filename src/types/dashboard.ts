export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Unqualified';
export type LeadSource = 
  | 'Inbound Website' 
  | 'Google Ads' 
  | 'LinkedIn Campaign' 
  | 'Enterprise Referral' 
  | 'Partner Network' 
  | 'Organic Search';

export type ServiceCategory = 
  | 'Cybersecurity Services' 
  | 'Compliance & Governance' 
  | 'Cloud Infrastructure' 
  | 'Managed Detection';

export type ServiceName = 
  | 'Cloud Security Audit' 
  | 'Penetration Testing' 
  | 'SOC 2 & ISO Compliance' 
  | 'DevSecOps Automation' 
  | 'Zero Trust Architecture' 
  | 'Managed SIEM & EDR';

export const SERVICES_LIST: ServiceName[] = [
  'Cloud Security Audit',
  'Penetration Testing',
  'SOC 2 & ISO Compliance',
  'DevSecOps Automation',
  'Zero Trust Architecture',
  'Managed SIEM & EDR',
];

export const SERVICE_CATEGORIES: Record<ServiceName, ServiceCategory> = {
  'Cloud Security Audit': 'Cybersecurity Services',
  'Penetration Testing': 'Cybersecurity Services',
  'SOC 2 & ISO Compliance': 'Compliance & Governance',
  'DevSecOps Automation': 'Cloud Infrastructure',
  'Zero Trust Architecture': 'Cloud Infrastructure',
  'Managed SIEM & EDR': 'Managed Detection',
};

export type QuotationStatus = 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Expired' | 'Rejected';

export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type DealPriority = 'High' | 'Medium' | 'Low';

export type OrderStatus = 'Pending' | 'In Progress' | 'Fulfillment' | 'Delivered' | 'Completed' | 'Cancelled';

export type PaymentStatus = 'Collected' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'Wire Transfer' | 'Stripe' | 'ACH Corporate' | 'Credit Card';

export interface Assignee {
  name: string;
  email: string;
  avatar: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  industry: string;
  estimatedValue: number;
  score: number;
  assignedTo: Assignee;
  createdAt: string; // ISO format
  updatedAt: string;
  notes: string;
}

export interface QuotationItem {
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  leadId: string;
  leadName: string;
  company: string;
  service: ServiceName;
  category: ServiceCategory;
  value: number;
  discountPercent: number;
  finalValue: number;
  status: QuotationStatus;
  createdAt: string;
  validUntil: string;
  convertedToDealId?: string;
  items: QuotationItem[];
}

export interface Deal {
  id: string;
  dealNumber: string;
  leadId: string;
  leadName: string;
  company: string;
  quotationId?: string;
  title: string;
  service: ServiceName;
  category: ServiceCategory;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  progressPercent: number; // 0 - 100
  probability: number; // 0 - 100
  createdAt: string;
  closedAt?: string;
  expectedCloseDate: string;
  assignedTo: Assignee;
}

export interface OrderMilestone {
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  dealId: string;
  dealTitle: string;
  leadId: string;
  leadName: string;
  company: string;
  service: ServiceName;
  orderValue: number;
  status: OrderStatus;
  progress: number; // 0 - 100
  startDate: string;
  targetCompletionDate: string;
  completedDate?: string;
  milestones: OrderMilestone[];
}

export interface Payment {
  id: string;
  paymentNumber: string;
  dealId: string;
  orderId?: string;
  leadId: string;
  leadName: string;
  company: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  referenceNumber: string;
}

export type DateFilterPreset = 'today' | '7days' | '30days' | 'custom';

export interface FilterState {
  preset: DateFilterPreset;
  customStartDate: string;
  customEndDate: string;
  serviceFilter: string; // 'all' or specific service
  categoryFilter: string; // 'all' or specific category
  searchQuery: string;
}

export interface PeriodDateRange {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
  currentLabel: string;
  previousLabel: string;
  daysDiff: number;
}

export interface MetricComparison {
  current: number;
  previous: number;
  percentChange: number; // e.g. +14.5 or -5.2
  absoluteChange: number;
  isPositiveGood: boolean;
  formattedCurrent: string;
  formattedPrevious: string;
}

export interface LeadAnalyticsMetrics {
  totalLeads: MetricComparison;
  qualifiedLeads: MetricComparison;
  convertedLeads: MetricComparison;
  unqualifiedLeads: MetricComparison;
  conversionRate: MetricComparison;
}

export interface QuotationAnalyticsMetrics {
  totalQuotations: MetricComparison;
  totalQuotationValue: MetricComparison;
  averageQuotationValue: MetricComparison;
  quoteToDealConversionRate: MetricComparison;
  acceptedQuotations: MetricComparison;
}

export interface DealsRevenueMetrics {
  totalDeals: MetricComparison;
  totalPipelineValue: MetricComparison;
  wonRevenue: MetricComparison;
  collectedRevenue: MetricComparison;
  outstandingRevenue: MetricComparison;
  averageDealProgress: MetricComparison;
}

export interface OrdersPaymentsMetrics {
  totalOrders: MetricComparison;
  completedOrders: MetricComparison;
  activeOrders: MetricComparison;
  totalCollections: MetricComparison;
  pendingCollections: MetricComparison;
  collectionRate: MetricComparison;
}

export interface FunnelStageData {
  stage: string;
  count: number;
  conversionFromPrev: number;
  conversionFromTop: number;
  value: number;
  color: string;
}

export interface StatusDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SourceTrendData {
  source: string;
  count: number;
  qualified: number;
  converted: number;
  conversionRate: number;
  color: string;
}

export interface ServicePerformance {
  service: string;
  category: string;
  quoteCount: number;
  quoteValue: number;
  dealCount: number;
  dealRevenue: number;
  orderCount: number;
  conversionRate: number;
}

export interface DailyRevenuePoint {
  date: string;
  currentRevenue: number;
  previousRevenue: number;
  currentCollected: number;
  currentDealsWon: number;
}

export interface DrillDownSelection {
  type: 'lead' | 'quotation' | 'deal' | 'order' | 'payment';
  id: string;
}
