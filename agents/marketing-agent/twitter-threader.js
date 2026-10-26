/**
 * LumiLore Technologies // Autonomous Marketing & Omnichannel Distribution Agent
 * Twitter/X Viral Technical Breakdown Threader
 * 
 * Decomposes complex cloud and voice AI architectures into high-retention,
 * sequenced 8-tweet viral engineering threads (< 280 chars per tweet).
 * Includes strict character enforcement, ASCII diagram generators, and viral hooks.
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';

export class TwitterThreader {
  constructor(options = {}) {
    this.config = options.config || CONFIG;
    this.extractor = options.extractor || new ContentExtractor();
    this.maxTweetLength = this.config.channels?.twitter?.maxTweetLength || 280;
    this.threadLength = this.config.channels?.twitter?.threadLength || 8;
  }

  /**
   * Craft viral opening hook formula for Tweet 1
   * @param {string} type 
   * @param {Object} context 
   * @returns {string} Formatted hook text
   */
  craftViralHook(type, context = {}) {
    switch (type) {
      case 'contrarian_cloud':
        return `Most enterprise AWS bills are 60%+ idle waste.\n\nWe re-architected a legacy client cluster into an event-driven serverless architecture on AWS.\n\nThe result: A verified ${context.costCut || '68%'} permanent reduction in monthly cloud compute spend.\n\nHere is the exact technical breakdown 🧵👇`;
      case 'trades_leak':
        return `In mechanical trades (HVAC, plumbing), your biggest competitor is your voicemail.\n\nWhen a commercial boiler fails at 2:00 AM, customers dial down Google until someone answers.\n\nMissed emergency calls cost an average of ${context.revenueLeak || '$295,750/yr'}.\n\nHow we fixed it with Voice AI 🧵👇`;
      case 'speed_jamstack':
        return `Bloated CMS sites average a sluggish 3.8s TTFB.\n\nBy re-architecting into an event-driven Jamstack on AWS with CloudFront edge caching, we pushed response times down to ${context.latency || '120ms'}.\n\nHere is the 8-part speed blueprint 🧵👇`;
      default:
        return `How we re-architected legacy infrastructure into autonomous serverless systems with zero idle costs 🧵👇`;
    }
  }

  /**
   * Format compact ASCII architecture diagrams optimized for Twitter character limits
   * @param {string} type 
   * @param {Object} metrics 
   * @returns {string} Formatted ASCII diagram
   */
  formatAsciiDiagram(type, metrics = {}) {
    if (type === 'serverless_cloud') {
      const latency = metrics.latency || 'sub-150ms';
      return `Architecture Data Flow:

Client Request
  ↓ (${latency})
CloudFront Edge (Global POPs)
  ↓ (HTTPS Gateway)
AWS Lambda (ARM64 Graviton3)
  ↓ (Sub-10ms)
DynamoDB Single-Table + EventBridge

Zero idle servers. Millisecond metering. Zero waste.`;
    }

    if (type === 'voice_telephony') {
      const latency = metrics.latency || 'sub-800ms';
      return `Field Telephony Pipeline:

Caller (PSTN / Mobile)
  ↓ (Ring 1)
Amazon Connect Telephony
  ↓ (WebSockets)
Acoustic Speech Model (${latency})
  ↓ (Real-Time API)
ServiceTitan Ticket + Tech SMS Alert

Zero dropped calls. Zero lost revenue.`;
    }

    return '';
  }

  /**
   * Enforce strict 280-character cap with intelligent boundary preservation
   * @param {string} text 
   * @param {number} index 
   * @param {number} total 
   * @returns {Object} Validated tweet object
   */
  enforceTweetLimit(text, index, total) {
    const prefix = `[${index}/${total}] `;
    let cleanBody = text.replace(/^\[\d+\/\d+\]\s*/, '').trim();
    let fullTweet = `${prefix}${cleanBody}`;

    if (fullTweet.length > this.maxTweetLength) {
      const maxBodyLength = this.maxTweetLength - prefix.length - 3;
      let trimmed = cleanBody.slice(0, maxBodyLength);
      // Cut at last space to prevent mid-word break
      const lastSpace = trimmed.lastIndexOf(' ');
      if (lastSpace > 0) {
        trimmed = trimmed.slice(0, lastSpace);
      }
      cleanBody = trimmed + '...';
      fullTweet = `${prefix}${cleanBody}`;
    }

    return {
      index,
      text: fullTweet,
      characterCount: fullTweet.length,
      withinLimit: fullTweet.length <= this.maxTweetLength
    };
  }

  /**
   * Alias for generateThreads() to maintain naming parity
   */
  generateAllThreads() {
    return this.generateThreads();
  }

  /**
   * Generate all flagship 8-tweet engineering threads
   * @returns {Array<Object>} List of structured thread objects
   */
  generateThreads() {
    const insights = this.extractor.getAllInsights();
    const corpInsight = insights.find(i => i.lens === 'corporate') || {};
    const tradesInsight = insights.find(i => i.lens === 'trades') || {};

    return [
      this._buildAwsServerlessThread(corpInsight),
      this._buildVoiceDispatchThread(tradesInsight)
    ];
  }

  /**
   * Thread 1: AWS Cloud Cost Reduction & Serverless Architecture (Corporate)
   */
  _buildAwsServerlessThread(insight) {
    const costCut = insight.metrics?.primaryStat || '68%';
    const latency = insight.metrics?.latency || 'sub-150ms';
    const canonicalUrl = insight.canonicalUrl || 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/';

    const hook = this.craftViralHook('contrarian_cloud', { costCut });
    const diagram = this.formatAsciiDiagram('serverless_cloud', { latency });

    const rawBodies = [
      hook,
      `The Antipattern:\n\nThe client ran persistent EC2 clusters 24/7/365 to survive daily 2-hour traffic spikes.\n\nOvernight and on weekends, server utilization was below 4%.\n\nYet AWS billed them for 100% capacity every second. Always-on servers for variable workloads burn capital.`,
      `Step 1: Event-Driven Compute\n\nWe replaced persistent VMs with AWS Lambda on ARM64 Graviton3.\n\n• Cold starts: Under 180ms\n• Billing: Metered to the exact millisecond\n• Zero traffic: Compute spend drops to exactly $0.00\n\nNo requests = zero infrastructure cost.`,
      `Step 2: Single-Table Storage\n\nWe migrated relational multi-table schemas to Amazon DynamoDB single-table design with On-Demand capacity.\n\n• Single-digit millisecond reads & writes\n• Zero connection pooling bottlenecks\n• Zero database server sizing headaches.`,
      `Step 3: Edge Routing & Caching\n\nWe routed traffic through Amazon CloudFront with origin request policies and Brotli compression.\n\n• Global edge response: ${latency}\n• Dynamic payloads served from closest POP\n• Origin shield shielded Lambda from redundant hits.`,
      `Step 4: Asynchronous Decoupling\n\nAmazon EventBridge acts as our agentic nervous system.\n\nHeavy workflows execute asynchronously in background queues without blocking user HTTP threads.\n\nThe API returns instant 202 Accepted; workers process events in parallel.`,
      diagram,
      `Summary:\n• Cut monthly AWS bills by ${costCut}\n• Sustained ${latency} edge response\n• Ops overhead reduced by 85%\n\n🔖 Bookmark this thread.\n\nFull architecture blueprint:\n${canonicalUrl}`
    ];

    return this._assembleThread('thread-aws-cloud-waste', 'Cutting AWS Cloud Waste by 68%: Serverless Architecture Breakdown', 'corporate', rawBodies);
  }

  /**
   * Thread 2: Voice AI Dispatch for Mechanical Trades (Trades)
   */
  _buildVoiceDispatchThread(insight) {
    const revenueLeak = insight.metrics?.revenueImpact || '$295,750/yr';
    const latency = insight.metrics?.primaryStat || 'sub-800ms';
    const canonicalUrl = insight.canonicalUrl || 'https://lumilore.ca/insights/autonomous-247-ai-voice-dispatch-mechanical-trades/';

    const hook = this.craftViralHook('trades_leak', { revenueLeak });
    const diagram = this.formatAsciiDiagram('voice_telephony', { latency });

    const rawBodies = [
      hook,
      `The Problem with Answering Services:\n\nTraditional call centers charge $3,500–$5,000/mo, put callers on hold, and wake up on-call technicians for routine maintenance inquiries because they can't triage technical emergencies.\n\nDropped calls = lost $1,500+ jobs.`,
      `Step 1: Sub-Second Telephony\n\nWe deployed a serverless voice pipeline using Amazon Connect + WebSockets.\n\n• Latency: ${latency} full-duplex speech\n• Answers on Ring 1 (24/7/365)\n• Zero hold times or queue backlogs\n\nCallers converse naturally without awkward robotic delays.`,
      `Step 2: Semantic Emergency Triage\n\nOur agent listens to caller intent and classifies severity in real time:\n\n• True Emergency: Active flooding, boiler failure, freezing risks $\\rightarrow$ Immediate triage\n• Routine: Filter change, pricing inquiries $\\rightarrow$ Scheduled for morning.`,
      `Step 3: Real-Time Municipal GIS Validation\n\nWhile the caller speaks, the agent extracts their street address and validates it against local municipal GIS databases.\n\nIt verifies service territory and pulls customer account history in under 400 milliseconds.`,
      `Step 4: Instant CRM Booking\n\nThe voice agent calls ServiceTitan and Jobber REST APIs directly:\n\n• Creates dispatch ticket\n• Tags equipment specs & urgency\n• Sends SMS confirmation to caller\n• Dispatches on-call technician with full audio summary.`,
      diagram,
      `Summary:\n• Recovers estimated ${revenueLeak} in jobs\n• Replaces $4k/mo call center overhead\n• ${latency} response on Ring 1\n\n🔖 Bookmark this thread.\n\nFull telephony architecture blueprint:\n${canonicalUrl}`
    ];

    return this._assembleThread('thread-voice-dispatch-trades', 'Autonomous 24/7 Voice Dispatch for Mechanical Trades', 'trades', rawBodies);
  }

  /**
   * Assemble and validate 8-tweet thread
   */
  _assembleThread(id, title, lens, rawBodies) {
    const tweets = rawBodies.map((body, idx) => {
      return this.enforceTweetLimit(body, idx + 1, rawBodies.length);
    });

    const allWithinLimit = tweets.every(t => t.withinLimit);

    return {
      id,
      title,
      lens,
      totalTweets: tweets.length,
      allWithinLimit,
      tweets
    };
  }

  /**
   * Validate full thread structural compliance
   * @param {Object} thread 
   * @returns {Object} Validation result { valid: boolean, errors: string[] }
   */
  validateThread(thread) {
    const errors = [];
    if (!thread.tweets || thread.tweets.length !== this.threadLength) {
      errors.push(`Thread length is ${thread.tweets?.length || 0}, expected ${this.threadLength}`);
    }

    thread.tweets.forEach((tweet, i) => {
      if (tweet.characterCount > this.maxTweetLength) {
        errors.push(`Tweet ${i + 1} exceeds 280 characters (${tweet.characterCount})`);
      }
      const expectedPrefix = `[${i + 1}/${this.threadLength}]`;
      if (!tweet.text.startsWith(expectedPrefix)) {
        errors.push(`Tweet ${i + 1} does not start with ${expectedPrefix}`);
      }
    });

    // Check ASCII diagram in tweet 7
    const tweet7 = thread.tweets[6];
    if (!tweet7.text.includes('↓')) {
      errors.push('Tweet 7 is missing ASCII diagram flow indicator (↓)');
    }

    // Check bookmark trigger and link in tweet 8
    const tweet8 = thread.tweets[7];
    if (!tweet8.text.includes('Bookmark') && !tweet8.text.includes('bookmark')) {
      errors.push('Tweet 8 is missing bookmark retention prompt');
    }
    if (!tweet8.text.includes('https://lumilore.ca/insights/')) {
      errors.push('Tweet 8 is missing canonical insight URL');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Save generated threads to disk in both Markdown (copy-ready) and JSON (API-ready)
   * @param {Array<Object>} [threads] Optional pre-generated threads array
   * @param {Object} [options] Custom output options
   * @returns {Object} Manifest of saved threads
   */
  saveThreads(threads = null, options = {}) {
    const targetThreads = threads || this.generateThreads();
    const outputDir = options.outputDir || this.config.paths.twitterDir;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const dateSlug = timestamp.slice(0, 10);
    const savedFiles = [];

    targetThreads.forEach((thread, index) => {
      // 1. Save Markdown copy-ready version
      const mdFileName = `${dateSlug}_${String(index + 1).padStart(2, '0')}_${thread.id}.md`;
      const mdFilePath = path.join(outputDir, mdFileName);

      const mdContent = `---
id: "${thread.id}"
title: "${thread.title.replace(/"/g, '\\"')}"
lens: "${thread.lens}"
totalTweets: ${thread.totalTweets}
allWithinLimit: ${thread.allWithinLimit}
generatedAt: "${timestamp}"
---

# ${thread.title}

${thread.tweets.map(t => `### Tweet ${t.index}/8 (${t.characterCount} chars)\n\n${t.text}\n`).join('\n---\n\n')}
`;
      fs.writeFileSync(mdFilePath, mdContent, 'utf-8');

      // 2. Save JSON API-ready payload
      const jsonFileName = `${dateSlug}_${String(index + 1).padStart(2, '0')}_${thread.id}.json`;
      const jsonFilePath = path.join(outputDir, jsonFileName);

      const jsonPayload = {
        id: thread.id,
        title: thread.title,
        lens: thread.lens,
        totalTweets: thread.totalTweets,
        generatedAt: timestamp,
        tweets: thread.tweets
      };
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonPayload, null, 2), 'utf-8');

      savedFiles.push({
        id: thread.id,
        title: thread.title,
        mdFile: mdFileName,
        jsonFile: jsonFileName,
        filePath: mdFilePath,
        totalTweets: thread.totalTweets
      });
    });

    const manifest = {
      batchId: `twitter-${dateSlug}`,
      generatedAt: timestamp,
      author: this.config.persona.author,
      company: this.config.persona.company,
      totalThreads: savedFiles.length,
      outputDir,
      threads: savedFiles
    };

    const manifestPath = path.join(outputDir, 'latest_twitter_threads.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return manifest;
  }
}

export default TwitterThreader;
