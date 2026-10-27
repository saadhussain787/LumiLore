/**
 * Sprint 13.4: Self-Hosted Omnichannel WhatsApp & Customer Helpdesk
 * Powered by chatwoot/chatwoot + Hermes Agent gateway
 * Replaces Intercom/Zendesk with unified live chat, WhatsApp, SMS, and email desk
 */

export const OMNICHANNEL_HELPDESK_PRICING = {
  setupFee: 3200,
  monthlyRetainer: 450,
  currency: 'CAD',
  summary: '$3,200 setup + $450/mo retainer'
};

export const UNIFIED_CHANNELS = ['live_chat', 'whatsapp', 'sms', 'email'];

/**
 * Calculates annual SaaS seat-tax savings when replacing Intercom/Zendesk with LumiLore Chatwoot + Hermes
 */
export function calculateHelpdeskSaaSSavings(seatCount = 18, competitorSeatCostMonthly = 139) {
  const seats = Math.max(1, Number(seatCount) || 18);
  const legacyAnnualCost = seats * competitorSeatCostMonthly * 12;
  const lumiloreAnnualRetainer = OMNICHANNEL_HELPDESK_PRICING.monthlyRetainer * 12;
  const netAnnualSavings = Math.max(0, legacyAnnualCost - lumiloreAnnualRetainer);

  return {
    seats,
    legacyAnnualCost,
    lumiloreAnnualRetainer,
    setupFee: OMNICHANNEL_HELPDESK_PRICING.setupFee,
    netAnnualSavings,
    firstYearNetSavings: Math.max(0, netAnnualSavings - OMNICHANNEL_HELPDESK_PRICING.setupFee)
  };
}

/**
 * Routes an inbound customer message across WhatsApp, SMS, Live Chat, or Email through the Hermes L1 Gateway
 */
export function routeOmnichannelInquiry({ channel = 'whatsapp', sender = '+14165550192', message = '' } = {}) {
  const normalizedChannel = UNIFIED_CHANNELS.includes(String(channel).toLowerCase())
    ? String(channel).toLowerCase()
    : 'whatsapp';
  const text = String(message).toLowerCase();
  const requiresHumanEscalation = text.includes('refund') || text.includes('legal') || text.includes('escalate');

  return {
    engine: 'chatwoot/chatwoot + Hermes Agent Gateway',
    channel: normalizedChannel,
    sender,
    handledBy: requiresHumanEscalation ? 'human_agent_escalation' : 'hermes_l1_autonomous',
    status: requiresHumanEscalation ? 'open_assigned' : 'resolved_autonomous',
    responseLatencyMs: 340,
    bookingUrl: '/contact/?service=omnichannel-helpdesk&tier=retainer'
  };
}

