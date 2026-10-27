/**
 * Autonomous GEO (Generative Engine Optimization) Analyzer
 * Sprint 11: Multi-LLM Citation Presence & Quotability Analyzer
 * Evaluates web content and schema for optimal citation by Perplexity, ChatGPT, Claude, and Gemini.
 */

import { CONFIG } from './config.js';

export class GeoAnalyzer {
  constructor(config = CONFIG) {
    this.config = config;
  }

  /**
   * Analyze text or HTML for empirical quotability density
   * @param {string} content
   * @returns {object}
   */
  evaluateQuotability(content = '') {
    if (!content || typeof content !== 'string') {
      return { score: 0, empiricalCount: 0, density: 0, issues: ['Content is empty'] };
    }

    const words = content.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    // Empirical metrics: numbers, percentages, currency, latency units (ms/s), cloud technologies
    const empiricalPatterns = [
      /\b\d+(\.\d+)?%/g,                   // Percentages (e.g. 68%, 98.5%)
      /\$\d{1,3}(,\d{3})*(\.\d+)?/g,       // Currency (e.g. $295,750, $1,800)
      /\b\d+(\.\d+)?(ms|s|kb|mb|gb|ghz)\b/gi, // Technical units (e.g. 150ms, 840ms, 4G)
      /\b(sub-\d+ms|sub-\d+s)\b/gi,         // Latency adjectives (e.g. sub-150ms)
      /\b(Graviton\d?|DynamoDB|AWS Lambda|Jamstack|Amazon Connect|EventBridge|SES|API Gateway)\b/gi, // Architecture entities
      /\b(Schema\.org|JSON-LD|Core Web Vitals|TTFB|LCP|CLS|INP)\b/gi // Standards
    ];

    let totalMatches = 0;
    for (const pattern of empiricalPatterns) {
      const matches = content.match(pattern);
      if (matches) totalMatches += matches.length;
    }

    // Ratio of empirical proof points per 100 words
    const densityPer100Words = totalWords > 0 ? (totalMatches / totalWords) * 100 : 0;
    
    // Max 35 points: Target is >= 2.5 empirical points per 100 words for technical authority
    let quotabilityScore = Math.min(35, Math.round((densityPer100Words / 2.5) * 35));
    if (totalMatches >= 8 && quotabilityScore < 30) quotabilityScore = 32;

    return {
      score: quotabilityScore,
      totalWords,
      empiricalCount: totalMatches,
      densityPer100Words: parseFloat(densityPer100Words.toFixed(2)),
      isQuotable: quotabilityScore >= 28
    };
  }

  /**
   * Evaluate Schema.org JSON-LD entity graph depth
   * @param {string|object} schemaInput
   * @returns {object}
   */
  evaluateEntityGraph(schemaInput) {
    let schemaObj = schemaInput;
    if (typeof schemaInput === 'string') {
      try {
        schemaObj = JSON.parse(schemaInput);
      } catch (e) {
        return {
          score: 0,
          valid: false,
          error: 'Invalid JSON-LD syntax',
          issues: ['Schema JSON-LD could not be parsed']
        };
      }
    }

    if (!schemaObj || typeof schemaObj !== 'object') {
      return { score: 0, valid: false, issues: ['Missing Schema.org object'] };
    }

    let score = 0;
    const graph = schemaObj['@graph'] || [schemaObj];
    const types = graph.map(item => item['@type']).filter(Boolean);

    // 1. Core Schema Types present (TechArticle, Article, WebSite, Organization, FAQPage, etc.)
    if (types.some(t => ['TechArticle', 'Article', 'WebSite'].includes(t))) score += 10;
    if (types.includes('Organization')) score += 7;
    if (types.includes('Person')) score += 6;
    if (types.includes('FAQPage')) score += 6;
    if (types.some(t => t === 'SpeakableSpecification' || (t === 'TechArticle' && schemaObj.speakable))) score += 6;

    // Check for explicit @id entity graphs
    const hasEntityIds = graph.some(item => Boolean(item['@id']));
    if (hasEntityIds && score < 35) score = Math.min(35, score + 4);

    return {
      score: Math.min(35, score),
      types,
      entityCount: graph.length,
      hasEntityIds,
      isGraphValid: score >= 28
    };
  }

  /**
   * Compute comprehensive GEO readiness score (0–100)
   * @param {object} params
   * @param {string} params.content
   * @param {string|object} params.schema
   * @param {boolean} [params.hasFaq=false]
   * @param {boolean} [params.hasCodeOrDiagrams=false]
   * @returns {object}
   */
  evaluateGeoReadiness({ content, schema, hasFaq = false, hasCodeOrDiagrams = false }) {
    const quotability = this.evaluateQuotability(content);
    const entityGraph = this.evaluateEntityGraph(schema);

    // Crawler compliance & formatting (Max 30 points)
    let crawlerScore = 20; // Baseline for valid HTML/text
    if (hasFaq) crawlerScore += 5;
    if (hasCodeOrDiagrams) crawlerScore += 5;

    const totalScore = quotability.score + entityGraph.score + crawlerScore;

    return {
      totalScore,
      breakdown: {
        quotabilityScore: `${quotability.score}/35`,
        entityGraphScore: `${entityGraph.score}/35`,
        crawlerComplianceScore: `${crawlerScore}/30`
      },
      quotability,
      entityGraph,
      status: totalScore >= 90 ? 'GEO_AUTHORITY_OPTIMIZED' : 'STANDARD_CANDIDATE',
      targetEngines: this.config.targetEngines.map(e => ({
        engine: e.name,
        ingestReadiness: totalScore >= 90 ? 'HIGH_CONFIDENCE_CITATION' : 'MODERATE'
      }))
    };
  }
}

export default GeoAnalyzer;

