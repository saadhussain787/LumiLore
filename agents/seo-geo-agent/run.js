#!/usr/bin/env node
/**
 * LumiLore Autonomous SEO & GEO Agent - Master Orchestrator
 * Sprint 11: Autonomous SEO & GEO Agent Upgrades (LIVE RANKING ENGINE)
 * Unified CLI runner executing Citation Radar, Google Indexing, Community Seeding, and Executive Intel
 * 
 * Usage:
 *   node agents/seo-geo-agent/run.js [--all] [--radar] [--index] [--briefing] [--cron] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { CitationRadar } from './citation-radar.js';
import { GoogleIndexer } from './indexer.js';
import { CommunitySeeder } from './community-seeder.js';
import { ExecutiveIntelEngine } from './executive-intel.js';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
const isCron = args.includes('--cron') || args.includes('--weekly');
const runRadarOnly = args.includes('--radar');
const runIndexOnly = args.includes('--index');
const runBriefingOnly = args.includes('--briefing');
const runAll = isCron || args.includes('--all') || (!runRadarOnly && !runIndexOnly && !runBriefingOnly);

export async function runMasterPipeline(options = {}) {
  const dryRun = options.dryRun !== undefined ? options.dryRun : isDryRun;
  const cronMode = options.cron !== undefined ? options.cron : isCron;

  console.log('\n================================================================');
  console.log('⚡ LUMILORE TECHNOLOGIES // AUTONOMOUS SEO & GEO LIVE ENGINE');
  console.log(`📡 Mode: ${dryRun ? 'DRY-RUN (SIMULATION)' : 'LIVE PRODUCTION'}`);
  console.log(`⏱️ Trigger: ${cronMode ? 'SCHEDULED CRON RUNNER' : 'CLI INVOCATION'}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  const summary = {
    timestamp: new Date().toISOString(),
    trigger: cronMode ? 'cron' : 'cli',
    dryRun,
    radar: null,
    indexer: null,
    seeder: null,
    briefing: null
  };

  // 1. Live Citation & SERP Radar
  if (runAll || runRadarOnly) {
    console.log('[Step 1/4] Running Live SERP & Multi-LLM Citation Radar...');
    try {
      const radar = new CitationRadar();
      summary.radar = await radar.runRadarScan();
      console.log(`  ✓ Composite Ranking Score: ${summary.radar.compositeRankingScore}/100`);
      console.log(`  ✓ Overall Citation Score: ${summary.radar.overallCitationScore}/100`);
      console.log(`  ✓ Core Web Vitals: LCP=${summary.radar.webVitals.metrics.largestContentfulPaintMs}ms, CLS=${summary.radar.webVitals.metrics.cumulativeLayoutShift}`);
      console.log(`  ✓ Evaluated ${summary.radar.queriesEvaluated} commercial buyer queries`);
      console.log(`  ✓ Saved telemetry to ${CONFIG.paths.metricsFile}`);
    } catch (err) {
      console.error('  ✕ Citation Radar Error:', err.message);
    }
  }

  // 2. Community Authority Seeder
  if (runAll) {
    console.log('\n[Step 2/4] Generating Community Authority Blueprints...');
    try {
      const seeder = new CommunitySeeder();
      summary.seeder = seeder.generateBlueprints();
      console.log(`  ✓ Generated ${summary.seeder.totalBlueprints} Reddit/Quora discussion blueprints`);
      console.log(`  ✓ Saved to ${seeder.outputFile}`);
    } catch (err) {
      console.error('  ✕ Community Seeder Error:', err.message);
    }
  }

  // 3. Google Indexing Bridge
  if (runAll || runIndexOnly) {
    console.log('\n[Step 3/4] Dispatching Google Indexing API Bridge...');
    try {
      const indexer = new GoogleIndexer();
      if (!indexer.hasValidCredentials()) {
        console.log('  ⚠ Google credentials not found. Executing dry-run simulation for Indexing API.');
        summary.indexer = {
          status: 'SIMULATED_NO_CREDENTIALS',
          totalSubmitted: 10,
          dryRun: true
        };
      } else {
        summary.indexer = await indexer.notifySitemap({ dryRun, limit: 10 });
        console.log(`  ✓ Processed ${summary.indexer.totalSubmitted} sitemap URLs (Dry-Run: ${dryRun})`);
      }
    } catch (err) {
      console.error('  ✕ Google Indexer Error:', err.message);
    }
  }

  // 4. Executive Intelligence Briefing
  if (runAll || runBriefingOnly) {
    console.log('\n[Step 4/4] Generating Executive Intelligence Briefing...');
    try {
      const intel = new ExecutiveIntelEngine();
      summary.briefing = await intel.sendBriefing({ dryRun });
      console.log(`  ✓ Briefing prepared for ${summary.briefing.recipient}`);
      console.log(`  ✓ Status: ${summary.briefing.dryRun ? 'Dry-Run Validated' : 'Dispatched via SES'}`);

      // Persist artifact for review
      const briefHtmlPath = path.join(CONFIG.paths.memoryDir, 'latest_executive_briefing.html');
      fs.writeFileSync(briefHtmlPath, intel.buildBriefingHtml(summary.radar), 'utf8');
      console.log(`  ✓ Saved briefing HTML artifact to ${briefHtmlPath}`);
    } catch (err) {
      console.error('  ✕ Executive Intel Error:', err.message);
    }
  }

  // Persist cron run log
  const cronLogPath = path.join(CONFIG.paths.memoryDir, 'latest_cron_run.json');
  fs.writeFileSync(cronLogPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('\n================================================================');
  console.log('✓ AUTONOMOUS SEO & GEO CYCLE COMPLETE');
  console.log('================================================================\n');

  return summary;
}

// Auto-run if invoked directly via CLI
if (process.argv[1] && process.argv[1].endsWith('run.js')) {
  runMasterPipeline().catch(err => {
    console.error('Fatal Pipeline Execution Error:', err);
    process.exit(1);
  });
}

export default runMasterPipeline;
