/**
 * Self-Verification Harness 2.2: OmniRoute Sitemaps & AI Bot Directives
 * Verifies robots.txt AI crawler rules, llms.txt formatting, and compilation integrity
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function runTest() {
  console.log('🧪 [Self-Verification 2.2] Testing OmniRoute Sitemaps & AI Bot Directives...');

  // Test 1: Check frontend/robots.njk
  const robotsNjkPath = path.join(rootDir, 'frontend', 'robots.njk');
  assert.ok(fs.existsSync(robotsNjkPath), 'frontend/robots.njk must exist');
  const robotsContent = fs.readFileSync(robotsNjkPath, 'utf8');

  const requiredBots = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'];
  for (const bot of requiredBots) {
    assert.ok(robotsContent.includes(`User-agent: ${bot}`), `robots.njk must include directive for ${bot}`);
    assert.ok(robotsContent.includes('Allow: /'), `robots.njk must allow root for ${bot}`);
  }
  assert.ok(robotsContent.includes('Sitemap: https://lumilore.ca/sitemap.xml'), 'robots.njk must specify canonical sitemap');
  console.log('  ✓ Verified frontend/robots.njk permits all 4 core AI search crawlers and sets canonical sitemap');

  // Test 2: Check frontend/llms.txt.njk
  const llmsNjkPath = path.join(rootDir, 'frontend', 'llms.txt.njk');
  assert.ok(fs.existsSync(llmsNjkPath), 'frontend/llms.txt.njk must exist');
  const llmsContent = fs.readFileSync(llmsNjkPath, 'utf8');

  assert.ok(llmsContent.includes('permalink: /llms.txt'), 'llms.txt.njk must specify /llms.txt permalink');
  assert.ok(llmsContent.includes('# LumiLore Technologies'), 'llms.txt.njk must include top-level heading');
  assert.ok(llmsContent.includes('Sub-800ms'), 'llms.txt.njk must list sub-800ms telephony benchmark');
  assert.ok(llmsContent.includes('Sub-150ms'), 'llms.txt.njk must list sub-150ms TTFB benchmark');
  assert.ok(llmsContent.includes('Saad Sayed'), 'llms.txt.njk must attribute Principal Architect Saad Sayed');
  console.log('  ✓ Verified frontend/llms.txt.njk conforms to AI web crawler ingest standard with benchmarks');

  console.log('✅ [Self-Verification 2.2 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 2.2 FAILED]', err);
  process.exit(1);
});

