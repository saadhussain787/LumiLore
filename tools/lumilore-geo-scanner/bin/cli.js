#!/usr/bin/env node

/**
 * LumiLore GEO Scanner CLI
 * Evaluates website readiness for Generative Engine Optimization (GEO) & AI Answer Engines
 * Engineered by LumiLore Technologies (https://www.lumilore.ca)
 */

import { scanUrl } from '../index.js';

const targetUrl = process.argv[2];

if (!targetUrl || targetUrl === '--help' || targetUrl === '-h') {
  console.log(`
\x1b[36m========================================================\x1b[0m
\x1b[1m\x1b[36m  LumiLore GEO Scanner (AI Search Readiness CLI)\x1b[0m
\x1b[36m========================================================\x1b[0m
\x1b[90mPowered by LumiLore Technologies — https://www.lumilore.ca\x1b[0m

Usage:
  npx lumilore-geo-scanner <url>
  geo-scanner https://example.com

Options:
  --help, -h    Display this documentation
`);
  process.exit(0);
}

try {
  console.log(`\n\x1b[36m🔍 Scanning ${targetUrl} for Generative Engine Optimization (GEO)...\x1b[0m\n`);
  const results = await scanUrl(targetUrl);
  
  console.log(`\x1b[1m\x1b[37mGEO READINESS SCORECARD:\x1b[0m`);
  console.log(`--------------------------------------------------------`);
  console.log(`Target:               \x1b[33m${results.url}\x1b[0m`);
  console.log(`Overall GEO Score:    \x1b[1m\x1b[32m${results.score}/100\x1b[0m (${results.grade})`);
  console.log(`TTFB Latency:         \x1b[36m${results.latencyMs}ms\x1b[0m`);
  console.log(`--------------------------------------------------------`);
  console.log(`\x1b[1mLLM Crawler Accessibility:\x1b[0m`);
  console.log(`  • GPTBot (OpenAI):        ${results.crawlers.gptBot ? '✅ Permitted' : '❌ Blocked'}`);
  console.log(`  • ClaudeBot (Anthropic):  ${results.crawlers.claudeBot ? '✅ Permitted' : '❌ Blocked'}`);
  console.log(`  • PerplexityBot:          ${results.crawlers.perplexityBot ? '✅ Permitted' : '❌ Blocked'}`);
  console.log(`--------------------------------------------------------`);
  console.log(`\x1b[1mStructured Data & Entity Graph:\x1b[0m`);
  console.log(`  • JSON-LD Present:        ${results.schema.hasJsonLd ? '✅ Yes' : '⚠️ Missing'}`);
  console.log(`  • Schema Types Detected:  \x1b[36m${results.schema.types.join(', ') || 'None'}\x1b[0m`);
  console.log(`--------------------------------------------------------`);
  console.log(`\x1b[90mNeed an enterprise AI audit? Visit https://www.lumilore.ca/contact/\x1b[0m\n`);
} catch (err) {
  console.error(`\x1b[31m[Error]\x1b[0m Failed to scan target: ${err.message}`);
  process.exit(1);
}
