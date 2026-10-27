/**
 * Self-Verification Harness 2.1: Multi-LLM Citation Presence & Quotability Analyzer
 * Verifies GeoAnalyzer empirical density calculation, entity graph evaluation, and scoring determinism
 */

import assert from 'assert';
import { GeoAnalyzer } from '../../agents/seo-geo-agent/geo-analyzer.js';

async function runTest() {
  console.log('🧪 [Self-Verification 2.1] Testing GEO Quotability & Entity Graph Analyzer...');
  const analyzer = new GeoAnalyzer();

  // Test 1: High-Authority Engineering Sample (LumiLore Case Study Content)
  const technicalCopy = `
    By migrating from provisioned x86 servers to Graviton3 AWS Lambda and DynamoDB single-table design,
    we achieved a 68% cloud waste reduction, dropping monthly cloud spend by $295,750/yr.
    Our serverless API delivers sub-150ms TTFB globally, with p95 telephony response times under 840ms.
    The architecture adheres to Schema.org and Core Web Vitals standards with 0.00 CLS.
  `;

  const validSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': 'https://lumilore.ca/insights/cutting-aws-cloud-waste/#article',
        headline: 'Cutting AWS Cloud Waste'
      },
      {
        '@type': 'Organization',
        '@id': 'https://lumilore.ca/#organization',
        name: 'LumiLore Technologies'
      },
      {
        '@type': 'Person',
        '@id': 'https://lumilore.ca/#founder-saad',
        name: 'Saad Sayed'
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://lumilore.ca/insights/cutting-aws-cloud-waste/#faq'
      }
    ]
  };

  const highAuthReport = analyzer.evaluateGeoReadiness({
    content: technicalCopy,
    schema: validSchema,
    hasFaq: true,
    hasCodeOrDiagrams: true
  });

  assert.ok(highAuthReport.totalScore >= 90, `High authority copy must score >= 90, got: ${highAuthReport.totalScore}`);
  assert.strictEqual(highAuthReport.status, 'GEO_AUTHORITY_OPTIMIZED');
  assert.strictEqual(highAuthReport.quotability.isQuotable, true);
  assert.ok(highAuthReport.quotability.empiricalCount >= 8, 'Empirical count must detect metrics');
  assert.strictEqual(highAuthReport.entityGraph.isGraphValid, true);
  console.log(`  ✓ High-authority technical copy scored: ${highAuthReport.totalScore}/100 (${highAuthReport.breakdown.quotabilityScore} quotability, ${highAuthReport.breakdown.entityGraphScore} schema, ${highAuthReport.breakdown.crawlerComplianceScore} crawler)`);

  // Test 2: Low-Quality Fluff Content Sample
  const fluffCopy = 'We are the best company and we offer good solutions for everyone in the cloud.';
  const lowAuthReport = analyzer.evaluateGeoReadiness({
    content: fluffCopy,
    schema: null,
    hasFaq: false,
    hasCodeOrDiagrams: false
  });

  assert.ok(lowAuthReport.totalScore < 40, `Fluff copy must score < 40, got: ${lowAuthReport.totalScore}`);
  assert.strictEqual(lowAuthReport.status, 'STANDARD_CANDIDATE');
  console.log(`  ✓ Generic fluff copy correctly penalized: scored only ${lowAuthReport.totalScore}/100`);

  console.log('✅ [Self-Verification 2.1 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 2.1 FAILED]', err);
  process.exit(1);
});

