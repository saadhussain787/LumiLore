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

  // 2. Fetch robots.txt with 3-second timeout
  try {
    const robotsRes = await fetch(`${targetOrigin}/robots.txt`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LumiLore-GEO-Inspector/1.0; +https://lumilore.ca)'
      },
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
    // Simple heuristic check for Disallow rules on frontier bots
    const lowerRobots = robotsTxtContent.toLowerCase();
    if (lowerRobots.includes('gptbot') && lowerRobots.includes('disallow: /')) {
      gptBotAllowed = false;
    }
    if (lowerRobots.includes('claudebot') && lowerRobots.includes('disallow: /')) {
      claudeBotAllowed = false;
    }
    if (lowerRobots.includes('perplexitybot') && lowerRobots.includes('disallow: /')) {
      perplexityBotAllowed = false;
    }
  }

  // B. Machine-Readable Knowledge Graph & Schema
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
  let schemaEntities = [];
  let hasEntityTriangulation = false;

  if (hasJsonLd) {
    const schemaMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of schemaMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed['@type']) schemaEntities.push(parsed['@type']);
        if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
          schemaEntities.push(...parsed['@graph'].map(e => e['@type']));
          if (parsed['@graph'].some(e => e.sameAs && e.sameAs.length > 0)) {
            hasEntityTriangulation = true;
          }
        }
        if (parsed.sameAs && parsed.sameAs.length > 0) {
          hasEntityTriangulation = true;
        }
      } catch {
        // malformed json-ld block
      }
    }
  }

  // C. Metadata & Content Foundations
  const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
  const hasMetaDescription = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i.test(html);
  const hasOpenGraph = /<meta[^>]*property=["']og:title["']/i.test(html);
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

  // 4. Calculate Scoring (0 - 100)
  let score = 0;
  const breakdown = {
    aiCrawlerReadiness: { score: 0, max: 30, status: 'warning' },
    knowledgeGraphSchema: { score: 0, max: 35, status: 'warning' },
    technicalFoundations: { score: 0, max: 35, status: 'warning' }
  };

  // AI Crawler Readiness (30 pts)
  if (gptBotAllowed) breakdown.aiCrawlerReadiness.score += 10;
  if (claudeBotAllowed) breakdown.aiCrawlerReadiness.score += 10;
  if (perplexityBotAllowed) breakdown.aiCrawlerReadiness.score += 10;
  breakdown.aiCrawlerReadiness.status = breakdown.aiCrawlerReadiness.score >= 20 ? 'pass' : 'fail';

  // Knowledge Graph & Schema (35 pts)
  if (hasJsonLd) breakdown.knowledgeGraphSchema.score += 15;
  if (schemaEntities.some(t => ['Organization', 'Person', 'LocalBusiness', 'ProfessionalService'].includes(t))) {
    breakdown.knowledgeGraphSchema.score += 10;
  }
  if (hasEntityTriangulation) breakdown.knowledgeGraphSchema.score += 10;
  breakdown.knowledgeGraphSchema.status = breakdown.knowledgeGraphSchema.score >= 20 ? 'pass' : 'fail';

  // Technical Foundations (35 pts)
  if (isHttps) breakdown.technicalFoundations.score += 10;
  if (responseLatencyMs > 0 && responseLatencyMs < 1200) {
    breakdown.technicalFoundations.score += 10;
  } else if (responseLatencyMs > 0 && responseLatencyMs < 2500) {
    breakdown.technicalFoundations.score += 5;
  }
  if (hasTitle && hasMetaDescription) breakdown.technicalFoundations.score += 10;
  if (hasOpenGraph || hasViewport) breakdown.technicalFoundations.score += 5;
  breakdown.technicalFoundations.status = breakdown.technicalFoundations.score >= 20 ? 'pass' : 'fail';

  score = breakdown.aiCrawlerReadiness.score + breakdown.knowledgeGraphSchema.score + breakdown.technicalFoundations.score;
  score = Math.min(100, Math.max(10, score));

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

  // Ensure at least 2 recommendations are provided
  if (recommendations.length < 2) {
    recommendations.push({
      priority: 'OPTIMIZATION',
      title: 'AI Search Citation RAG Optimization',
      description: 'Enhance technical case studies with structured FAQ microdata and Markdown tables to maximize quote probability in ChatGPT search mode.'
    });
  }

  return {
    domain: parsedUrl.hostname,
    url: targetHref,
    score,
    latencyMs: responseLatencyMs,
    breakdown,
    signals: {
      isHttps,
      hasJsonLd,
      entitiesFound: schemaEntities,
      hasEntityTriangulation,
      aiCrawlers: {
        gptBot: gptBotAllowed,
        claudeBot: claudeBotAllowed,
        perplexityBot: perplexityBotAllowed
      }
    },
    recommendations: recommendations.slice(0, 3),
    timestamp: new Date().toISOString()
  };
}
