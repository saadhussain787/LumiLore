/**
 * Autonomous SEO & GEO Content Engine
 * Generates authoritative, citation-engineered technical case studies & architectural teardowns
 * Optimized for frontier AI answer engines (ChatGPT, Perplexity, Claude) and Google Rich Results
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';

/**
 * Format Schema.org TechArticle & FAQPage JSON-LD
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
      <p class="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pl-7">
        ${faq.answer}
      </p>
    </div>
  `).join('');

  // Render Code Snippets
  const codeBlocks = (article.codeSnippets || []).map(snippet => `
    <div class="rounded-2xl bg-[#050914] border border-cyan-500/30 overflow-hidden my-6 shadow-2xl">
      <div class="flex items-center justify-between px-4 py-2.5 bg-cyan-950/50 border-b border-cyan-500/20 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span class="text-cyan-300 font-bold ml-2">${snippet.title || snippet.filename || 'Architecture Execution'}</span>
        </div>
        <span class="text-slate-400 uppercase text-[10px]">${snippet.language || 'javascript'}</span>
      </div>
      <div class="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
        <pre><code>${snippet.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>
    </div>
  `).join('');

  return `---
layout: layout.html
title: "${article.title.replace(/"/g, '\\"')} | LumiLore Technologies"
description: "${article.description.replace(/"/g, '\\"')}"
---

<!-- JSON-LD Structured Data Graph for LLM Ingestion & Rich Results -->
<script type="application/ld+json">
${schemaJson}
</script>

<article class="relative z-10 min-h-screen pt-28 pb-32 overflow-hidden">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">

    <!-- Back to Insights / Products Breadcrumb -->
    <div class="mb-8">
      <a href="/products/geo-engine/" class="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 hover:text-white transition-colors">
        <span>←</span>
        <span>Back to Autonomous GEO Engine</span>
      </a>
    </div>

    <!-- Article Header -->
    <header class="mb-12 border-b border-white/10 pb-10">
      
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
      <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 font-display">
        ${article.title}
      </h1>

      <!-- Subtitle / Executive Thesis -->
      <p class="text-base sm:text-xl text-slate-300 font-light leading-relaxed">
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
      
      <!-- Section: The Operational & Cost Antipattern -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          1. The Architecture Antipattern &amp; Root Failure Mode
        </h2>
        <div class="text-slate-300 font-light text-base space-y-4">
          ${article.problemHtml || ''}
        </div>
      </section>

      <!-- Section: The Production Serverless Solution -->
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
          href="/contact/?source=insight_${article.slug}&service=roadmap" 
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
  buildArticleSchema,
  renderArticleHtml,
  saveArticle
};
