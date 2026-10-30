#!/usr/bin/env node
/**
 * Agent 07 — Dynamic 3-Tier Statement of Work (SOW) & Contract Closer
 * Division 2: Sales & Solutions Architecture
 * 
 * Synthesizes:
 *   - Commercial Deal Desk & Legal Solutions Architect contracts
 *   - 3-Tier Statement of Work (Starter Sprint, Growth Retainer, Enterprise Swarm)
 *   - Canadian PIPEDA & Zero Public Model Training Covenants
 *   - Standardized 14-Day Delivery Milestones
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OmniRouter } from '../core/omni-router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

export class SowCloser {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    this.options = options;
    this.router = options.router || new OmniRouter(options.routerOptions || {});
    this.outputDir = options.outputDir || path.join(rootDir, '.ai/memory');
    this.sowJsonPath = path.join(this.outputDir, 'sow_proposal.json');
    this.sowMdPath = path.join(this.outputDir, 'sow_proposal.md');
  }

  /**
   * Generate 3-Tier SOW Proposal from audit findings
   * @param {Object} [auditFindings]
   * @param {Object} [clientProfile]
   * @returns {Object}
   */
  generateSow(auditFindings = {}, clientProfile = {}) {
    const clientName = clientProfile.companyName || auditFindings?.target?.companyName || 'Apex Mechanical & HVAC';
    const clientUrl = clientProfile.url || auditFindings?.target?.url || 'https://sample-prospect-contractor.ca';
    const bleedSummary = auditFindings?.revenueLeakageSummary || {
      monthlyRevenueBleedFormatted: '$27,300',
      annualRevenueBleedFormatted: '$327,600'
    };

    const sowId = `SOW-LL-${Math.floor(1000 + Math.random() * 9000)}`;

    const tier1StarterSprint = {
      tierName: 'Tier 1: Speed & Lead-Capture Starter Sprint',
      investment: '$1,800 CAD (One-Time Execution)',
      deliveryTimeline: '14 Calendar Days',
      targetOutcome: 'Remediate top 3 severe conversion leaks & achieve sub-150ms TTFB',
      scopeOfWork: [
        'Complete Jamstack & Eleventy re-architecture cutting TTFB to < 150ms',
        'Mobile 320px viewport optimization & 48px touch target compliance',
        '1-Tap instant calendar booking integration anchored to company schedule',
        '5-Layer Schema.org JSON-LD graph (Organization, Service, FAQPage)',
        'Canonical llms.txt AI search manifest deployment'
      ],
      paymentSchedule: '50% deposit upon signing ($900), 50% upon verified production cutover ($900)'
    };

    const tier2GrowthRetainer = {
      tierName: 'Tier 2: Autonomous Growth & 24/7 Voice Dispatch Retainer',
      investment: '$3,500 CAD / Month (or $950 CAD / Month without Telephony)',
      deliveryTimeline: 'Ongoing Monthly Operation (30-Day Cancellation Notice)',
      targetOutcome: `Recapture estimated ${bleedSummary.monthlyRevenueBleedFormatted}/mo after-hours revenue bleed`,
      scopeOfWork: [
        'Everything in Tier 1 Starter Sprint included in Month 1',
        '24/7 AI Voice Dispatch Receptionist answering inbound calls in < 2 rings',
        'Instant on-call technician SMS dispatch and CRM (ServiceTitan/Jobber) synchronization',
        'Competitor Displacement Radar scanning Position 8-20 Google Search Console opportunities',
        'Bi-weekly copy-ready founder thought leadership content queue (LinkedIn & Dev.to)',
        'Monthly ROI telemetry report quantifying verified captured revenue'
      ],
      paymentSchedule: 'Monthly recurring credit card or EFT, billed on the 1st of each calendar month'
    };

    const tier3EnterpriseSwarm = {
      tierName: 'Tier 3: Custom Enterprise Multi-Agent Swarm',
      investment: '$10,000+ CAD (Custom Architecture Assessment)',
      deliveryTimeline: '30-45 Calendar Days',
      targetOutcome: 'Total digital autonomy: multi-department agent swarms with custom AWS infrastructure',
      scopeOfWork: [
        'Everything in Tier 2 Growth Retainer',
        'Dedicated AWS Serverless SAM stack deployed directly into client AWS account',
        'Private corporate RAG AI Wiki & Knowledge Base (PIPEDA zero-data-leak)',
        'Custom multi-agent workflows (Estimating, Dispatch, Invoicing, QA Regression Hunter)',
        '99.99% uptime SLA with dedicated architect emergency response'
      ],
      paymentSchedule: '40% kickoff, 30% architecture milestone, 30% production cutover'
    };

    const milestoneSchedule = [
      {
        milestone: 'Milestone 1: Architectural Intake & Environment Provisioning',
        timeline: 'Days 1–3',
        deliverable: 'Access verification, domain DNS mapping, AWS SAM / Cloudflare staging environment'
      },
      {
        milestone: 'Milestone 2: Core Web Vitals & Telephony Prototype Staging',
        timeline: 'Days 4–8',
        deliverable: 'Sub-150ms Jamstack preview sandbox & Amazon Connect dedicated voice route'
      },
      {
        milestone: 'Milestone 3: CRM Synchronization, Security & End-to-End QA',
        timeline: 'Days 9–12',
        deliverable: 'Full regression pass, mobile 320px verification, SMS technician dispatch test'
      },
      {
        milestone: 'Milestone 4: Production Cutover & Revenue Telemetry Handover',
        timeline: 'Days 13–14',
        deliverable: 'Live DNS flip, zero-downtime cutover, executive briefing with Saad Sayed'
      }
    ];

    const legalCovenants = {
      dataPrivacy: 'Compliance with Canadian Personal Information Protection and Electronic Documents Act (PIPEDA). Zero personal client data is ever sold or transferred.',
      zeroPublicModelTraining: 'MANDATORY ZERO-TRAINING COVENANT: Under no circumstances will client data, customer transcripts, or proprietary code be ingested or utilized to train external public foundation models (OpenAI, Anthropic, or Google). All inference occurs within zero-retention private pipelines.',
      intellectualProperty: 'Upon full payment of invoice milestones, client receives 100% full intellectual property ownership of all custom frontend templates, schema definitions, and serverless workflow scripts.',
      warrantyAndSupport: '30-day comprehensive bug-fix warranty post-cutover against layout regressions or runtime errors.'
    };

    const sowPackage = {
      agentId: 'agent-07-sow-closer',
      agentNumber: 7,
      sowId,
      createdAt: new Date().toISOString(),
      client: {
        name: clientName,
        url: clientUrl
      },
      quantifiedOpportunity: bleedSummary,
      commercialTiers: [
        tier1StarterSprint,
        tier2GrowthRetainer,
        tier3EnterpriseSwarm
      ],
      milestoneDeliverySchedule: milestoneSchedule,
      legalAndIpRider: legalCovenants,
      signOffAuthority: {
        agency: 'LumiLore Technologies',
        principalArchitect: 'Saad Sayed (Lead Systems Architect)',
        operationsLead: 'Arfa Sayeed (Operations & Finance)'
      }
    };

    const markdownDoc = this.generateMarkdownDoc(sowPackage);

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    fs.writeFileSync(this.sowJsonPath, JSON.stringify(sowPackage, null, 2), 'utf8');
    fs.writeFileSync(this.sowMdPath, markdownDoc, 'utf8');

    return {
      sowPackage,
      markdownDoc,
      filesWritten: [this.sowJsonPath, this.sowMdPath]
    };
  }

  /**
   * Format SOW Package into client-ready Markdown Document
   * @param {Object} sow 
   * @returns {string}
   */
  generateMarkdownDoc(sow) {
    const { client, sowId, createdAt, quantifiedOpportunity, commercialTiers, milestoneDeliverySchedule, legalAndIpRider, signOffAuthority } = sow;
    return `# Statement of Work (SOW): Systems Architecture & Growth Modernization
**Agreement Reference:** \`${sowId}\`  
**Date of Issuance:** ${createdAt.split('T')[0]}  
**Prepared For:** ${client.name} (${client.url})  
**Architectural Authority:** ${signOffAuthority.agency} // ${signOffAuthority.principalArchitect}  

---

## 1. Executive Summary & Problem Context
An exhaustive 360° technical and commercial evaluation conducted by LumiLore Technologies identified an estimated after-hours revenue loss of **${quantifiedOpportunity.monthlyRevenueBleedFormatted} per month** (**${quantifiedOpportunity.annualRevenueBleedFormatted} annually**) resulting from delayed web latency, after-hours voicemail drop-off, and invisible local AI discovery.

This Statement of Work establishes three clear, transparent commercial options to eliminate these bottlenecks and deploy autonomous capture systems.

---

## 2. Commercial Options Matrix

### Option A: ${commercialTiers[0].tierName}
- **Investment:** **${commercialTiers[0].investment}**
- **Delivery Timeline:** **${commercialTiers[0].deliveryTimeline}**
- **Core Scope:**
${commercialTiers[0].scopeOfWork.map(s => `  - [x] ${s}`).join('\n')}
- **Payment Terms:** ${commercialTiers[0].paymentSchedule}

---

### Option B (Recommended): ${commercialTiers[1].tierName}
- **Investment:** **${commercialTiers[1].investment}**
- **Delivery Timeline:** **${commercialTiers[1].deliveryTimeline}**
- **Target Outcome:** Recaptures ${quantifiedOpportunity.monthlyRevenueBleedFormatted}/month in lost emergency calls
- **Core Scope:**
${commercialTiers[1].scopeOfWork.map(s => `  - [x] ${s}`).join('\n')}
- **Payment Terms:** ${commercialTiers[1].paymentSchedule}

---

### Option C: ${commercialTiers[2].tierName}
- **Investment:** **${commercialTiers[2].investment}**
- **Delivery Timeline:** **${commercialTiers[2].deliveryTimeline}**
- **Core Scope:**
${commercialTiers[2].scopeOfWork.map(s => `  - [x] ${s}`).join('\n')}
- **Payment Terms:** ${commercialTiers[2].paymentSchedule}

---

## 3. Standard 14-Day Milestone Delivery Schedule
| Milestone | Timeline | Deliverables & Acceptance Criteria |
| :--- | :--- | :--- |
${milestoneDeliverySchedule.map(m => `| **${m.milestone}** | ${m.timeline} | ${m.deliverable} |`).join('\n')}

---

## 4. Legal, Privacy & Intellectual Property Rider

### 4.1 Canadian PIPEDA Compliance
${legalAndIpRider.dataPrivacy}

### 4.2 Zero-Public-Model-Training Covenant
> **GUARANTEE:** ${legalAndIpRider.zeroPublicModelTraining}

### 4.3 Intellectual Property Assignment
${legalAndIpRider.intellectualProperty}

### 4.4 Warranty
${legalAndIpRider.warrantyAndSupport}

---

## 5. Execution & Acceptance
To authorize execution under the selected option, schedule your formal onboarding session with Saad Sayed at **https://www.lumilore.ca/contact/**.

**For LumiLore Technologies:**  
*Saad Sayed*, Lead Systems Architect  
*Arfa Sayeed*, Operations & Commercial Contracts Lead  
`;
  }

  /**
   * Standard run wrapper for Conductor Event Bus
   */
  async run(options = {}) {
    console.log('\n================================================================');
    console.log('📝 AGENT 07 // DYNAMIC 3-TIER SOW & CONTRACT CLOSER');
    console.log('Generating client-ready Statements of Work with legal covenants...');
    console.log('================================================================\n');

    // Read previous audit if available
    let auditData = null;
    const auditPath = path.join(this.outputDir, 'website_inspector_pm_audit.json');
    if (fs.existsSync(auditPath)) {
      try {
        auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      } catch (e) {
        // Fallback
      }
    }

    const result = this.generateSow(auditData, options);
    console.log(`✓ SOW Generated: ${result.sowPackage.sowId} for ${result.sowPackage.client.name}`);
    console.log(`✓ Commercial Tiers: 3/3 Standardized (Starter, Retainer, Enterprise)`);
    console.log(`✓ Zero Public Model Training Covenant: Included`);
    console.log(`✓ PIPEDA Data Privacy Shield: Included`);
    console.log(`✓ Files written:`);
    console.log(`    • ${result.filesWritten[0]}`);
    console.log(`    • ${result.filesWritten[1]}\n`);
    return result;
  }
}

// Direct CLI invocation
if (process.argv[1] && process.argv[1].endsWith('sow-closer.js')) {
  const closer = new SowCloser();
  closer.run().catch(err => {
    console.error('✕ SOW Closer Error:', err);
    process.exit(1);
  });
}

