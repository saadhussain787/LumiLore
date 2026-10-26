#!/usr/bin/env node
/**
 * LumiLore Technologies // Autonomous Omnichannel Marketing Orchestrator
 * Master CLI Runner integrating:
 * 1. LinkedIn Thought Leadership & B2B Story Engine
 * 2. Twitter/X Viral Technical Breakdown Threader
 * 3. Community Interceptor & High-Intent Radar (Agent-Reach)
 * 4. High-DA Multi-Platform Syndication Publisher (Dev.to & Medium)
 * 
 * Usage:
 *   node agents/marketing-agent/run.js --all
 *   node agents/marketing-agent/run.js --linkedin --dry-run
 *   node agents/marketing-agent/run.js --twitter
 *   node agents/marketing-agent/run.js --radar
 *   node agents/marketing-agent/run.js --syndicate
 */

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';
import { LinkedInGenerator } from './linkedin-generator.js';
import { TwitterThreader } from './twitter-threader.js';
import { CommunityRadar } from './community-radar.js';
import { SyndicationPublisher } from './syndication-publisher.js';
import { GBPPublisher } from './gbp-publisher.js';
import { OutreachGenerator } from './outreach-generator.js';
import { TrojanAuditGenerator } from './trojan-audit.js';

export class MarketingOrchestrator {
  constructor(customConfig = {}) {
    this.config = { ...CONFIG, ...customConfig };
    this.extractor = new ContentExtractor();
    this.linkedin = new LinkedInGenerator(this.config);
    this.twitter = new TwitterThreader(this.config);
    this.radar = new CommunityRadar(this.config);
    this.syndication = new SyndicationPublisher(this.config);
    this.gbp = new GBPPublisher(this.config);
    this.outreach = new OutreachGenerator(this.config);
    this.audit = new TrojanAuditGenerator(this.config);
  }

  /**
   * Run LinkedIn Story Generation Engine
   * @param {Object} [options]
   * @returns {Object} Run metrics & generated posts
   */
  async runLinkedIn(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[1/4] 💼 Launching LinkedIn B2B Story Engine...');

    const posts = this.linkedin.generateAllPosts();
    const saved = this.linkedin.savePosts(posts, {
      outputDir: this.config.paths.linkedinDir
    });

    const savedList = saved.posts || saved.markdownFiles || [];
    const manifestPath = saved.manifestPath || path.join(this.config.paths.linkedinDir, 'latest_linkedin_batch.json');

    console.log(`  ✓ Generated ${posts.length} B2B leadership stories`);
    console.log(`  ✓ Saved ${savedList.length} markdown posts to ${this.config.paths.linkedinDir}`);
    console.log(`  ✓ Persisted batch manifest: ${path.basename(manifestPath)}`);

    return {
      channel: 'linkedin',
      success: true,
      dryRun: isDryRun,
      totalGenerated: posts.length,
      savedFiles: savedList,
      manifestPath,
      posts
    };
  }

  /**
   * Run Twitter/X Viral Breakdown Threader
   * @param {Object} [options]
   * @returns {Object} Run metrics & generated threads
   */
  async runTwitter(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[2/4] 🐦 Launching Twitter/X Architecture Threader...');

    const threads = this.twitter.generateAllThreads();
    const saved = this.twitter.saveThreads(threads, {
      outputDir: this.config.paths.twitterDir
    });

    const savedList = saved.threads || saved.markdownFiles || [];
    const manifestPath = saved.manifestPath || path.join(this.config.paths.twitterDir, 'latest_twitter_threads.json');

    console.log(`  ✓ Generated ${threads.length} technical breakdown threads (${threads.reduce((acc, t) => acc + t.tweets.length, 0)} total tweets)`);
    console.log(`  ✓ Verified strict <= 280 character compliance across all tweets`);
    console.log(`  ✓ Saved thread files to ${this.config.paths.twitterDir}`);
    console.log(`  ✓ Persisted batch manifest: ${path.basename(manifestPath)}`);

    return {
      channel: 'twitter',
      success: true,
      dryRun: isDryRun,
      totalThreads: threads.length,
      totalTweets: threads.reduce((acc, t) => acc + t.tweets.length, 0),
      savedFiles: savedList,
      manifestPath,
      threads
    };
  }

  /**
   * Run Community Interceptor & High-Intent Radar
   * @param {Object} [options]
   * @returns {Object} Run metrics & drafted responses
   */
  async runRadar(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[3/4] 📡 Launching Community Interceptor & Radar (Agent-Reach)...');

    const result = await this.radar.runRadarScan({
      dryRun: isDryRun,
      outputDir: this.config.paths.outputDir
    });

    const evaluatedCount = result.totalInquiriesEvaluated ?? result.totalInquiriesScanned ?? 0;
    const highIntentCount = result.highIntentMatches ?? result.highIntentCount ?? 0;
    const drafts = result.drafts ?? result.draftedResponses ?? [];
    const savedPath = result.outputFile ?? result.savedDraftsPath ?? this.config.paths.radarDraftsFile;

    console.log(`  ✓ Scanned ${result.totalCommunitiesScanned || 5} target subreddits (r/aws, r/HVAC, r/Plumbing, r/smallbusiness, r/webdev)`);
    console.log(`  ✓ Discovered ${evaluatedCount} inquiries; filtered ${highIntentCount} high-intent targets`);
    console.log(`  ✓ Drafted ${drafts.length} expert responses in Saad Sayed persona`);
    console.log(`  ✓ Persisted drafts to ${path.basename(savedPath)} (draftsOnly guardrail)`);

    return {
      channel: 'radar',
      success: true,
      dryRun: isDryRun,
      scannedCount: evaluatedCount,
      highIntentCount,
      draftedCount: drafts.length,
      savedDraftsPath: savedPath,
      drafts
    };
  }

  /**
   * Run High-DA Syndication Publisher (Dev.to & Medium)
   * @param {Object} [options]
   * @returns {Object} Run metrics & publication manifest
   */
  async runSyndication(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[4/4] 🚀 Launching High-DA Syndication Publisher (Dev.to & Medium)...');

    const manifest = await this.syndication.publishAll({
      dryRun: isDryRun,
      outputDir: this.config.paths.syndicationDir
    });

    console.log(`  ✓ Processed ${manifest.totalArticles} technical case studies from frontend/insights/`);
    console.log(`  ✓ Generated ${manifest.devto.length} Dev.to draft payloads with strict canonical URLs`);
    console.log(`  ✓ Generated ${manifest.medium.length} Medium draft payloads with H1 titles & tags`);
    console.log(`  ✓ Mode: ${manifest.mode}`);
    console.log(`  ✓ Persisted syndication manifest to ${this.config.paths.syndicationDir}`);

    return {
      channel: 'syndication',
      success: true,
      dryRun: isDryRun,
      totalArticles: manifest.totalArticles,
      devtoCount: manifest.devto.length,
      mediumCount: manifest.medium.length,
      manifest
    };
  }

  /**
   * Run Google Business Profile (GBP) Local Map Pack Publisher
   * @param {Object} [options]
   * @returns {Object} Run metrics & generated posts
   */
  async runGBP(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[5/8] 📍 Launching GBP Local Map Pack Publisher...');

    const posts = this.gbp.generateWeeklyGBPPosts(options);
    const saved = this.gbp.saveGBPPosts(posts, {
      outputDir: this.config.paths.gbpDir
    });

    console.log(`  ✓ Generated ${posts.length} hyper-local Google Business Profile update posts`);
    console.log(`  ✓ Geotargeted across 4 Ontario service areas (Markham, GTA, Mississauga, York)`);
    console.log(`  ✓ Persisted batch manifest: ${path.basename(saved.manifestPath)}`);

    return {
      channel: 'gbp',
      success: true,
      dryRun: isDryRun,
      totalPosts: posts.length,
      manifestPath: saved.manifestPath,
      savedFiles: saved.savedFiles,
      posts
    };
  }

  /**
   * Run Personalized Cold Outreach Sequence Generator
   * @param {Object} [options]
   * @returns {Object} Run metrics & generated sequences
   */
  async runOutreach(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[6/8] ✉️ Launching B2B Cold Outreach Generator...');

    const sequences = options.prospect 
      ? [this.outreach.generateSequence(options.prospect)]
      : this.outreach.generateSampleBatch();

    const saved = this.outreach.saveSequences(sequences, {
      outputDir: this.config.paths.outreachDir
    });

    console.log(`  ✓ Generated ${sequences.length} 3-stage B2B cold outreach sequences (3 email stages + LinkedIn DM)`);
    console.log(`  ✓ Injected empirical proof formulas and 1-click calendar reservation links`);
    console.log(`  ✓ Persisted batch manifest: ${path.basename(saved.manifestPath)}`);

    return {
      channel: 'outreach',
      success: true,
      dryRun: isDryRun,
      totalSequences: sequences.length,
      manifestPath: saved.manifestPath,
      savedFiles: saved.savedFiles,
      sequences
    };
  }

  /**
   * Run Trojan Horse Diagnostic Client Audit Generator
   * @param {Object} [options]
   * @returns {Object} Run metrics & generated teardown
   */
  async runAudit(options = {}) {
    const isDryRun = options.dryRun ?? true;
    const targetUrl = options.url || 'https://apexmechanical.com';
    const targetLens = options.lens || 'trades';
    console.log(`\n[7/8] 🛡️ Launching Trojan Horse Diagnostic Client Audit for ${targetUrl}...`);

    const result = this.audit.generateAudit({
      url: targetUrl,
      lens: targetLens,
      companyName: options.companyName
    });

    const saved = this.audit.saveAudit(result, {
      outputDir: this.config.paths.auditDir
    });

    console.log(`  ✓ Evaluated ${result.reportData.domain} across Speed, Schema.org AI Entities, and Intake Leaks`);
    console.log(`  ✓ Diagnostic Score: ${result.reportData.overallScore}/100 (Grade: ${result.reportData.grade})`);
    console.log(`  ✓ Estimated Revenue Leak: ${result.reportData.estimatedAnnualLeak}`);
    console.log(`  ✓ Saved executive 1-page teardown: ${path.basename(saved.markdownPath)}`);

    return {
      channel: 'audit',
      success: true,
      dryRun: isDryRun,
      domain: result.reportData.domain,
      overallScore: result.reportData.overallScore,
      overallGrade: result.reportData.grade,
      estimatedAnnualLeak: result.reportData.estimatedAnnualLeak,
      markdownPath: saved.markdownPath,
      jsonPath: saved.jsonPath,
      report: result.reportData
    };
  }

  /**
   * Run Active Community Lead Scout
   * @param {Object} [options]
   * @returns {Promise<Object>} Run metrics & scouted leads
   */
  async runScout(options = {}) {
    const isDryRun = options.dryRun ?? true;
    console.log('\n[8/8] 🎯 Launching Active Community Lead Scout (Distress Signals)...');

    const result = await this.radar.runLeadScout({
      dryRun: isDryRun,
      minScore: options.minScore || 40
    });

    console.log(`  ✓ Scouted ${result.totalLeadsScouted} high-intent commercial leads from Reddit communities`);
    console.log(`  ✓ Paired each lead with consultative engineering draft & direct booking link`);
    console.log(`  ✓ Persisted lead scout database: ${path.basename(result.scoutFile)}`);

    return {
      channel: 'scout',
      success: true,
      dryRun: isDryRun,
      totalLeads: result.totalLeadsScouted,
      scoutFile: result.scoutFile,
      markdownFile: result.markdownFile,
      leads: result.leads
    };
  }

  /**
   * Run all marketing & distribution engines sequentially
   * @param {Object} [options]
   * @returns {Object} Master run report
   */
  async runAll(options = {}) {
    const startTime = Date.now();
    const isDryRun = options.dryRun ?? true;

    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  LUMILORE AUTONOMOUS MARKETING & ACQUISITION SUPER-AGENT SUITE   ║');
    console.log('║  Founder: Saad Sayed | Canonical: https://lumilore.ca            ║');
    console.log(`║  Execution Mode: ${isDryRun ? 'DRY-RUN (100% Non-Destructive Simulation)' : 'LIVE PRODUCTION'}      ║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    const results = {
      timestamp: new Date().toISOString(),
      mode: isDryRun ? 'dry-run' : 'live',
      founder: this.config.persona.author,
      canonicalDomain: this.config.persona.canonicalDomain,
      channels: {}
    };

    try {
      results.channels.linkedin = await this.runLinkedIn(options);
    } catch (err) {
      console.error(`  ✕ LinkedIn Error: ${err.message}`);
      results.channels.linkedin = { success: false, error: err.message };
    }

    try {
      results.channels.twitter = await this.runTwitter(options);
    } catch (err) {
      console.error(`  ✕ Twitter Error: ${err.message}`);
      results.channels.twitter = { success: false, error: err.message };
    }

    try {
      results.channels.radar = await this.runRadar(options);
    } catch (err) {
      console.error(`  ✕ Community Radar Error: ${err.message}`);
      results.channels.radar = { success: false, error: err.message };
    }

    try {
      results.channels.syndication = await this.runSyndication(options);
    } catch (err) {
      console.error(`  ✕ Syndication Error: ${err.message}`);
      results.channels.syndication = { success: false, error: err.message };
    }

    try {
      results.channels.gbp = await this.runGBP(options);
    } catch (err) {
      console.error(`  ✕ GBP Error: ${err.message}`);
      results.channels.gbp = { success: false, error: err.message };
    }

    try {
      results.channels.outreach = await this.runOutreach(options);
    } catch (err) {
      console.error(`  ✕ Outreach Error: ${err.message}`);
      results.channels.outreach = { success: false, error: err.message };
    }

    try {
      results.channels.audit = await this.runAudit(options);
    } catch (err) {
      console.error(`  ✕ Audit Error: ${err.message}`);
      results.channels.audit = { success: false, error: err.message };
    }

    try {
      results.channels.scout = await this.runScout(options);
    } catch (err) {
      console.error(`  ✕ Scout Error: ${err.message}`);
      results.channels.scout = { success: false, error: err.message };
    }

    const elapsedMs = Date.now() - startTime;
    results.elapsedMs = elapsedMs;

    // Save consolidated master summary to vault
    const outputDir = this.config.paths.outputDir || path.resolve(this.config.paths.memoryDir, 'marketing_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const summaryPath = path.join(outputDir, 'latest_run_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf-8');

    console.log('\n==================================================================');
    console.log(`🏁 SUPER-AGENT SUITE EXECUTION COMPLETE in ${elapsedMs}ms`);
    console.log(`📁 Master summary persisted to: ${summaryPath}`);
    console.log('==================================================================\n');

    return results;
  }
}

/**
 * Print CLI Help Menu
 */
function printHelp() {
  console.log(`
LumiLore Marketing & Acquisition Super-Agent Orchestrator

Usage:
  node agents/marketing-agent/run.js [options]

Core Distribution Options:
  --all           Execute all 8 Super-Agent engines
  --linkedin      Generate B2B thought leadership stories (CTO, Trades Contractor, Architect)
  --twitter, --x  Generate viral 8-tweet technical architecture threads
  --radar         Run community intent radar scan and draft expert intercept responses
  --syndicate     Format and syndicate insights to Dev.to and Medium

Super-Agent Acquisition Options:
  --gbp           Generate Google Business Profile local Map Pack ranking posts
  --outreach      Generate 3-stage personalized B2B cold email & LinkedIn DM sequences
  --audit         Generate Trojan Horse 1-page executive diagnostic client teardown
  --scout         Run active community lead scout on Reddit distress signals

Targeting Parameters (for --audit and --outreach):
  --url=<url>     Target domain or URL (e.g., --url=apexmechanical.com)
  --lens=<lens>   Target lens: 'trades' | 'corporate' (Default: trades)
  --company=<name> Target company display name

Execution Flags:
  --dry-run       Run in safe dry-run simulation mode (Default: true)
  --live          Execute live API dispatches (Requires configured API tokens)
  --help, -h      Display this help menu

Examples:
  node agents/marketing-agent/run.js --all
  node agents/marketing-agent/run.js --gbp
  node agents/marketing-agent/run.js --outreach
  node agents/marketing-agent/run.js --audit --url=apexmechanical.com --lens=trades
  node agents/marketing-agent/run.js --scout
`);
}

/**
 * CLI Execution Handler
 */
export async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const isLive = args.includes('--live') || args.includes('--no-dry-run');
  const dryRun = !isLive; // Safe default

  // Extract optional parameters
  let targetUrl = '';
  let targetLens = '';
  let targetCompany = '';

  for (const arg of args) {
    if (arg.startsWith('--url=')) targetUrl = arg.split('=')[1];
    if (arg.startsWith('--lens=')) targetLens = arg.split('=')[1];
    if (arg.startsWith('--company=')) targetCompany = arg.split('=')[1];
  }

  const hasSpecificTarget = args.some(a => [
    '--linkedin', '--twitter', '--x', '--radar', '--community', 
    '--syndicate', '--publish', '--gbp', '--outreach', '--audit', '--scout'
  ].includes(a));

  const runAll = args.includes('--all') || (!hasSpecificTarget && args.length === 0);
  const runLinkedIn = args.includes('--linkedin');
  const runTwitter = args.includes('--twitter') || args.includes('--x');
  const runRadar = args.includes('--radar') || args.includes('--community');
  const runSyndication = args.includes('--syndicate') || args.includes('--publish');
  const runGBP = args.includes('--gbp');
  const runOutreach = args.includes('--outreach');
  const runAudit = args.includes('--audit');
  const runScout = args.includes('--scout');

  const orchestrator = new MarketingOrchestrator();

  if (runAll) {
    await orchestrator.runAll({ dryRun });
  } else {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  LUMILORE TARGETED SUPER-AGENT ENGINE EXECUTION                  ║');
    console.log(`║  Execution Mode: ${dryRun ? 'DRY-RUN (Simulation)' : 'LIVE PRODUCTION'}                               ║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    if (runLinkedIn) await orchestrator.runLinkedIn({ dryRun });
    if (runTwitter) await orchestrator.runTwitter({ dryRun });
    if (runRadar) await orchestrator.runRadar({ dryRun });
    if (runSyndication) await orchestrator.runSyndication({ dryRun });
    if (runGBP) await orchestrator.runGBP({ dryRun });
    if (runOutreach) await orchestrator.runOutreach({ dryRun });
    if (runAudit) await orchestrator.runAudit({ dryRun, url: targetUrl, lens: targetLens, companyName: targetCompany });
    if (runScout) await orchestrator.runScout({ dryRun });

    console.log('\n✓ Targeted Super-Agent execution finished successfully.\n');
  }
}

// Automatically invoke if executed directly via CLI
const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedFile && currentFile === invokedFile) {
  main().catch(err => {
    console.error('Fatal Orchestrator Error:', err);
    process.exit(1);
  });
}
