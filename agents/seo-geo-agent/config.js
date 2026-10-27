/**
 * Autonomous SEO & GEO Agent - Configuration & Persona Engine
 * Engineered for LumiLore Technologies (lumilore.ca)
 * Customer Zero & Productized Client-Facing Service
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  // Brand & Architecture Authority Persona
  persona: {
    author: 'Saad Sayed',
    authorTitle: 'Principal Cloud & AI Systems Architect',
    authorBio: 'Principal Systems Architect and Founder of LumiLore Technologies. Specializes in event-driven AWS serverless infrastructure, autonomous multi-agent systems, and generative engine optimization.',
    authorUrl: 'https://lumilore.ca/about/',
    company: 'LumiLore Technologies',
    canonicalDomain: 'https://lumilore.ca',
    contactEmail: 'info@lumilore.ca',
    location: {
      city: 'Markham',
      region: 'Ontario',
      country: 'CA',
      locality: 'Greater Toronto Area'
    },
    sameAs: [
      'https://www.linkedin.com/in/saadhussainsayed',
      'https://github.com/saadhussain787',
      'https://lumilore.ca'
    ],
    // Voice & Editorial Guidelines
    voice: {
      tone: 'authoritative, empirical, engineering-grounded, zero corporate fluff',
      targetAudience: 'CTOs, VPs of Engineering, Technical Founders, Operations Leaders',
      formattingRules: [
        'Must include exact architectural numbers, latencies (ms), and cost reductions (%)',
        'Must include complete executable code snippets (Node.js/AWS SDK/Python)',
        'Must include Mermaid architectural workflow diagrams',
        'Must include structured FAQ section formatted for frontier LLM quotation',
        'Must include complete Schema.org Article / TechArticle JSON-LD triples'
      ]
    }
  },

  // Target Answer Engines & Crawler User-Agents
  targetEngines: [
    { name: 'ChatGPT Search (OpenAI)', bot: 'GPTBot', priority: 'critical' },
    { name: 'Perplexity AI', bot: 'PerplexityBot', priority: 'critical' },
    { name: 'Claude (Anthropic)', bot: 'ClaudeBot', priority: 'high' },
    { name: 'Google Search & AI Overviews', bot: 'Googlebot', priority: 'critical' },
    { name: 'Gemini (Google)', bot: 'Google-Extended', priority: 'high' }
  ],

  // Priority Core Pillars & High-Intent Query Benchmarks (Dual-Lens Commercial Blanket)
  targetQueries: [
    'best aws serverless architect toronto',
    'autonomous ai voice dispatch for hvac contractors canada',
    'how to cut aws cloud waste serverless lambda',
    'generative engine optimization service canada',
    'event driven cloud architecture service titan integration',
    'sub-150ms ttfb enterprise web modernization',
    'ai dispatching software for plumbing electrical contractors',
    'serverless event driven microservices consulting markham',
    'multi llm citation presence optimization perplexity chatgpt',
    'autonomous emergency furnace repair phone agent ontario'
  ],

  // Google PageSpeed Insights & Core Web Vitals Telemetry (public-apis)
  pageSpeed: {
    apiKey: process.env.PAGESPEED_API_KEY || 'AIzaSyABXJTWhxQmaAPXUyrk9LAaTewEFf295CA',
    endpoint: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
    targetUrl: 'https://lumilore.ca',
    fallbackAuditEndpoint: 'https://bhsahnzaqb.execute-api.ca-central-1.amazonaws.com/api/status',
    budgets: {
      lcpMs: 2500, // < 2.5s Good
      cls: 0.1,    // < 0.1 Good
      inpMs: 200,  // < 200ms Good
      ttfbMs: 150  // < 150ms Good
    }
  },

  // Live SERP & Ranking Telemetry Engine (open-seo / OmniRoute inspired)
  serpEngine: {
    trackLive: true,
    cacheDurationMs: 6 * 60 * 60 * 1000, // 6 Hours Disk Cache
    primaryDomain: 'lumilore.ca',
    competitors: [
      'reliancehomecomfort.com',
      'enercare.ca',
      'slalom.com',
      'onica.com',
      'mychoiceautoservices.com'
    ]
  },

  // Scoring Weights Matrix for Live Ranking Engine
  rankingWeights: {
    coreWebVitals: 30,      // LCP, CLS, INP, TTFB
    technicalSeo: 35,       // Schema, DOM, Headings, Links, Mobile
    geoCitationDensity: 35  // Entity Disambiguation, Quotability, LLM-readiness
  },

  // System Filepaths
  paths: {
    rootDir: path.resolve(__dirname, '../../'),
    frontendDir: path.resolve(__dirname, '../../frontend'),
    articlesDir: path.resolve(__dirname, '../../frontend/insights'),
    distDir: path.resolve(__dirname, '../../_site'),
    memoryDir: path.resolve(__dirname, '../../.ai/memory'),
    metricsFile: path.resolve(__dirname, '../../.ai/memory/geo_metrics.json'),
    googleKeyPath: path.resolve(__dirname, '../../backend/google-service-account.json')
  },

  // Publication Schema Template
  schemaDefaults: {
    '@context': 'https://schema.org',
    publisher: {
      '@type': 'Organization',
      name: 'LumiLore Technologies',
      url: 'https://lumilore.ca',
      logo: 'https://lumilore.ca/public/logo.webp'
    }
  }
};

export default CONFIG;
