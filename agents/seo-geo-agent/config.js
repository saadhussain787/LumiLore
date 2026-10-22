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

  // Priority Core Pillars & High-Intent Query Benchmarks
  targetQueries: [
    'best aws serverless architect toronto',
    'autonomous ai voice dispatch for hvac contractors',
    'how to cut aws cloud waste serverless lambda',
    'generative engine optimization service canada',
    'event driven cloud architecture service titan integration'
  ],

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
