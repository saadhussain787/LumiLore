/**
 * Self-Verification Harness 3.2: 5-Layer Schema & Empirical Article Rendering
 * Verifies buildArticleSchema, SpeakableSpecification, FAQPage, BreadcrumbList, and renderArticleHtml
 */

import assert from 'assert';
import { buildArticleSchema, renderArticleHtml } from '../../agents/seo-geo-agent/content-engine.js';

async function runTest() {
  console.log('🧪 [Self-Verification 3.2] Testing 5-Layer Schema & Empirical Article Rendering...');

  const mockArticle = {
    title: 'Benchmarking Sub-150ms TTFB on AWS Serverless Jamstack',
    slug: 'benchmarking-sub-150ms-ttfb-aws-serverless',
    description: 'Empirical analysis of cutting edge latency down to 112ms using Graviton3 Lambda and Global CloudFront edge caches.',
    category: 'Cloud Performance Engineering',
    tags: ['AWS', 'Jamstack', 'Serverless', 'TTFB'],
    metrics: [
      { value: '112ms', label: 'Average Edge TTFB' },
      { value: '98/100', label: 'Google Mobile Score' }
    ],
    faqs: [
      {
        question: 'How does serverless edge achieve sub-150ms TTFB?',
        answer: 'By compiling static HTML assets to CloudFront edge points of presence and executing API calls via warm Graviton3 micro-lambdas.'
      }
    ],
    codeSnippets: [
      {
        filename: 'cache-control-headers.js',
        language: 'javascript',
        code: 'res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600");'
      }
    ]
  };

  // Test 1: Schema Structure
  const schemaJson = buildArticleSchema(mockArticle);
  const parsed = JSON.parse(schemaJson);
  assert.strictEqual(parsed['@context'], 'https://schema.org');
  assert.ok(Array.isArray(parsed['@graph']), 'Must contain @graph array');

  const types = parsed['@graph'].map(g => g['@type']);
  assert.ok(types.includes('BreadcrumbList'), 'Must contain BreadcrumbList');
  assert.ok(types.includes('TechArticle'), 'Must contain TechArticle');
  assert.ok(types.includes('FAQPage'), 'Must contain FAQPage');

  const techArticle = parsed['@graph'].find(g => g['@type'] === 'TechArticle');
  assert.ok(techArticle.speakable, 'TechArticle must contain speakable specification');
  assert.strictEqual(techArticle.speakable['@type'], 'SpeakableSpecification');
  assert.ok(techArticle.speakable.cssSelector.includes('#article-headline'), 'Must include #article-headline in speakable');
  assert.ok(techArticle.speakable.cssSelector.includes('#article-executive-summary'), 'Must include #article-executive-summary in speakable');
  console.log('  ✓ Verified 5-Layer Schema graph with SpeakableSpecification and FAQPage');

  // Test 2: HTML Rendering
  const html = renderArticleHtml(mockArticle);
  assert.ok(html.includes('id="article-headline"'), 'HTML must include #article-headline selector');
  assert.ok(html.includes('id="article-executive-summary"'), 'HTML must include #article-executive-summary selector');
  assert.ok(html.includes('112ms'), 'HTML must render metric value 112ms');
  assert.ok(html.includes('cache-control-headers.js'), 'HTML must render code snippet block');
  assert.ok(html.includes('Q1:'), 'HTML must render FAQ item');
  console.log('  ✓ Verified HTML layout contains all speakable anchors, metrics cards, code blocks, and FAQs');

  console.log('✅ [Self-Verification 3.2 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 3.2 FAILED]', err);
  process.exit(1);
});

