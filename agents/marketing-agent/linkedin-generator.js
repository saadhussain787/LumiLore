/**
 * LumiLore Technologies // Autonomous Marketing & Omnichannel Distribution Agent
 * LinkedIn Thought Leadership & B2B Story Engine
 * 
 * Generates 3 weekly high-engagement B2B thought leadership stories for Saad Sayed
 * with automated hook crafting (<140 chars), mathematical proof blocks,
 * and dual CTA attribution linking to insights and contact reservation flows.
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';

export class LinkedInGenerator {
  constructor(options = {}) {
    this.config = options.config || CONFIG;
    this.extractor = options.extractor || new ContentExtractor();
    this.maxHookChars = this.config.channels?.linkedin?.hookMaxChars || 140;
  }

  /**
   * Craft a scroll-stopping hook guaranteed to appear above the LinkedIn "see more" fold (< 140 chars)
   * @param {string} type Hook archetype
   * @param {Object} context Contextual parameters
   * @returns {string} Clean hook under 140 characters
   */
  craftHook(type, context = {}) {
    let hook = '';
    switch (type) {
      case 'contrarian_cloud':
        hook = `Most enterprise AWS bills are 60%+ idle waste. Here is the exact architecture we used to slash monthly cloud spend by ${context.costCut || '68%'}:`;
        break;
      case 'trades_leak':
        hook = "If you run an HVAC or commercial plumbing business, your biggest competitor isn't the company across town. It's your voicemail.";
        break;
      case 'architectural_ai':
        hook = "Most 'AI startups' are just fragile monolithic web servers wrapping someone else's API. Here is why that fails in production:";
        break;
      case 'finops_speed':
        hook = `How our client cut AWS infrastructure costs by ${context.costCut || '68%'} while achieving ${context.latency || 'sub-150ms'} edge response times:`;
        break;
      default:
        hook = "Why enterprise systems architectures built on 24/7 idle servers are bleeding capital in 2026:";
    }

    if (hook.length > this.maxHookChars) {
      hook = hook.slice(0, this.maxHookChars - 3) + '...';
    }

    return hook;
  }

  /**
   * Format a mathematical proof block with empirical numbers and before/after metrics
   * @param {string} type 
   * @param {Object} metrics 
   * @returns {string} Formatted proof block
   */
  formatProofBlock(type, metrics = {}) {
    if (type === 'corporate_cloud') {
      const costCut = metrics.costCut || '68%';
      const latency = metrics.latency || 'sub-150ms';
      return `The Verified Engineering Proof:
• Before: Over-provisioned EC2 clusters running 24/7 at 100% billing for 4% utilization
• After: Event-driven AWS Lambda on ARM64 Graviton3 + DynamoDB on-demand
• Net Outcome: Verified ${costCut} reduction in monthly cloud infrastructure spend
• Edge Latency: ${latency} global response times via CloudFront`;
    }

    if (type === 'trades_voice') {
      const revenueLeak = metrics.revenueLeak || '$295,750/yr';
      const latency = metrics.latency || 'sub-800ms';
      return `The Field Economics & Mathematics:
• Emergency Repair Average: $1,500 – $4,500 per dispatch
• Weekly Dropped Calls: 3 to 4 after-hours emergency calls lost to voicemail
• Verified Annual Loss: ${revenueLeak} in missed top-line revenue
• Autonomous Dispatch: ${latency} conversational latency answering on Ring 1`;
    }

    if (type === 'architectural_systems') {
      return `The Architecture Comparison:
• Monolithic Wrapper: 10-30s inference locks connection pools $\\rightarrow$ 504 timeouts
• Serverless Primitives: Horizontal auto-scaling from 0 to 10,000 Lambda instances
• Single-Table DynamoDB: Sub-10ms state persistence without relational bottlenecks
• Idle Cost Footprint: Exactly $0.00 compute spend when request volume hits zero`;
    }

    return '';
  }

  /**
   * Format non-intrusive dual CTAs linking to architecture insights and consultation booking
   * @param {Object} options 
   * @returns {string}
   */
  formatCta(options = {}) {
    const {
      insightLabel = 'Read the complete engineering blueprint & specifications:',
      insightUrl,
      contactLabel = 'Want an architectural audit for your organization? Book a strategy session with Saad Sayed:',
      contactUrl
    } = options;

    const parts = [];
    if (insightUrl) {
      parts.push(`${insightLabel}\n${insightUrl}`);
    }
    if (contactUrl) {
      parts.push(`${contactLabel}\n${contactUrl}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Generate all 3 weekly flagship LinkedIn B2B posts
   * @returns {Array<Object>} Formatted post objects
   */
  generatePosts() {
    const insights = this.extractor.getAllInsights();
    const corpInsight = insights.find(i => i.lens === 'corporate') || {};
    const tradesInsight = insights.find(i => i.lens === 'trades') || {};

    return [
      this._generateStoryA_CloudWaste(corpInsight),
      this._generateStoryB_TradesLeak(tradesInsight),
      this._generateStoryC_ServerlessVsMonolith(corpInsight)
    ];
  }

  /**
   * Alias for generatePosts() to maintain naming parity
   */
  generateAllPosts() {
    return this.generatePosts();
  }

  /**
   * Story A: CTO / Cloud Waste Angle
   */
  _generateStoryA_CloudWaste(insight) {
    const costCut = insight.metrics?.primaryStat || '68%';
    const latency = insight.metrics?.latency || 'sub-150ms';
    const hook = this.craftHook('contrarian_cloud', { costCut });
    const proofBlock = this.formatProofBlock('corporate_cloud', { costCut, latency });
    const canonicalUrl = insight.canonicalUrl || 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/';
    const contactUrl = this.config.lenses.corporate.conversionLinks.contact;

    const cta = this.formatCta({
      insightLabel: 'Read the complete engineering blueprint & CloudFormation definitions:',
      insightUrl: canonicalUrl,
      contactLabel: 'Want an architectural audit of your AWS spend? Book a strategy session with Saad Sayed:',
      contactUrl: contactUrl
    });

    const body = `${hook}

When we audited a client's legacy cloud footprint, we found the classic antipattern:
Over-provisioned EC2 clusters running 24/7/365 to handle traffic peaks that only occurred 3 hours a day.

On weekends and overnight, compute utilization was below 4%.
Yet AWS billed them for 100% capacity every second.

Here was our 3-step re-architecture:

1. Replaced persistent VM clusters with event-driven AWS Lambda on ARM64 Graviton3.
   When requests drop to zero, compute spend drops to exactly $0.00.

2. Migrated multi-table relational joins to Amazon DynamoDB single-table design with on-demand capacity.
   Read/write latency dropped to single-digit milliseconds.

3. Pushed static assets and API caching to Amazon CloudFront edge nodes.
   Edge response times plummeted to ${latency}.

${proofBlock}

Cloud waste is not a billing issue. It is a systems architecture failure.

If your team is running always-on compute for variable workloads, you are burning capital that should be funding your product roadmap.

${cta}

#CloudArchitecture #Serverless #AWS #FinOps #SoftwareEngineering`;

    return {
      id: 'story-a-cto-cloud-waste',
      title: 'Story A: Cutting AWS Cloud Waste by 68%',
      targetLens: 'corporate',
      targetAudience: 'CTOs, VPs of Engineering, Cloud Architects',
      hook,
      content: body.trim(),
      metrics: { costCut, latency },
      proofBlock,
      hashtags: ['#CloudArchitecture', '#Serverless', '#AWS', '#FinOps'],
      canonicalUrl,
      contactUrl,
      characterCount: body.trim().length,
      wordCount: body.trim().split(/\s+/).length
    };
  }

  /**
   * Story B: Trades / Commercial Field Services Angle
   */
  _generateStoryB_TradesLeak(insight) {
    const revenueLeak = insight.metrics?.revenueImpact || '$295,750/yr';
    const latency = insight.metrics?.primaryStat || 'sub-800ms';
    const hook = this.craftHook('trades_leak');
    const proofBlock = this.formatProofBlock('trades_voice', { revenueLeak, latency });
    const canonicalUrl = insight.canonicalUrl || 'https://lumilore.ca/insights/autonomous-247-ai-voice-dispatch-mechanical-trades/';
    const contactUrl = this.config.lenses.trades.conversionLinks.contact;

    const cta = this.formatCta({
      insightLabel: 'Explore the mechanical trades voice dispatch architecture:',
      insightUrl: canonicalUrl,
      contactLabel: 'Book a live 15-minute voice demo with our team:',
      contactUrl: contactUrl
    });

    const body = `${hook}

In mechanical trades, the economics of emergency calls are brutal:
When a commercial boiler fails in January or a pipe bursts at 2:00 AM, customers do not leave a voicemail.

They hang up and dial the next contractor on Google.

${proofBlock}

Traditional human answering services don't solve this:
They cost $3,500–$5,000/month, put callers on hold, and wake up on-call technicians for routine maintenance inquiries because they can't triage mechanical emergencies.

We built an autonomous solution:
An AI voice dispatcher operating with ${latency} latency that answers on the very 1st ring.

How it works in the field:
1. Conducts semantic emergency triage (distinguishes dangerous boiler leaks from routine quote inquiries).
2. Verifies service address against municipal GIS records in real time.
3. Automatically creates and schedules the dispatch job in ServiceTitan / Jobber.
4. Alerts the designated on-call field technician with a complete briefing.

Zero missed calls. Zero hold times. Zero technicians woken up for filter changes.

Stop letting Google competitors steal your after-hours emergency jobs.

${cta}

#HVAC #Plumbing #MechanicalContractor #FieldServices #ServiceTitan #VoiceAI`;

    return {
      id: 'story-b-trades-revenue-leak',
      title: 'Story B: The $295k/yr After-Hours Revenue Leak',
      targetLens: 'trades',
      targetAudience: 'Mechanical Contractors, HVAC Fleet Owners, Commercial Plumbers',
      hook,
      content: body.trim(),
      metrics: { revenueLeak, latency },
      proofBlock,
      hashtags: ['#HVAC', '#Plumbing', '#MechanicalContractor', '#FieldServices'],
      canonicalUrl,
      contactUrl,
      characterCount: body.trim().length,
      wordCount: body.trim().split(/\s+/).length
    };
  }

  /**
   * Story C: Technical Architecture & Agent Systems Angle
   */
  _generateStoryC_ServerlessVsMonolith(insight) {
    const hook = this.craftHook('architectural_ai');
    const proofBlock = this.formatProofBlock('architectural_systems');
    const canonicalUrl = insight.canonicalUrl || 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/';
    const contactUrl = this.config.lenses.corporate.conversionLinks.contact;

    const cta = this.formatCta({
      insightLabel: 'Inspect our serverless systems blueprint & open-source tools:',
      insightUrl: canonicalUrl,
      contactLabel: 'Schedule an architecture review for your enterprise AI systems:',
      contactUrl: contactUrl
    });

    const body = `${hook}

When you build conversational or agentic AI on traditional stateful web servers (like a single long-running Node or Python process), you run into a brick wall:

1. AI inference takes time.
   Streaming tokens over 10-30 seconds ties up server connection threads. 100 concurrent users will exhaust your connection pool and spike memory.

2. Idle compute costs destroy unit economics.
   You pay 24/7 server hosting fees even when user activity drops to zero at night.

3. Reliability is fragile.
   When an external model provider experiences a transient latency spike, synchronous servers backlog and cascade into 504 Gateway Timeouts.

At LumiLore Technologies, we reject monolithic wrappers.
We architect autonomous systems with event-driven primitives:

• AWS Lambda functions scale horizontally from 0 to 10,000 instances instantly, executing asynchronously.
• Amazon EventBridge routes multi-agent tool loops with zero persistent memory leakage.
• Amazon DynamoDB handles single-table state persistence with single-digit millisecond reads.
• Full-duplex WebSockets handle client streaming without monopolizing backend compute threads.

${proofBlock}

Don't build 2026 AI systems on 2012 server architectures.

${cta}

#SoftwareArchitecture #Serverless #CloudEngineering #AIInfrastructure #AWS #SystemDesign`;

    return {
      id: 'story-c-serverless-vs-monolith',
      title: 'Story C: Why Event-Driven Serverless Defeats AI Wrappers',
      targetLens: 'corporate',
      targetAudience: 'CTOs, Software Architects, Engineering Leads',
      hook,
      content: body.trim(),
      metrics: { architecture: 'EventBridge + Lambda + DynamoDB' },
      proofBlock,
      hashtags: ['#SoftwareArchitecture', '#Serverless', '#CloudEngineering', '#SystemDesign'],
      canonicalUrl,
      contactUrl,
      characterCount: body.trim().length,
      wordCount: body.trim().split(/\s+/).length
    };
  }

  /**
   * Save generated posts to disk with frontmatter, timestamping, and JSON manifest
   * @param {Array<Object>} [posts] Optional pre-generated posts array
   * @param {Object} [options] Custom output options
   * @returns {Object} Manifest of saved files
   */
  savePosts(posts = null, options = {}) {
    const targetPosts = posts || this.generatePosts();
    const outputDir = options.outputDir || this.config.paths.linkedinDir;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const dateSlug = timestamp.slice(0, 10);
    const savedFiles = [];

    targetPosts.forEach((post, index) => {
      const fileName = `${dateSlug}_${String(index + 1).padStart(2, '0')}_${post.id}.md`;
      const filePath = path.join(outputDir, fileName);

      const fileContent = `---
id: "${post.id}"
title: "${post.title.replace(/"/g, '\\"')}"
targetLens: "${post.targetLens}"
targetAudience: "${post.targetAudience.replace(/"/g, '\\"')}"
wordCount: ${post.wordCount}
characterCount: ${post.characterCount}
canonicalUrl: "${post.canonicalUrl}"
contactUrl: "${post.contactUrl}"
generatedAt: "${timestamp}"
hashtags: [${post.hashtags.map(h => `"${h}"`).join(', ')}]
---

${post.content}
`;

      fs.writeFileSync(filePath, fileContent, 'utf-8');
      savedFiles.push({
        id: post.id,
        title: post.title,
        fileName,
        filePath,
        wordCount: post.wordCount,
        characterCount: post.characterCount
      });
    });

    const manifest = {
      batchId: `linkedin-${dateSlug}`,
      generatedAt: timestamp,
      author: this.config.persona.author,
      company: this.config.persona.company,
      totalPosts: savedFiles.length,
      outputDir,
      posts: savedFiles
    };

    const manifestPath = path.join(outputDir, 'latest_linkedin_batch.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return manifest;
  }
}

export default LinkedInGenerator;
