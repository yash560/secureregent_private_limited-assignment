import {
  Lead,
  Quotation,
  Deal,
  Order,
  Payment,
  LeadSource,
  LeadStatus,
  ServiceName,
  ServiceCategory,
  QuotationStatus,
  DealStage,
  DealPriority,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Assignee,
  SERVICE_CATEGORIES,
  SERVICES_LIST,
} from '@/types/dashboard';

export const ASSIGNEES: Assignee[] = [
  { name: 'Yash Jain', email: 'yash@secureregent.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { name: 'Elena Rostova', email: 'elena.r@secureregent.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face' },
  { name: 'Marcus Vance', email: 'marcus.v@secureregent.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Priya Sharma', email: 'priya.s@secureregent.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face' },
  { name: 'David Chen', email: 'david.c@secureregent.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
];

export const SOURCES_LIST: LeadSource[] = [
  'Inbound Website',
  'Google Ads',
  'LinkedIn Campaign',
  'Enterprise Referral',
  'Partner Network',
  'Organic Search',
];

interface CompanyProfile {
  name: string;
  contact: string;
  industry: string;
  phone: string;
  email: string;
}

const COMPANIES: CompanyProfile[] = [
  { name: 'Apex Sentinel Corp', contact: 'Alexander Wright', industry: 'Enterprise SaaS', phone: '+1 (555) 234-8901', email: 'a.wright@apexsentinel.io' },
  { name: 'Quantum Vault Systems', contact: 'Dr. Sarah Lin', industry: 'FinTech & Banking', phone: '+1 (555) 876-5432', email: 'sarah.lin@quantumvault.net' },
  { name: 'Nexus Global Health', contact: 'Julian Sterling', industry: 'Healthcare & Pharma', phone: '+1 (555) 345-6789', email: 'j.sterling@nexusglobalhealth.com' },
  { name: 'Hyperion Logistics Cloud', contact: 'Marcus Vance Jr.', industry: 'Supply Chain & Transport', phone: '+1 (555) 987-6543', email: 'marcus@hyperionlogistics.com' },
  { name: 'Aegis Wealth Management', contact: 'Claire Beauchamp', industry: 'Investment Banking', phone: '+1 (555) 432-1098', email: 'c.beauchamp@aegiswealth.com' },
  { name: 'OmniShield Aerospace', contact: 'Vikram Mehta', industry: 'Aerospace & Defense', phone: '+1 (555) 654-3210', email: 'v.mehta@omnishieldaero.com' },
  { name: 'Titan Edge Media', contact: 'Sophia Ramirez', industry: 'Streaming & Media', phone: '+1 (555) 321-7654', email: 'sophia@titanedgemedia.com' },
  { name: 'Sovereign Trust Microgrid', contact: 'Arthur Pendelton', industry: 'Clean Energy & Utilities', phone: '+1 (555) 789-0123', email: 'a.pendelton@sovereigntrust.org' },
  { name: 'Helix BioTherapeutics', contact: 'Dr. Evelyn Zhao', industry: 'Biotechnology', phone: '+1 (555) 210-9876', email: 'ezhao@helixbio.org' },
  { name: 'Prism Cloud Platform', contact: 'Lucas Meyer', industry: 'Cloud & Infrastructure', phone: '+1 (555) 543-2109', email: 'lucas@prismcloud.tech' },
  { name: 'Beacon Telematics Network', contact: 'Nadia Petrov', industry: 'IoT & Connected Devices', phone: '+1 (555) 890-1234', email: 'n.petrov@beacontelematics.com' },
  { name: 'Ironclad Retail Group', contact: 'Ethan Ward', industry: 'E-Commerce & Retail', phone: '+1 (555) 678-9012', email: 'eward@ironcladretail.com' },
  { name: 'Starlight Defense Systems', contact: 'Col. Robert Hayes', industry: 'Government Contracting', phone: '+1 (555) 901-2345', email: 'rhayes@starlightdefense.gov' },
  { name: 'NovaStream Payments', contact: 'Jessica Liu', industry: 'Payment Gateway', phone: '+1 (555) 456-7890', email: 'jliu@novastreampay.com' },
  { name: 'Cobalt Genomics Inc', contact: 'Tariq Al-Mansoor', industry: 'Life Sciences', phone: '+1 (555) 765-4321', email: 'tariq@cobaltgenomics.com' },
  { name: 'Zenith Insurance Alliance', contact: 'Hannah Abbott', industry: 'InsurTech', phone: '+1 (555) 123-8901', email: 'h.abbott@zenithalliance.com' },
  { name: 'Vanguard Gaming Studios', contact: 'Liam O’Connor', industry: 'Interactive Entertainment', phone: '+1 (555) 234-5678', email: 'liam@vanguardstudios.io' },
  { name: 'Fortress Real Estate Core', contact: 'Victoria Blackwood', industry: 'Commercial Real Estate', phone: '+1 (555) 345-9012', email: 'vblackwood@fortresscore.com' },
  { name: 'Crestline Automotive AI', contact: 'Daniel Rossi', industry: 'Autonomous Vehicles', phone: '+1 (555) 456-1234', email: 'd.rossi@crestlineauto.ai' },
  { name: 'Aura AI Language Models', contact: 'Dr. Chloe Dubois', industry: 'Artificial Intelligence', phone: '+1 (555) 567-8901', email: 'chloe@auramodels.ai' },
  { name: 'Pulse Telecom Americas', contact: 'Carlos Mendoza', industry: 'Telecommunications', phone: '+1 (555) 678-2345', email: 'cmendoza@pulsetelecom.net' },
  { name: 'Equinox Capital Group', contact: 'Rachel Green-Sterling', industry: 'Private Equity', phone: '+1 (555) 789-3456', email: 'rachel@equinoxcap.com' },
  { name: 'Solaris Energy Grid', contact: 'Kenji Takahashi', industry: 'Renewable Power', phone: '+1 (555) 890-4567', email: 'kenji@solarispower.jp' },
  { name: 'ShieldPoint Cyber Insurance', contact: 'Olivia Thorne', industry: 'Underwriting & Risk', phone: '+1 (555) 901-5678', email: 'olivia@shieldpoint.insure' },
  { name: 'Krypton Data Foundry', contact: 'Mateo Morales', industry: 'Data Warehousing', phone: '+1 (555) 012-6789', email: 'mateo@kryptondata.io' },
];

/**
 * Generate a complete, interlinked dataset with high relational integrity.
 * Spans from July 20, 2026 up to October 17, 2026 (Today).
 */
export function generateMockDashboardData() {
  const leads: Lead[] = [];
  const quotations: Quotation[] = [];
  const deals: Deal[] = [];
  const orders: Order[] = [];
  const payments: Payment[] = [];

  // Deterministic PRNG to ensure reproducibility across hydration
  let seed = 42;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  function randomChoice<T>(arr: readonly T[]): T {
    return arr[Math.floor(random() * arr.length)];
  }

  function randomInt(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  // Base reference date: Oct 17, 2026 13:30:00
  const refDate = new Date('2026-10-17T13:30:00Z');

  // We generate 50 leads with varied creation dates spanning past 85 days
  COMPANIES.forEach((comp, idx) => {
    // Generate 2 leads for some companies to simulate ongoing multi-subsidiary engagements
    const leadsForCompany = idx % 3 === 0 ? 2 : 1;

    for (let l = 0; l < leadsForCompany; l++) {
      const leadId = `lead-${leads.length + 1}`;
      const leadNum = `LD-${1000 + leads.length + 1}`;

      // Distribute creation dates:
      // - Some today (Oct 17, 2026)
      // - Some yesterday (Oct 16, 2026)
      // - Some in last 7 days (Oct 11 - Oct 17)
      // - Some in previous 7 days (Oct 04 - Oct 10)
      // - Some in last 30 days (Sep 18 - Oct 17)
      // - Some older (July - Sep)
      let daysAgo: number;
      if (leads.length === 0) daysAgo = 0; // Today
      else if (leads.length === 1) daysAgo = 0; // Today
      else if (leads.length === 2) daysAgo = 1; // Yesterday
      else if (leads.length <= 8) daysAgo = randomInt(1, 6); // Last 7 days
      else if (leads.length <= 16) daysAgo = randomInt(7, 13); // Previous 7 days
      else if (leads.length <= 32) daysAgo = randomInt(14, 29); // Rest of last 30 days
      else daysAgo = randomInt(30, 80); // Older

      const leadDate = new Date(refDate.getTime() - daysAgo * 86400000 - randomInt(1000, 36000000));
      const source = randomChoice(SOURCES_LIST);
      
      // Determine status with realistic distribution
      let status: LeadStatus;
      const statusRoll = random();
      if (statusRoll < 0.35) status = 'Converted';
      else if (statusRoll < 0.65) status = 'Qualified';
      else if (statusRoll < 0.78) status = 'Proposal Sent';
      else if (statusRoll < 0.88) status = 'Contacted';
      else if (statusRoll < 0.94) status = 'New';
      else status = 'Unqualified';

      const assignee = ASSIGNEES[leads.length % ASSIGNEES.length];
      const estValue = randomInt(15, 120) * 1000;
      const score = status === 'Converted' ? randomInt(85, 99) : status === 'Qualified' ? randomInt(70, 88) : randomInt(30, 75);

      const lead: Lead = {
        id: leadId,
        leadNumber: leadNum,
        name: comp.contact,
        company: comp.name + (l > 0 ? ` (Branch ${l + 1})` : ''),
        email: comp.email,
        phone: comp.phone,
        source,
        status,
        industry: comp.industry,
        estimatedValue: estValue,
        score,
        assignedTo: assignee,
        createdAt: leadDate.toISOString(),
        updatedAt: new Date(leadDate.getTime() + randomInt(1, 10) * 86400000).toISOString(),
        notes: `Enterprise inbound for ${comp.industry} infrastructure vulnerability scanning, compliance audit, and automated posture verification.`,
      };
      leads.push(lead);

      // --- 1:N Quotations for this lead ---
      // Converted or Proposal or Qualified leads have 1 to 3 quotations
      const numQuotes = status === 'Converted' ? randomInt(1, 3) : status === 'Proposal Sent' ? randomInt(1, 2) : status === 'Qualified' ? (random() > 0.3 ? 1 : 0) : (random() > 0.8 ? 1 : 0);

      for (let q = 0; q < numQuotes; q++) {
        const quoteId = `quote-${quotations.length + 1}`;
        const quoteNum = `QT-${2000 + quotations.length + 1}`;
        const service = SERVICES_LIST[(quotations.length + q) % SERVICES_LIST.length];
        const category = SERVICE_CATEGORIES[service];
        
        // Quote created after lead
        const quoteDate = new Date(leadDate.getTime() + randomInt(1, 4) * 86400000);
        // Cap at today
        if (quoteDate > refDate) quoteDate.setTime(refDate.getTime() - randomInt(100, 3600000));

        let quoteStatus: QuotationStatus;
        if (status === 'Converted' && q === 0) quoteStatus = 'Accepted';
        else if (status === 'Converted') quoteStatus = randomChoice(['Accepted', 'Rejected', 'Expired'] as const);
        else if (status === 'Proposal Sent') quoteStatus = randomChoice(['Sent', 'Under Review'] as const);
        else quoteStatus = randomChoice(['Draft', 'Sent', 'Under Review', 'Expired'] as const);

        const hours = randomInt(40, 200);
        const rate = randomChoice([175, 200, 225, 250, 300]);
        const grossValue = hours * rate;
        const discount = randomChoice([0, 5, 10, 15]);
        const finalValue = Math.round(grossValue * (1 - discount / 100));

        const quote: Quotation = {
          id: quoteId,
          quoteNumber: quoteNum,
          leadId: lead.id,
          leadName: lead.name,
          company: lead.company,
          service,
          category,
          value: grossValue,
          discountPercent: discount,
          finalValue,
          status: quoteStatus,
          createdAt: quoteDate.toISOString(),
          validUntil: new Date(quoteDate.getTime() + 30 * 86400000).toISOString(),
          items: [
            { description: `${service} Phase 1 - Architecture Review & Threat Model`, hours: Math.round(hours * 0.4), rate, amount: Math.round(hours * 0.4 * rate) },
            { description: `${service} Phase 2 - Deep Penetration & Exploitation Run`, hours: Math.round(hours * 0.4), rate, amount: Math.round(hours * 0.4 * rate) },
            { description: `${service} Phase 3 - Remediation Verification & Executive Sign-off`, hours: Math.round(hours * 0.2), rate, amount: Math.round(hours * 0.2 * rate) },
          ],
        };
        quotations.push(quote);

        // --- 1:N Deals for this Lead & Quotation ---
        if (quoteStatus === 'Accepted' || (status === 'Converted' && q === 0) || (status === 'Qualified' && random() > 0.6)) {
          const dealId = `deal-${deals.length + 1}`;
          const dealNum = `DL-${3000 + deals.length + 1}`;
          quote.convertedToDealId = dealId;

          const dealDate = new Date(quoteDate.getTime() + randomInt(1, 5) * 86400000);
          if (dealDate > refDate) dealDate.setTime(refDate.getTime() - randomInt(100, 3600000));

          let stage: DealStage = 'Won';
          if (status !== 'Converted') {
            stage = randomChoice(['Discovery', 'Proposal', 'Negotiation'] as const);
          }

          const priority: DealPriority = randomChoice(['High', 'Medium', 'Low'] as const);
          const progressPercent = stage === 'Won' ? 100 : stage === 'Negotiation' ? randomInt(70, 90) : stage === 'Proposal' ? randomInt(40, 60) : randomInt(15, 30);
          const probability = stage === 'Won' ? 100 : stage === 'Negotiation' ? 80 : stage === 'Proposal' ? 50 : 25;

          const deal: Deal = {
            id: dealId,
            dealNumber: dealNum,
            leadId: lead.id,
            leadName: lead.name,
            company: lead.company,
            quotationId: quote.id,
            title: `${lead.company} - ${service}`,
            service,
            category,
            value: quote.finalValue,
            stage,
            priority,
            progressPercent,
            probability,
            createdAt: dealDate.toISOString(),
            closedAt: stage === 'Won' ? new Date(dealDate.getTime() + randomInt(2, 10) * 86400000).toISOString() : undefined,
            expectedCloseDate: new Date(dealDate.getTime() + randomInt(10, 45) * 86400000).toISOString(),
            assignedTo: assignee,
          };
          deals.push(deal);

          // --- 1:N Orders for this Deal ---
          if (stage === 'Won') {
            const numOrders = randomChoice([1, 1, 2]);
            for (let o = 0; o < numOrders; o++) {
              const orderId = `order-${orders.length + 1}`;
              const orderNum = `ORD-${4000 + orders.length + 1}`;
              const orderVal = Math.round(deal.value / numOrders);

              const orderStart = new Date(dealDate.getTime() + randomInt(1, 3) * 86400000);
              if (orderStart > refDate) orderStart.setTime(refDate.getTime() - randomInt(50, 3600000));

              let ordStatus: OrderStatus;
              let ordProgress: number;
              const ordRoll = random();
              if (ordRoll < 0.55) {
                ordStatus = 'Completed';
                ordProgress = 100;
              } else if (ordRoll < 0.8) {
                ordStatus = 'In Progress';
                ordProgress = randomInt(40, 85);
              } else if (ordRoll < 0.92) {
                ordStatus = 'Fulfillment';
                ordProgress = randomInt(80, 95);
              } else {
                ordStatus = 'Pending';
                ordProgress = 10;
              }

              const targetDate = new Date(orderStart.getTime() + randomInt(15, 45) * 86400000);
              const completedDate = ordStatus === 'Completed' ? new Date(orderStart.getTime() + randomInt(10, 30) * 86400000) : undefined;

              const order: Order = {
                id: orderId,
                orderNumber: orderNum,
                dealId: deal.id,
                dealTitle: deal.title,
                leadId: lead.id,
                leadName: lead.name,
                company: lead.company,
                service,
                orderValue: orderVal,
                status: ordStatus,
                progress: ordProgress,
                startDate: orderStart.toISOString(),
                targetCompletionDate: targetDate.toISOString(),
                completedDate: completedDate?.toISOString(),
                milestones: [
                  { title: 'Scoping & Threat Model Baseline', completed: ordProgress >= 30, dueDate: new Date(orderStart.getTime() + 7 * 86400000).toISOString() },
                  { title: 'Zero-Day Vulnerability Scanning', completed: ordProgress >= 65, dueDate: new Date(orderStart.getTime() + 18 * 86400000).toISOString() },
                  { title: 'Remediation Audit & Compliance Attestation', completed: ordProgress === 100, dueDate: targetDate.toISOString() },
                ],
              };
              orders.push(order);

              // --- 1:N Payments for this Deal & Order ---
              // Typically 2 milestone payments: 50% Upfront, 50% On Completion
              const paymentCount = 2;
              for (let p = 0; p < paymentCount; p++) {
                const payId = `pay-${payments.length + 1}`;
                const payNum = `PAY-${5000 + payments.length + 1}`;
                const amount = Math.round(orderVal / 2);
                const payMethod = randomChoice(['Wire Transfer', 'Stripe', 'ACH Corporate', 'Credit Card'] as const);

                const isUpfront = p === 0;
                let payStatus: PaymentStatus;
                let paidAt: string | undefined;

                if (isUpfront) {
                  // Upfront is collected 92% of time
                  if (random() > 0.08) {
                    payStatus = 'Collected';
                    paidAt = new Date(orderStart.getTime() + randomInt(1, 3) * 86400000).toISOString();
                  } else {
                    payStatus = 'Pending';
                  }
                } else {
                  // Second milestone is collected if completed, or pending/failed
                  if (ordStatus === 'Completed') {
                    payStatus = 'Collected';
                    paidAt = (completedDate || new Date(orderStart.getTime() + 20 * 86400000)).toISOString();
                  } else if (ordStatus === 'In Progress' || ordStatus === 'Fulfillment') {
                    payStatus = random() > 0.4 ? 'Collected' : 'Pending';
                    if (payStatus === 'Collected') {
                      paidAt = new Date(orderStart.getTime() + 10 * 86400000).toISOString();
                    }
                  } else {
                    payStatus = 'Pending';
                  }
                }

                const payment: Payment = {
                  id: payId,
                  paymentNumber: payNum,
                  dealId: deal.id,
                  orderId: order.id,
                  leadId: lead.id,
                  leadName: lead.name,
                  company: lead.company,
                  amount,
                  paymentMethod: payMethod,
                  status: payStatus,
                  dueDate: new Date(orderStart.getTime() + (isUpfront ? 5 : 30) * 86400000).toISOString(),
                  paidAt,
                  referenceNumber: `SR-TX-${randomInt(100000, 999999)}`,
                };
                payments.push(payment);
              }
            }
          }
        }
      }
    }
  });

  return { leads, quotations, deals, orders, payments };
}
