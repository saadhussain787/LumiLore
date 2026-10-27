/**
 * Sprint 13.1: Autonomous B2B Lead Radar & Social Listening Agent
 * Powered by Agent-Reach + ECC lead-intelligence
 * Monitors Reddit (r/aws, r/HVAC), Twitter/X, and Canadian business registries
 */

export const LEAD_RADAR_PRICING = {
  setupFee: 2800,
  retainerMin: 750,
  retainerMax: 1200,
  currency: 'CAD',
  summary: '$2,800 setup + $750–$1,200/mo retainer'
};

export const MONITORED_SURFACES = [
  { id: 'reddit_aws', platform: 'Reddit', channel: 'r/aws', lens: 'corporate', weight: 1.25 },
  { id: 'reddit_hvac', platform: 'Reddit', channel: 'r/HVAC', lens: 'trades', weight: 1.25 },
  { id: 'twitter_x', platform: 'Twitter/X', channel: 'X Technical Search', lens: 'both', weight: 1.15 },
  { id: 'business_registry', platform: 'Business Registry', channel: 'Ontario & Federal Corp Registry', lens: 'both', weight: 1.3 }
];

const HIGH_INTENT_KEYWORDS = [
  { term: 'nat gateway', points: 28, lens: 'corporate' },
  { term: 'aws bill', points: 30, lens: 'corporate' },
  { term: 'serverless architect', points: 34, lens: 'corporate' },
  { term: 'ca-central-1', points: 22, lens: 'corporate' },
  { term: 'rooftop unit', points: 30, lens: 'trades' },
  { term: 'commercial hvac', points: 32, lens: 'trades' },
  { term: 'emergency boiler', points: 35, lens: 'trades' },
  { term: 'missed calls', points: 26, lens: 'trades' },
  { term: 'looking for contractor', points: 30, lens: 'trades' },
  { term: 'rfp', points: 25, lens: 'both' },
  { term: 'budget', points: 20, lens: 'both' },
  { term: 'urgent', points: 18, lens: 'both' }
];

/**
 * Scores a raw social/registry signal (0-100) using ECC lead-intelligence taxonomy
 */
export function scoreBuyerSignal(signal = {}) {
  const text = `${signal.title || ''} ${signal.body || ''}`.toLowerCase();
  let rawScore = 30;
  const matchedKeywords = [];

  for (const kw of HIGH_INTENT_KEYWORDS) {
    if (text.includes(kw.term)) {
      rawScore += kw.points;
      matchedKeywords.push(kw.term);
    }
  }

  const surface = MONITORED_SURFACES.find(s => s.channel.toLowerCase() === String(signal.channel || '').toLowerCase());
  const multiplier = surface ? surface.weight : 1.0;
  const intentScore = Math.min(99, Math.round(rawScore * multiplier));

  const urgency = intentScore >= 90 ? 'CRITICAL' : intentScore >= 75 ? 'HIGH' : 'MODERATE';
  const lens = signal.channel === 'r/HVAC' || text.includes('hvac') || text.includes('boiler') ? 'trades' : 'corporate';

  const consultativeDraft = lens === 'trades'
    ? `Hi ${signal.author || 'there'} — our GTA commercial dispatch crew handles emergency rooftop & boiler triage with sub-60s automated routing. Happy to share our diagnostic checklist or connect you directly: https://lumilore.ca/contact/?service=lead-radar&lens=trades`
    : `Hi ${signal.author || 'there'} — we recently cut a similar ca-central-1 NAT Gateway & idle RDS workload by 68% using event-driven AWS Lambda & DynamoDB. Full architecture breakdown here: https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/`;

  return {
    signalId: signal.id || `RADAR-${Date.now()}`,
    channel: signal.channel || 'r/aws',
    author: signal.author || 'anonymous_buyer',
    intentScore,
    urgency,
    lens,
    matchedKeywords,
    consultativeDraft,
    bookingUrl: `/contact/?service=lead-radar&tier=retainer&lens=${lens}`
  };
}

/**
 * Runs a simulated 24/7 sweep across Reddit (r/aws, r/HVAC), Twitter/X, and Business Registries
 */
export function runLeadRadarSweep() {
  const sampleFeed = [
    {
      id: 'SIG-AWS-101',
      channel: 'r/aws',
      author: 'u/vp_eng_toronto',
      title: 'Urgent: AWS bill and NAT Gateway spend in ca-central-1 crossed $14k/mo',
      body: 'Looking for a serverless architect with budget approved for Q4 re-architecture.'
    },
    {
      id: 'SIG-HVAC-202',
      channel: 'r/HVAC',
      author: 'u/facility_dir_peel',
      title: 'Urgent commercial HVAC & emergency boiler RFP in Mississauga',
      body: 'Looking for contractor with 24/7 dispatch; current vendor missed calls all weekend.'
    },
    {
      id: 'SIG-X-303',
      channel: 'X Technical Search',
      author: '@cto_fintech_ca',
      title: 'Need an AWS bill audit for our ca-central-1 cluster',
      body: 'Urgent budget allocated for serverless architect sprint.'
    },
    {
      id: 'SIG-REG-404',
      channel: 'Ontario & Federal Corp Registry',
      author: 'ON-Corp-2948102',
      title: 'New Multi-Site Commercial HVAC & Mechanical Group Incorporated',
      body: 'Active RFP for automated dispatch and missed calls recovery.'
    }
  ];

  return sampleFeed.map(scoreBuyerSignal);
}

