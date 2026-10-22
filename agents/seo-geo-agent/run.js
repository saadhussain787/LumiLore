#!/usr/bin/env node
/**
 * LumiLore Autonomous SEO & GEO Agent - Master Orchestrator
 * Unified CLI runner executing Citation Radar, Google Indexing, Community Seeding, and Executive Intel
 * 
 * Usage:
 *   node agents/seo-geo-agent/run.js [--all] [--radar] [--index] [--briefing] [--dry-run]
 */

import { CONFIG } from './config.js';
import { CitationRadar } from './citation-radar.js';
import { GoogleIndexer } from './indexer.js';
import { CommunitySeeder } from './community-seeder.js';
import { ExecutiveIntelEngine } from './executive-intel.js';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
const runRadarOnly = args.includes('--radar');
const runIndexOnly = args.includes('--index');
const runBriefingOnly = args.includes('--briefing');
const runAll = args.includes('--all') || (!runRadarOnly && !runIndexOnly && !runBriefingOnly);

async function main() {
  console.log('\n================================================================');
  console.log('⚡ LUMILORE TECHNOLOGIES // AUTONOMOUS SEO & GEO MASTER RUNNER');
  console.log(`📡 Mode: ${isDryRun ? 'DRY-RUN (SIMULATION)' : 'LIVE PRODUCTION'}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  const summary = {
    radar: null,
    indexer: null,
    seeder: null,
    briefing: null
  };

  // 1. Citation Radar
  if (runAll || runRadarOnly) {
    console.log('[Step 1/4] Running Multi-LLM Citation Radar...');
    try {
      const radar = new CitationRadar();
      summary.radar = await radar.runRadarScan();
      console.log(`  ✓ Citation Score: ${summary.radar.overallCitationScore}/100`);
      console.log(`  ✓ Evaluated ${summary.radar.queriesEvaluated} commercial buyer queries`);
      console.log(`  ✓ Saved telemetry to ${CONFIG.paths.metricsFile}`);
    } catch (err) {
      console.error('  ✕ Citation Radar Error:', err.message);
    }
  }

  // 2. Community Seeder
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
        console.log('  ⚠ Google credentials not found. Skipping Google Indexing API pings.');
      } else {
        summary.indexer = await indexer.notifySitemap({ dryRun: isDryRun, limit: 10 });
        console.log(`  ✓ Processed ${summary.indexer.totalSubmitted} sitemap URLs (Dry-Run: ${isDryRun})`);
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
      summary.briefing = await intel.sendBriefing({ dryRun: isDryRun });
      console.log(`  ✓ Briefing prepared for ${summary.briefing.recipient}`);
      console.log(`  ✓ Status: ${summary.briefing.dryRun ? 'Dry-Run Validated' : 'Dispatched via SES'}`);
    } catch (err) {
      console.error('  ✕ Executive Intel Error:', err.message);
    }
  }

  console.log('\n================================================================');
  console.log('✓ AUTONOMOUS SEO & GEO CYCLE COMPLETE');
  console.log('================================================================\n');

  return summary;
}

// Execute if called directly
if (process.argv[1]?.endsWith('run.js')) {
  main().catch(err => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}

export default main;
