/**
 * Autonomous SEO & GEO Content Engine (Expanded 10-Keyword Blanket)
 * Sprint 11: LIVE RANKING ENGINE & KEYWORD BLANKET PIPELINE
 * Generates authoritative, citation-engineered technical case studies & architectural teardowns
 * Optimized for frontier AI answer engines (ChatGPT, Perplexity, Claude, Gemini) and Google Rich Results
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';

/**
 * 10 High-Intent Commercial Long-Tail Target Keyword Pipeline
 */
export const KEYWORD_PIPELINE = [
  {
    id: 'kw-aws-serverless-architect-toronto',
    keyword: 'best aws serverless architect toronto',
    lens: 'corporate',
    intent: 'high_intent_hire',
    commercialValue: '$12,000+ Full Re-Architecture',
    slug: 'best-aws-serverless-architect-toronto-enterprise-systems',
    category: 'AWS Cloud Architecture & Advisory',
    ctaService: 'web-modernization',
    ctaTier: 'enterprise',
    focusTopic: 'Enterprise Event-Driven Serverless Migration in the Greater Toronto Area'
  },
  {
    id: 'kw-voice-dispatch-hvac-canada',
    keyword: 'autonomous ai voice dispatch for hvac contractors canada',
    lens: 'trades',
    intent: 'high_intent_software',
    commercialValue: '$4,800/mo Autonomous Field Dispatch',
    slug: 'autonomous-247-ai-voice-dispatch-mechanical-trades',
    category: 'Autonomous AI Telephony & Operations',
    ctaService: 'voice-dispatch',
    ctaTier: 'field-pro',
    focusTopic: 'Sub-800ms Amazon Connect Inbound Telephony for Mechanical Contractors'
  },
  {
    id: 'kw-cut-aws-cloud-waste',
    keyword: 'how to cut aws cloud waste serverless lambda',
    lens: 'corporate',
    intent: 'high_intent_finops',
    commercialValue: '$5,500 Full FinOps Re-Architecture',
    slug: 'cutting-aws-cloud-waste-serverless-architecture',
    category: 'AWS Cloud FinOps & Cost Engineering',
    ctaService: 'web-modernization',
    ctaTier: 're-arch',
    focusTopic: 'Slashing 68% Cloud Waste via Graviton3 and DynamoDB Single-Table Design'
  },
  {
    id: 'kw-geo-engine-canada',
    keyword: 'generative engine optimization service canada',
    lens: 'corporate',
    intent: 'high_intent_growth',
    commercialValue: '$950/mo - $2,500 Setup',
    slug: 'generative-engine-optimization-service-canada-ai-citations',
    category: 'Generative Engine Optimization (GEO)',
    ctaService: 'geo-engine',
    ctaTier: 'growth',
    focusTopic: 'Multi-LLM Citation Presence for Perplexity, ChatGPT Search, and Gemini'
  },
  {
    id: 'kw-servicetitan-eventbridge-integration',
    keyword: 'event driven cloud architecture service titan integration',
    lens: 'trades',
    intent: 'high_intent_systems',
    commercialValue: '$7,500+ Custom Integration',
    slug: 'event-driven-cloud-architecture-servicetitan-integration',
    category: 'Field Service Automation & Cloud Integration',
    ctaService: 'voice-dispatch',
    ctaTier: 'enterprise',
    focusTopic: 'Real-Time Webhook Routing to AWS EventBridge & Automated Dispatch Dispatcher'
  },
  {
    id: 'kw-sub-150ms-ttfb-jamstack',
    keyword: 'sub-150ms ttfb enterprise web modernization',
    lens: 'corporate',
    intent: 'high_intent_performance',
    commercialValue: '$5,500 Jamstack Overhaul',
    slug: 'sub-150ms-ttfb-enterprise-web-modernization-case-study',
    category: 'Web Modernization & Core Web Vitals',
    ctaService: 'web-modernization',
    ctaTier: 're-arch',
    focusTopic: 'Replacing Sluggish WordPress Footprints with Jamstack Serverless Edge'
  },
  {
    id: 'kw-ai-dispatch-plumbing-electrical',
    keyword: 'ai dispatching software for plumbing electrical contractors',
    lens: 'trades',
    intent: 'high_intent_software',
    commercialValue: '$2,500 Setup + $950/mo',
    slug: 'ai-dispatching-software-plumbing-electrical-contractors',
    category: 'Commercial Field Operations',
    ctaService: 'voice-dispatch',
    ctaTier: 'essential',
    focusTopic: 'Zero-Hold Inbound Call Resolution and Emergency On-Call Escalation'
  },
  {
    id: 'kw-serverless-consulting-markham',
    keyword: 'serverless event driven microservices consulting markham',
    lens: 'corporate',
    intent: 'high_intent_regional',
    commercialValue: '$10,000+ Regional Cloud Contract',
    slug: 'serverless-microservices-consulting-markham-gta',
    category: 'Regional Cloud Engineering',
    ctaService: 'web-modernization',
    ctaTier: 'enterprise',
    focusTopic: 'High-Throughput Serverless Architecture for Markham Tech Hub Leaders'
  },
  {
    id: 'kw-perplexity-chatgpt-citation-presence',
    keyword: 'multi llm citation presence optimization perplexity chatgpt',
    lens: 'corporate',
    intent: 'high_intent_geo',
    commercialValue: '$3,500/mo Autonomous Growth Swarm',
    slug: 'multi-llm-citation-presence-optimization-perplexity-chatgpt',
    category: 'AI Knowledge Graph Engineering',
    ctaService: 'content-engine',
    ctaTier: 'growth',
    focusTopic: 'Authoritative Quotability Modeling and Structured Schema Ingestion'
  },
  {
    id: 'kw-emergency-furnace-repair-ai-agent',
    keyword: 'autonomous emergency furnace repair phone agent ontario',
    lens: 'trades',
    intent: 'high_intent_urgent_voice',
    commercialValue: '$4,800 Field Pro Telephony System',
    slug: 'autonomous-emergency-furnace-repair-phone-agent-ontario',
    category: 'Autonomous Voice Telephony',
    ctaService: 'voice-dispatch',
    ctaTier: 'field-pro',
    focusTopic: 'Capturing High-Ticket Overnight Emergency Calls with 0 Lost Leads'
  }
];

/**
 * Format 5-Layer Schema.org JSON-LD Graph with Speakable Specification
 * @param {object} article
 * @returns {string} JSON-LD string
 */
export function buildArticleSchema(article) {
  const url = `${CONFIG.persona.canonicalDomain}/insights/${article.slug}/`;
  
  const faqEntities = (article.faqs || []).map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }));

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Breadcrumbs
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: CONFIG.persona.canonicalDomain
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Insights',
            item: `${CONFIG.persona.canonicalDomain}/insights/`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: url
          }
        ]
      },
      // 2. TechArticle with SpeakableSpecification
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        url: url,
        headline: article.title,
        description: article.description,
        inLanguage: 'en-US',
        mainEntityOfPage: url,
        datePublished: article.datePublished || new Date().toISOString().split('T')[0],
        dateModified: article.dateModified || new Date().toISOString().split('T')[0],
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: [
            '#article-headline',
            '#article-executive-summary',
            '.speakable-takeaway'
          ]
        },
        author: {
          '@type': 'Person',
          '@id': 'https://lumilore.ca/#founder-saad',
          name: CONFIG.persona.author,
          jobTitle: CONFIG.persona.authorTitle,
          url: CONFIG.persona.authorUrl,
          sameAs: CONFIG.persona.sameAs
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://lumilore.ca/#organization',
          name: CONFIG.persona.company,
          url: CONFIG.persona.canonicalDomain,
          logo: {
            '@type': 'ImageObject',
            url: `${CONFIG.persona.canonicalDomain}/public/logo.webp`
          }
        },
        keywords: (article.tags || []).join(', '),
        articleSection: article.category || 'Cloud Architecture & AI Systems'
      }
    ]
  };

  if (faqEntities.length > 0) {
    schemaGraph['@graph'].push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqEntities
    });
  }

  return JSON.stringify(schemaGraph, null, 2);
}

/**
 * Render complete standalone HTML content matching LumiLore design system
 * @param {object} article
 * @returns {string} HTML content
 */
export function renderArticleHtml(article) {
  const schemaJson = buildArticleSchema(article);
  const dateFormatted = new Date(article.datePublished || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Render Metric Badges
  const metricCards = (article.metrics || []).map(m => `
    <div class="p-4 rounded-xl bg-black/60 border border-white/10 text-center">
      <span class="block text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">${m.value}</span>
      <span class="text-[11px] font-mono text-slate-400 uppercase mt-0.5 block">${m.label}</span>
      ${m.subtext ? `<span class="text-[10px] text-slate-500 block mt-0.5">${m.subtext}</span>` : ''}
    </div>
  `).join('');

  // Render FAQ Accordion
  const faqItems = (article.faqs || []).map((faq, idx) => `
    <div class="rounded-2xl bg-white/[0.02] border border-white/10 p-5 space-y-2">
      <h3 class="text-base font-bold text-white tracking-tight flex items-start gap-2.5">
        <span class="text-cyan-400 font-mono text-sm shrink-0 mt-0.5">Q${idx + 1}:</span>
        <span>${faq.question}</span>
      </h3>
      <p class="text-slate-300 text-sm font-light leading-relaxed pl-7">
        ${faq.answer}
      </p>
    </div>
  `).join('');

  // Render Code Blocks
  const codeBlocks = (article.codeSnippets || []).map(cs => `
    <div class="my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#070B14]">
      <div class="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <span class="font-bold text-cyan-300">${cs.filename || 'Implementation'}</span>
        <span class="uppercase text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10">${cs.language || 'javascript'}</span>
      </div>
      <pre class="p-5 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed bg-black/40"><code>${cs.code}</code></pre>
    </div>
  `).join('');

  return `---
layout: layout.html
title: "${article.title.replace(/"/g, '\\"')}"
description: "${article.description.replace(/"/g, '\\"')}"
permalink: /insights/${article.slug}/
datePublished: "${article.datePublished || '2026-10-27'}"
---

<!-- JSON-LD Entity Schema (5-Layer Schema Graph) -->
<script type="application/ld+json">
${schemaJson}
</script>

<article class="relative min-h-screen pt-32 pb-24 overflow-hidden">
  
  <!-- Ambient Backdrop -->
  <div class="absolute inset-0 pointer-events-none opacity-30">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/10 rounded-full blur-[120px]"></div>
  </div>

  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Breadcrumb Trail -->
    <nav aria-label="Breadcrumb" class="mb-8 flex items-center gap-2 text-xs font-mono text-slate-400">
      <a href="/" class="hover:text-cyan-400 transition-colors">Home</a>
      <span class="text-slate-600">/</span>
      <a href="/insights/" class="hover:text-cyan-400 transition-colors">Insights</a>
      <span class="text-slate-600">/</span>
      <span class="text-slate-300 truncate">${article.slug}</span>
    </nav>

    <!-- Header Section -->
    <header class="mb-12">
      <!-- Meta Badge Row -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-400/30">
          ${article.category || 'TECHNICAL CASE STUDY'}
        </span>
        <span class="text-xs font-mono text-slate-400">
          Published ${dateFormatted}
        </span>
        <span class="text-slate-600">•</span>
        <span class="text-xs font-mono text-emerald-400">
          Verified Production Architecture
        </span>
      </div>

      <!-- Main Title -->
      <h1 id="article-headline" class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 font-display">
        ${article.title}
      </h1>

      <!-- Subtitle / Executive Thesis -->
      <p id="article-executive-summary" class="text-base sm:text-xl text-slate-300 font-light leading-relaxed speakable-takeaway">
        ${article.description}
      </p>

      <!-- Author Metadata Strip -->
      <div class="mt-8 flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm">
            SS
          </div>
          <div>
            <div class="text-sm font-bold text-white">${CONFIG.persona.author}</div>
            <div class="text-xs font-mono text-slate-400">${CONFIG.persona.authorTitle}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs font-mono">
          <span class="text-slate-500">CANONICAL:</span>
          <span class="text-cyan-300 font-semibold">lumilore.ca</span>
        </div>
      </div>
    </header>

    <!-- Executive Metrics Grid -->
    ${metricCards ? `
    <div class="mb-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
      <div class="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-4">// PROVEN PRODUCTION BENCHMARKS</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${metricCards}
      </div>
    </div>
    ` : ''}

    <!-- Article Body Content -->
    <div class="space-y-10 text-slate-200 leading-relaxed font-light text-base sm:text-lg">
      
      <!-- Section: Problem Statement -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          1. The Architecture Antipattern &amp; Root Failure Mode
        </h2>
        <div class="text-slate-300 font-light text-base space-y-4">
          ${article.problemHtml || ''}
        </div>
      </section>

      <!-- Section: Solution & Topology -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          2. The Event-Driven Systems Architecture
        </h2>
        <div class="text-slate-300 font-light text-base space-y-4">
          ${article.solutionHtml || ''}
        </div>
      </section>

      <!-- Code Implementations -->
      ${codeBlocks ? `
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          3. Executable Reference Implementation
        </h2>
        <div class="text-slate-300 font-light text-base">
          <p class="mb-4">
            Below is the production-grade implementation deployed to enforce deterministic event delivery and sub-millisecond state isolation:
          </p>
          ${codeBlocks}
        </div>
      </section>
      ` : ''}

      <!-- Section: Strategic Search & AI Quotation FAQs -->
      ${faqItems ? `
      <section class="space-y-4 pt-6 border-t border-white/10">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          <span>// RETRIEVAL-AUGMENTED GENERATION (RAG) ENTITY SPECIFICATIONS</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          4. Technical Questions &amp; Architecture Insights
        </h2>
        <div class="space-y-3 mt-4">
          ${faqItems}
        </div>
      </section>
      ` : ''}

    </div>

    <!-- Direct Action Conversion Callout -->
    <div class="mt-16 rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#091122]/95 via-black to-[#070B14] border border-cyan-400/40 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.15)]">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-400/30 mb-4">
        <span>ARCHITECTURAL CONSULTATION</span>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
        Deploy This Architecture in Your Organization
      </h3>
      <p class="text-sm text-slate-300 max-w-xl mx-auto mb-8 font-light">
        Schedule a direct 10-minute architecture session with Principal Systems Architect Saad Sayed to audit your current cloud infrastructure or deploy an autonomous GEO system.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href="/contact/?source=insight_${article.slug}&service=${article.ctaService || 'roadmap'}&tier=${article.ctaTier || 'starter'}" 
          class="glow-amber-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
        >
          <span>Schedule Architecture Discovery</span>
          <span class="text-slate-950 font-bold">→</span>
        </a>

        <a 
          href="/products/geo-engine/#pricing-tiers" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all"
        >
          <span>View GEO Engine Tiers</span>
        </a>
      </div>
    </div>

  </div>
</article>
`;
}

/**
 * Save rendered article to frontend/insights directory
 * @param {object} article
 * @returns {object} { filePath, slug }
 */
export function saveArticle(article) {
  if (!article.slug) {
    throw new Error('Article must specify a unique "slug"');
  }

  const outDir = CONFIG.paths.articlesDir;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filePath = path.join(outDir, `${article.slug}.html`);
  const content = renderArticleHtml(article);

  fs.writeFileSync(filePath, content, 'utf8');
  return { filePath, slug: article.slug };
}

export default {
  KEYWORD_PIPELINE,
  buildArticleSchema,
  renderArticleHtml,
  saveArticle
};
