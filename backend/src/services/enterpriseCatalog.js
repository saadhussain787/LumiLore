/**
 * LumiLore Sprint 13: High-Ticket Enterprise Service Catalog (Commercial Offerings)
 * Authoritative Data Contracts, Pricing Models, SLA Deliverables & Calculation Helpers
 */

export const ENTERPRISE_CATALOG_OFFERINGS = [
  {
    id: '13.1',
    slug: 'lead-radar',
    title: 'Autonomous B2B Lead Radar & Social Listening Agent',
    shortTitle: 'B2B Lead Radar & Social Listening',
    icon: '📡',
    accentColor: 'emerald',
    badge: 'AGENT-REACH + ECC',
    poweredBy: ['Agent-Reach', 'ECC lead-intelligence'],
    pricing: {
      model: 'setup_plus_retainer',
      setupFee: 2800,
      retainerMin: 750,
      retainerMax: 1200,
      currency: 'CAD',
      displayLabel: '$2,800 setup + $750–$1,200/mo retainer',
      shortPrice: '$2,800 + $750/mo'
    },
    channelsMonitored: [
      'Reddit (r/aws, r/HVAC, r/devops, r/Plumbing, r/smallbusiness)',
      'Twitter/X Technical Distress Signals & Buyer Threads',
      'Canadian & Provincial Business Registries (New Incorporations & RFPs)'
    ],
    deliverables: [
      '24/7 autonomous social & registry listening pipeline with sub-5-minute alert latency',
      'Weighted buyer-intent scoring (0–100) filtering noise from active budget holders',
      'Consultative technical draft generation in founder persona with canonical proof links',
      'Real-time Slack/Teams/Email hot-lead dossier dispatch with 1-click CRM ingestion'
    ],
    dualLens: {
      corporate: {
        headline: 'Intercept Cloud & AI Buyers Before They Issue an RFP',
        targetSignals: 'r/aws, r/devops, CTO distress threads, Series A/B Canadian tech registries',
        avgDealValue: 18500
      },
      trades: {
        headline: 'Capture Emergency Commercial & Residential HVAC/Plumbing Leads 24/7',
        targetSignals: 'r/HVAC, local neighbourhood groups, commercial facility maintenance RFPs',
        avgDealValue: 4200
      }
    }
  },
  {
    id: '13.2',
    slug: 'ai-security',
    title: 'Zero-Trust AI Security & Penetration Audit',
    shortTitle: 'Zero-Trust AI Security Audit',
    icon: '🛡️',
    accentColor: 'cyan',
    badge: 'SKILLSPECTOR + AGENTSHIELD',
    poweredBy: ['NVIDIA/SkillSpector', 'ECC AgentShield', 'Cloudflare Security Audit'],
    pricing: {
      model: 'tiered_audit',
      flatAuditFee: 3500,
      fullHardeningFee: 7500,
      currency: 'CAD',
      displayLabel: '$3,500 flat audit / $7,500 with full hardening',
      shortPrice: '$3,500 / $7,500'
    },
    ruleCount: 108,
    attackVectors: [
      'Indirect & Direct Prompt Injection (Jailbreak & System Override)',
      'PII, Credentials & Training Data Exfiltration Leaks',
      'Server-Side Request Forgery (SSRF) & Tool-Call Privilege Escalation',
      'PIPEDA, SOC-2 Type II & Canadian Sovereignty Compliance Gaps'
    ],
    deliverables: [
      '100+ rule automated red-team penetration suite against production LLM endpoints & MCP tools',
      'Executive CISO Vulnerability Scorecard with CVSS-aligned severity ratings',
      'Zero-trust input/output guardrail deployment (AWS Bedrock Guardrails + Cloudflare WAF)',
      'Cryptographic audit certification & post-remediation re-verification pass'
    ],
    dualLens: {
      corporate: {
        headline: 'Harden Enterprise AI Agents Against Prompt Injection & Data Exfiltration',
        targetSignals: 'Production RAG pipelines, customer-facing chatbots, internal MCP tool servers',
        complianceStandard: 'SOC-2 Type II & PIPEDA'
      },
      trades: {
        headline: 'Protect Customer Billing, Dispatch Records & Voice Agents from Cyber Threats',
        targetSignals: 'AI voice receptionists, automated SMS quoting bots, ServiceTitan/Jobber webhooks',
        complianceStandard: 'Canadian PIPEDA & PCI-DSS'
      }
    }
  },
  {
    id: '13.3',
    slug: 'ai-brain',
    title: 'Private Corporate "AI Brain" & Self-Maintaining Wiki',
    shortTitle: 'Private Corporate AI Brain & Wiki',
    icon: '🧠',
    accentColor: 'purple',
    badge: 'WEKNORA + HERMES AGENT',
    poweredBy: ['Tencent/WeKnora', 'NousResearch/hermes-agent'],
    pricing: {
      model: 'setup_plus_hosting',
      setupFee: 4500,
      monthlyHostingFee: 500,
      currency: 'CAD',
      displayLabel: '$4,500 setup + $500/mo cloud hosting',
      shortPrice: '$4,500 + $500/mo'
    },
    supportedChannels: ['Slack', 'Microsoft Teams', 'WhatsApp Business', 'Internal Web Portal'],
    deliverables: [
      'Private single-tenant AWS vector knowledge graph (`ca-central-1` data residency)',
      'Automated ingestion of company SOPs, engineering manuals, PDFs, and historical invoices',
      'Hermes Agent closed learning loop that self-updates wiki pages when procedures evolve',
      'Instant cited answers via Slack, Microsoft Teams, or WhatsApp with zero public AI training'
    ],
    dualLens: {
      corporate: {
        headline: 'Turn Institutional Engineering & Ops Knowledge Into an Instant Slack/Teams Oracle',
        sampleQuery: 'What is our SOC-2 incident escalation SLA for production RDS failovers?',
        timeSavedPerEmployeeHrsWk: 6.5
      },
      trades: {
        headline: 'Give Field Technicians Instant WhatsApp Access to Equipment Manuals & Pricing SOPs',
        sampleQuery: 'What is the diagnostic fault code sequence and warranty part # for a LennoxSLP99V?',
        timeSavedPerEmployeeHrsWk: 8.0
      }
    }
  },
  {
    id: '13.4',
    slug: 'omnichannel-helpdesk',
    title: 'Self-Hosted Omnichannel WhatsApp & Customer Helpdesk',
    shortTitle: 'Omnichannel WhatsApp & Helpdesk',
    icon: '💬',
    accentColor: 'amber',
    badge: 'CHATWOOT + HERMES GATEWAY',
    poweredBy: ['chatwoot/chatwoot', 'Hermes Agent Gateway'],
    pricing: {
      model: 'setup_plus_retainer',
      setupFee: 3200,
      monthlyRetainer: 450,
      currency: 'CAD',
      displayLabel: '$3,200 setup + $450/mo retainer',
      shortPrice: '$3,200 + $450/mo'
    },
    channelsUnified: ['WhatsApp Business API', 'Two-Way SMS', 'Live Web Chat', 'Support Email Desk'],
    deliverables: [
      'Dedicated self-hosted Chatwoot cluster on AWS eliminating per-seat Intercom/Zendesk SaaS tax',
      'Autonomous Hermes Agent L1 triage resolving 70%+ of routine inquiries with <3s latency',
      'Seamless human-in-the-loop escalation with full conversation context and CRM ticket sync',
      'Unlimited agent seats with zero per-resolution or per-seat surcharge penalties'
    ],
    dualLens: {
      corporate: {
        headline: 'Eliminate $3,000+/mo Intercom & Zendesk Seat Taxes with Sovereign AI Triage',
        replacedPlatforms: 'Intercom, Zendesk Enterprise, Drift',
        avgPerSeatSaaSCost: 139
      },
      trades: {
        headline: 'Unify Customer WhatsApp, SMS Quotes, Dispatch Texts & Emails in One Command Desk',
        replacedPlatforms: 'Podium, Birdeye, fragmented technician SMS threads',
        avgPerSeatSaaSCost: 185
      }
    }
  },
  {
    id: '13.5',
    slug: 'video-reels',
    title: 'Autonomous Video Repurposing & Viral Reel Engine',
    shortTitle: 'Video Repurposing & Viral Reel Engine',
    icon: '🎬',
    accentColor: 'rose',
    badge: 'HYPIT + VOICESTUDIO',
    poweredBy: ['hypit-ai/hypit', 'debpalash/VoiceStudio'],
    pricing: {
      model: 'monthly_retainer_range',
      retainerMin: 1500,
      retainerMax: 2500,
      currency: 'CAD',
      displayLabel: '$1,500–$2,500/mo retainer',
      shortPrice: '$1,500–$2,500/mo'
    },
    reelsPerWebinar: 15,
    aspectRatio: '9:16 Vertical (1080x1920)',
    deliverables: [
      'Automated semantic highlight detection slicing 60-minute webinars/demos into 15 viral 9:16 reels',
      'Active speaker face-tracking crop with burnt-in kinetic typography subtitles',
      'VoiceStudio neural voice cloning & DSP studio mastering for multilingual or B-roll narration',
      'Omnichannel publishing package formatted for YouTube Shorts, LinkedIn Video, Instagram Reels & TikTok'
    ],
    dualLens: {
      corporate: {
        headline: 'Transform 1 Executive Webinar or Product Demo Into 15 High-Converting B2B Reels',
        sourceMaterial: 'Town halls, architecture teardowns, podcast appearances, product launches',
        monthlyOutputCount: 15
      },
      trades: {
        headline: 'Turn Job-Site Walkthroughs Into 15 Local Viral Reels with Cloned Voiceovers',
        sourceMaterial: 'Mechanical room installs, emergency repair explainers, customer testimonials',
        monthlyOutputCount: 15
      }
    }
  },
  {
    id: '13.6',
    slug: 'ai-finops',
    title: 'Enterprise AI Inference & Cloud FinOps Optimization',
    shortTitle: 'AI Inference & Cloud FinOps',
    icon: '📉',
    accentColor: 'indigo',
    badge: 'OMNIROUTE + ECC FINOPS',
    poweredBy: ['cheaper-inference/OmniRoute', 'ECC FinOps', 'Google PageSpeed & open-seo Telemetry'],
    pricing: {
      model: 'flat_or_performance',
      flatSprintFee: 2500,
      performanceSharePct: 25,
      savingsRangeMinPct: 30,
      savingsRangeMaxPct: 70,
      currency: 'CAD',
      displayLabel: '$2,500 flat sprint OR 25% of verified annual savings',
      shortPrice: '$2,500 OR 25% Savings'
    },
    deliverables: [
      'OmniRoute intelligent multi-provider LLM gateway routing prompts across Bedrock, OpenAI, Anthropic & Gemini',
      'Semantic prompt caching & token compression cutting ongoing AI inference bills by 30%–70%',
      'AWS Serverless FinOps right-sizing eliminating idle NAT Gateways, over-provisioned RDS, and zombie EC2s',
      'Real-time cost-per-request telemetry dashboard with automated quota failover protection'
    ],
    dualLens: {
      corporate: {
        headline: 'Slash Production AI Inference & AWS Cloud Bills by 30%–70% Without Accuracy Loss',
        targetSpend: 'High-volume OpenAI/Anthropic API bills, unoptimized AWS ECS/RDS clusters',
        defaultMonthlySpend: 12000
      },
      trades: {
        headline: 'Eliminate Bloated Hosting, Overlapping SaaS & AI Voice Overages Across Your Fleet',
        targetSpend: 'Overpriced agency hosting, high-volume voice/SMS AI usage, legacy server bills',
        defaultMonthlySpend: 3500
      }
    }
  }
];

/**
 * Lookup offering by canonical slug or alias
 */
export const ENTERPRISE_SLUG_ALIASES = {
  'lead-radar': 'lead-radar',
  'lead_radar': 'lead-radar',
  'b2b-lead-radar': 'lead-radar',
  'social-listening': 'lead-radar',
  'agent-reach': 'lead-radar',
  'ai-security': 'ai-security',
  'ai_security': 'ai-security',
  'security-audit': 'ai-security',
  'penetration-audit': 'ai-security',
  'skillspector': 'ai-security',
  'agentshield': 'ai-security',
  'ai-brain': 'ai-brain',
  'ai_brain': 'ai-brain',
  'corporate-wiki': 'ai-brain',
  'weknora': 'ai-brain',
  'hermes-wiki': 'ai-brain',
  'omnichannel-helpdesk': 'omnichannel-helpdesk',
  'omnichannel_helpdesk': 'omnichannel-helpdesk',
  'helpdesk': 'omnichannel-helpdesk',
  'chatwoot': 'omnichannel-helpdesk',
  'whatsapp-helpdesk': 'omnichannel-helpdesk',
  'video-reels': 'video-reels',
  'video_reels': 'video-reels',
  'viral-reels': 'video-reels',
  'hypit': 'video-reels',
  'voicestudio': 'video-reels',
  'ai-finops': 'ai-finops',
  'ai_finops': 'ai-finops',
  'finops': 'ai-finops',
  'omniroute': 'ai-finops',
  'inference-optimization': 'ai-finops',
  'enterprise-catalog': 'custom-enterprise'
};

export function getEnterpriseOfferingBySlug(rawSlug) {
  if (!rawSlug) return null;
  const clean = String(rawSlug).toLowerCase().trim();
  const canonical = ENTERPRISE_SLUG_ALIASES[clean] || clean;
  return ENTERPRISE_CATALOG_OFFERINGS.find(item => item.slug === canonical) || null;
}

export function getAllEnterpriseOfferings() {
  return ENTERPRISE_CATALOG_OFFERINGS;
}

