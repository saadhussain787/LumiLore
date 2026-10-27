/**
 * LumiLore Technologies — Autonomous GEO & Site Health Audit Service
 * Evaluates web domains for AI search discovery (ChatGPT, Claude, Perplexity)
 * and traditional search engine readiness.
 */

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS Metadata IP
  'metadata.google.internal',
  '::1'
];

/**
 * Validates domain and guards against Server-Side Request Forgery (SSRF)
 */
export function sanitizeAndValidateUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    throw new Error('A valid web domain or URL is required.');
  }

  let normalized = inputUrl.trim();

  // 1. Check for explicit protocol schemes (reject ftp:, file:, gopher:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(normalized)) {
    if (!/^https?:\/\//i.test(normalized)) {
      throw new Error('Only standard HTTP or HTTPS protocols are supported.');
    }
  } else {
    normalized = `https://${normalized}`;
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error('Malformed URL provided. Please enter a valid domain (e.g. yourcompany.com).');
  }

  // 2. Strict Port Restrictions (Allow only standard web ports)
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    throw new Error('Custom or internal port access is prohibited for security compliance.');
  }

  const hostname = parsed.hostname.toLowerCase();
  const cleanHostname = hostname.replace(/[[\]]/g, ''); // Strip brackets for IPv6

  // 3. SSRF Protection: Block private IP ranges, numeric IPs, IPv6, and cloud metadata
  if (
    BLOCKED_HOSTNAMES.includes(hostname) ||
    BLOCKED_HOSTNAMES.includes(cleanHostname) ||
    cleanHostname === '::1' ||
    /^\d+$/.test(hostname) || // Decimal encoded IPs like 2130706433
    /^0x[0-9a-f]+$/i.test(hostname) || // Hex encoded IPs
    /^10\./.test(cleanHostname) ||
    /^192\.168\./.test(cleanHostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanHostname) ||
    /^127\./.test(cleanHostname) ||
    /^fe80:/i.test(cleanHostname) || // IPv6 Link-Local
    /^fc00:/i.test(cleanHostname) || // IPv6 Unique Local
    /^fd00:/i.test(cleanHostname) ||
    cleanHostname.endsWith('.internal') ||
    cleanHostname.endsWith('.local') ||
    cleanHostname.endsWith('.localhost')
  ) {
    throw new Error('Internal or restricted IP addresses cannot be evaluated.');
  }

  return parsed;
}

/**
 * Scans a target domain's homepage and robots.txt for AI search and GEO readiness
 */
export async function auditDomain(rawUrl) {
  const parsedUrl = sanitizeAndValidateUrl(rawUrl);
  const targetOrigin = parsedUrl.origin;
  const targetHref = parsedUrl.href;

  const startTime = Date.now();
  let html = '';
  let responseLatencyMs = 0;
  let isHttps = parsedUrl.protocol === 'https:';
  let robotsTxtContent = '';
  let isWafBlocked = false;
  let isTimedOut = false;

  // 1. Fetch Homepage HTML with strict 4-second timeout
  try {
    const res = await fetch(targetHref, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LumiLore-GEO-Inspector/1.0; +https://lumilore.ca)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(4000)
    });
    responseLatencyMs = Date.now() - startTime;
    if (res.ok) {
      html = await res.text();
    } else if (res.status === 403 || res.status === 429 || res.status === 503) {
      isWafBlocked = true;
    }
  } catch (err) {
    responseLatencyMs = Date.now() - startTime;
    if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
      isTimedOut = true;
    }
  }

  // 2. Fetch robots.txt with 3-second timeout (follow redirects)
  try {
    const robotsRes = await fetch(`${targetOrigin}/robots.txt`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LumiLore-GEO-Inspector/1.0; +https://lumilore.ca)'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(3000)
    });
    if (robotsRes.ok) {
      robotsTxtContent = await robotsRes.text();
    }
  } catch {
    robotsTxtContent = '';
  }

  // 3. Compute Audit Factors
  // A. AI Crawler Rules (robots.txt)
  let gptBotAllowed = true;
  let claudeBotAllowed = true;
  let perplexityBotAllowed = true;

  if (robotsTxtContent) {
    const isBotBlocked = (botName) => {
      // Find block for this bot or generic '*'
      const botRegex = new RegExp(`User-agent:\\s*${botName}[\\s\\S]*?(?=(?:\\r?\\n\\s*User-agent:)|$)`, 'i');
      const match = robotsTxtContent.match(botRegex);
      if (!match) return false;
      const block = match[0];
      const hasRootDisallow = /(?:^|\r?\n)\s*Disallow:\s*\/\s*(?:\r?\n|$)/i.test(block);
      const hasRootAllow = /(?:^|\r?\n)\s*Allow:\s*\/\s*(?:\r?\n|$)/i.test(block);
      return hasRootDisallow && !hasRootAllow;
    };

    if (isBotBlocked('GPTBot')) gptBotAllowed = false;
    if (isBotBlocked('ClaudeBot')) claudeBotAllowed = false;
    if (isBotBlocked('PerplexityBot')) perplexityBotAllowed = false;
  }

  // B. Machine-Readable Knowledge Graph & Schema
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
  let schemaEntities = [];
  let hasEntityTriangulation = false;
  let hasAggregateRating = false;
  let hasFAQPage = false;
  let hasBreadcrumbList = false;
  let hasLocalBusiness = false;
  let ratingDetails = null;
  let faqCount = 0;

  if (hasJsonLd) {
    const schemaMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of schemaMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        const examineEntity = (ent) => {
          if (!ent || typeof ent !== 'object') return;
          const rawType = ent['@type'];
          const types = Array.isArray(rawType) ? rawType : (rawType ? [rawType] : []);

          types.forEach(type => {
            schemaEntities.push(type);
            if (['AggregateRating', 'Rating'].includes(type) || ent.aggregateRating) {
              hasAggregateRating = true;
              const r = ent.aggregateRating || ent;
              ratingDetails = {
                ratingValue: r.ratingValue ? String(r.ratingValue) : null,
                reviewCount: (r.reviewCount || r.ratingCount) ? String(r.reviewCount || r.ratingCount) : null
              };
            }
            if (type === 'FAQPage' || (ent.mainEntity && Array.isArray(ent.mainEntity) && ent.mainEntity.some(q => q['@type'] === 'Question'))) {
              hasFAQPage = true;
              if (Array.isArray(ent.mainEntity)) {
                faqCount += ent.mainEntity.length;
              }
            }
            if (type === 'BreadcrumbList' || ent.itemListElement) {
              hasBreadcrumbList = true;
            }
            const isLocalType = ['LocalBusiness', 'AutoRepair', 'AutomotiveBusiness', 'AccountingService', 'LegalService', 'ProfessionalService', 'Store', 'HVACBusiness', 'Plumber', 'Electrician', 'MedicalBusiness', 'FinancialService', 'GeneralContractor', 'HomeAndConstructionBusiness'].includes(type) ||
                                /(Business|Service|Repair|Store|Shop|Clinic)$/i.test(type);
            if (isLocalType || (type === 'Organization' && (ent.address || ent.telephone))) {
              hasLocalBusiness = true;
            }
          });

          if (ent.aggregateRating) {
            hasAggregateRating = true;
            const r = ent.aggregateRating;
            ratingDetails = {
              ratingValue: r.ratingValue ? String(r.ratingValue) : null,
              reviewCount: (r.reviewCount || r.ratingCount) ? String(r.reviewCount || r.ratingCount) : null
            };
          }

          if (ent.sameAs && (Array.isArray(ent.sameAs) ? ent.sameAs.length > 0 : Boolean(ent.sameAs))) {
            hasEntityTriangulation = true;
          }
        };

        examineEntity(parsed);
        if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
          parsed['@graph'].forEach(examineEntity);
        }
      } catch {
        // malformed json-ld block
      }
    }
  }

  // C. Metadata & Content Foundations (every-app/open-seo Superpowers)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';
  const titleLength = rawTitle.length;
  const isTitleOptimal = titleLength >= 30 && titleLength <= 60;

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const rawMetaDesc = descMatch ? descMatch[1].trim() : '';
  const descriptionLength = rawMetaDesc.length;
  const isDescriptionOptimal = descriptionLength >= 70 && descriptionLength <= 160;

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                         html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';

  const iconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i) ||
                    html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i);
  let faviconUrl = iconMatch ? iconMatch[1].trim() : '/favicon.ico';
  if (faviconUrl && !/^https?:\/\//i.test(faviconUrl)) {
    try {
      faviconUrl = new URL(faviconUrl, targetOrigin).href;
    } catch {
      faviconUrl = `${targetOrigin}/favicon.ico`;
    }
  }

  // Open Graph & Twitter Social Metadata
  const extractMetaContent = (propName, isNameAttr = false) => {
    const attr = isNameAttr ? 'name' : 'property';
    const regex1 = new RegExp(`<meta[^>]*${attr}=["']${propName}["'][^>]*content=["']([^"']*)["']`, 'i');
    const regex2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${propName}["']`, 'i');
    const m = html.match(regex1) || html.match(regex2);
    return m ? m[1].trim() : '';
  };

  const ogTitle = extractMetaContent('og:title') || rawTitle;
  const ogDescription = extractMetaContent('og:description') || rawMetaDesc;
  let ogImage = extractMetaContent('og:image');
  if (ogImage && !/^https?:\/\//i.test(ogImage)) {
    try {
      ogImage = new URL(ogImage, targetOrigin).href;
    } catch {
      ogImage = '';
    }
  }
  const ogUrl = extractMetaContent('og:url') || canonicalUrl || targetHref;
  const ogSiteName = extractMetaContent('og:site_name') || parsedUrl.hostname;

  const twitterCard = extractMetaContent('twitter:card', true) || (ogImage ? 'summary_large_image' : 'summary');
  const twitterTitle = extractMetaContent('twitter:title', true) || ogTitle;
  const twitterDescription = extractMetaContent('twitter:description', true) || ogDescription;
  let twitterImage = extractMetaContent('twitter:image', true) || ogImage;
  if (twitterImage && !/^https?:\/\//i.test(twitterImage)) {
    try {
      twitterImage = new URL(twitterImage, targetOrigin).href;
    } catch {
      twitterImage = '';
    }
  }

  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

  // D. Heading Hierarchy Extraction & Blunder Detector (H1–H6)
  const headingMatches = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
  const headingsTree = [];
  let h1Count = 0;
  let lastLevel = 0;
  let hasSkippedLevels = false;
  const headingErrors = [];

  headingMatches.forEach(m => {
    const tag = m[1].toLowerCase();
    const level = parseInt(tag[1], 10);
    const text = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (text) {
      headingsTree.push({ tag, level, text });
      if (level === 1) h1Count++;
      if (lastLevel > 0 && level > lastLevel + 1) {
        hasSkippedLevels = true;
        headingErrors.push(`Skipped level: H${lastLevel} to H${level}`);
      }
      lastLevel = level;
    }
  });

  if (h1Count === 0) {
    headingErrors.unshift('Missing H1: No <h1> tag found on page.');
  } else if (h1Count > 1) {
    headingErrors.push(`Multiple H1s: Found ${h1Count} <h1> tags (dilutes primary keyword).`);
  }

  // 4. Calculate Scoring: Dual Lenses (GEO Score & Google SEO Score 0–100)
  
  // Lens A: GEO Score Breakdown (0 - 100)
  const geoBreakdown = {
    aiCrawlerReadiness: { score: 0, max: 30, status: 'warning' },
    knowledgeGraphSchema: { score: 0, max: 35, status: 'warning' },
    technicalFoundations: { score: 0, max: 35, status: 'warning' }
  };

  if (gptBotAllowed) geoBreakdown.aiCrawlerReadiness.score += 10;
  if (claudeBotAllowed) geoBreakdown.aiCrawlerReadiness.score += 10;
  if (perplexityBotAllowed) geoBreakdown.aiCrawlerReadiness.score += 10;
  geoBreakdown.aiCrawlerReadiness.status = geoBreakdown.aiCrawlerReadiness.score >= 20 ? 'pass' : 'fail';

  if (hasJsonLd) geoBreakdown.knowledgeGraphSchema.score += 15;
  if (schemaEntities.some(t => ['Organization', 'Person', 'LocalBusiness', 'ProfessionalService'].includes(t))) {
    geoBreakdown.knowledgeGraphSchema.score += 10;
  }
  if (hasEntityTriangulation) geoBreakdown.knowledgeGraphSchema.score += 10;
  geoBreakdown.knowledgeGraphSchema.status = geoBreakdown.knowledgeGraphSchema.score >= 20 ? 'pass' : 'fail';

  if (isHttps) geoBreakdown.technicalFoundations.score += 10;
  if (responseLatencyMs > 0 && responseLatencyMs < 1200) {
    geoBreakdown.technicalFoundations.score += 10;
  } else if (responseLatencyMs > 0 && responseLatencyMs < 2500) {
    geoBreakdown.technicalFoundations.score += 5;
  }
  if (rawTitle && rawMetaDesc) geoBreakdown.technicalFoundations.score += 10;
  if (ogTitle || hasViewport) geoBreakdown.technicalFoundations.score += 5;
  geoBreakdown.technicalFoundations.status = geoBreakdown.technicalFoundations.score >= 20 ? 'pass' : 'fail';

  const geoScore = Math.min(100, Math.max(10,
    geoBreakdown.aiCrawlerReadiness.score +
    geoBreakdown.knowledgeGraphSchema.score +
    geoBreakdown.technicalFoundations.score
  ));

  // Lens B: Google SEO Score Breakdown (0 - 100)
  const seoBreakdown = {
    metaCompliance: { score: 0, max: 35, status: 'warning' },
    headingHierarchy: { score: 0, max: 25, status: 'warning' },
    richSnippets: { score: 0, max: 20, status: 'warning' },
    technicalFoundations: { score: 0, max: 20, status: 'warning' }
  };

  // 1. Meta & SERP Compliance (35 pts)
  if (isTitleOptimal) {
    seoBreakdown.metaCompliance.score += 15;
  } else if (titleLength > 0 && titleLength <= 70) {
    seoBreakdown.metaCompliance.score += 8;
  }
  if (isDescriptionOptimal) {
    seoBreakdown.metaCompliance.score += 10;
  } else if (descriptionLength > 0 && descriptionLength <= 200) {
    seoBreakdown.metaCompliance.score += 5;
  }
  if (canonicalUrl) seoBreakdown.metaCompliance.score += 5;
  if (faviconUrl) seoBreakdown.metaCompliance.score += 5;
  seoBreakdown.metaCompliance.status = seoBreakdown.metaCompliance.score >= 25 ? 'pass' : 'fail';

  // 2. Semantic Heading Hierarchy (25 pts)
  if (h1Count === 1) {
    seoBreakdown.headingHierarchy.score += 15;
  } else if (h1Count > 1) {
    seoBreakdown.headingHierarchy.score += 5;
  }
  if (!hasSkippedLevels && headingsTree.length > 0) {
    seoBreakdown.headingHierarchy.score += 10;
  } else if (headingsTree.length > 0) {
    seoBreakdown.headingHierarchy.score += 3;
  }
  seoBreakdown.headingHierarchy.status = seoBreakdown.headingHierarchy.score >= 18 ? 'pass' : 'fail';

  // 3. Rich Snippets Microdata (20 pts)
  if (hasAggregateRating) seoBreakdown.richSnippets.score += 5;
  if (hasFAQPage) seoBreakdown.richSnippets.score += 5;
  if (hasBreadcrumbList) seoBreakdown.richSnippets.score += 5;
  if (hasLocalBusiness || schemaEntities.some(e => ['Organization', 'Corporation', 'LocalBusiness'].includes(e))) {
    seoBreakdown.richSnippets.score += 5;
  }
  seoBreakdown.richSnippets.status = seoBreakdown.richSnippets.score >= 10 ? 'pass' : 'fail';

  // 4. Technical Performance & HTTPS (20 pts)
  if (isHttps) seoBreakdown.technicalFoundations.score += 10;
  if (responseLatencyMs > 0 && responseLatencyMs < 1200) {
    seoBreakdown.technicalFoundations.score += 10;
  } else if (responseLatencyMs > 0 && responseLatencyMs < 2500) {
    seoBreakdown.technicalFoundations.score += 5;
  }
  seoBreakdown.technicalFoundations.status = seoBreakdown.technicalFoundations.score >= 15 ? 'pass' : 'fail';

  const seoScore = Math.min(100, Math.max(10,
    seoBreakdown.metaCompliance.score +
    seoBreakdown.headingHierarchy.score +
    seoBreakdown.richSnippets.score +
    seoBreakdown.technicalFoundations.score
  ));

  // 5. Generate Prioritized Gaps & Recommendations
  const recommendations = [];

  if (isWafBlocked) {
    recommendations.push({
      priority: 'CRITICAL',
      title: 'Aggressive WAF / Cloudflare Bot Challenge',
      description: 'Your server returned a 403/Challenge to automated inspection. While this protects against scrapers, it actively blinds ChatGPT Search and Perplexity from indexing your latest content in real time.'
    });
  } else if (isTimedOut) {
    recommendations.push({
      priority: 'CRITICAL',
      title: 'Crawler Inspection Timeout (>4000ms)',
      description: 'Your web server took longer than 4,000ms to respond to crawler probes. High server latency causes automated AI indexing pipelines to drop your domain.'
    });
  }

  if (!hasJsonLd || schemaEntities.length === 0) {
    recommendations.push({
      priority: 'CRITICAL',
      title: 'Missing Machine-Readable Schema Graph',
      description: 'Your website lacks structured JSON-LD entity data. ChatGPT and Perplexity struggle to identify your verified company credentials, founders, and services.'
    });
  }

  if (!hasEntityTriangulation) {
    recommendations.push({
      priority: 'HIGH',
      title: 'No Entity Authority Triangulation',
      description: 'Your domain is not linked via sameAs schema triples to trusted entity registries (LinkedIn, GitHub, Crunchbase), causing AI models to lack confidence when citing your brand.'
    });
  }

  if (!gptBotAllowed || !claudeBotAllowed || !perplexityBotAllowed) {
    recommendations.push({
      priority: 'CRITICAL',
      title: 'AI Search Crawlers Blocked in robots.txt',
      description: 'One or more frontier AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are restricted in your robots.txt, preventing real-time inclusion in AI search answers.'
    });
  }

  if (responseLatencyMs > 1500) {
    recommendations.push({
      priority: 'MEDIUM',
      title: 'High Server Edge Latency',
      description: `Homepage TTFB response was ${responseLatencyMs}ms. Slow edge response times lower your prioritization during automated LLM search crawling.`
    });
  }

  if (recommendations.length < 2) {
    recommendations.push({
      priority: 'OPTIMIZATION',
      title: 'AI Search Citation RAG Optimization',
      description: 'Enhance technical case studies with structured FAQ microdata and Markdown tables to maximize quote probability in ChatGPT search mode.'
    });
  }

  // SEO Recommendations
  const seoRecommendations = [];
  if (h1Count === 0) {
    seoRecommendations.push({
      priority: 'CRITICAL',
      title: 'Missing <h1> Primary Heading',
      description: 'The page lacks an H1 heading. Google uses the H1 to determine the primary entity and topic of your page.'
    });
  } else if (h1Count > 1) {
    seoRecommendations.push({
      priority: 'HIGH',
      title: `Multiple <h1> Tags Detected (${h1Count} found)`,
      description: 'Consolidate down to a single H1 heading to prevent keyword dilution across competing titles.'
    });
  }

  if (titleLength > 60) {
    seoRecommendations.push({
      priority: 'HIGH',
      title: `Meta Title Truncation (${titleLength}/60 chars)`,
      description: 'Your page title exceeds 60 characters and will be truncated with an ellipsis on Google Desktop and Mobile search results.'
    });
  }

  if (!hasAggregateRating && !hasFAQPage) {
    seoRecommendations.push({
      priority: 'HIGH',
      title: 'Missing Google Rich Snippets Microdata',
      description: 'Your page does not qualify for Google Star Ratings or Expandable FAQ Dropdowns, forfeiting up to +35% higher Click-Through Rates.'
    });
  }

  if (!ogImage) {
    seoRecommendations.push({
      priority: 'MEDIUM',
      title: 'Missing Open Graph Social Image (og:image)',
      description: 'Links shared on LinkedIn, Twitter, and Slack will render as plain text or blank fallback cards without rich media.'
    });
  }

  return {
    domain: parsedUrl.hostname,
    url: targetHref,
    // Backwards-compatible primary fields (GEO)
    score: geoScore,
    breakdown: geoBreakdown,
    // Explicit Dual-Lens Scores
    geoScore,
    geoBreakdown,
    seoScore,
    seoBreakdown,
    latencyMs: responseLatencyMs,
    signals: {
      isHttps,
      hasJsonLd,
      entitiesFound: schemaEntities,
      hasEntityTriangulation,
      aiCrawlers: {
        gptBot: gptBotAllowed,
        claudeBot: claudeBotAllowed,
        perplexityBot: perplexityBotAllowed
      },
      meta: {
        title: rawTitle,
        titleLength,
        isTitleOptimal,
        metaDescription: rawMetaDesc,
        descriptionLength,
        isDescriptionOptimal,
        canonicalUrl,
        faviconUrl
      },
      social: {
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogSiteName,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage
      },
      headings: {
        tree: headingsTree,
        h1Count,
        hasSkippedLevels,
        totalHeadings: headingsTree.length,
        errors: headingErrors
      },
      richSnippets: {
        hasAggregateRating,
        hasFAQPage,
        hasBreadcrumbList,
        hasLocalBusiness,
        ratingDetails,
        faqCount
      }
    },
    recommendations: recommendations.slice(0, 3),
    seoRecommendations: seoRecommendations.slice(0, 3),
    timestamp: new Date().toISOString()
  };
}
