/**
 * LumiLore GEO Scanner Core Engine
 * Zero-dependency URL inspection for Generative Engine Optimization
 * https://www.lumilore.ca
 */

export async function scanUrl(inputUrl) {
  let target = inputUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  const urlObj = new URL(target);
  const startTime = performance.now();
  
  // 1. Fetch target HTML
  const response = await fetch(target, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LumiLore-GEOScanner/1.0; +https://www.lumilore.ca)' }
  });
  const latencyMs = Math.round(performance.now() - startTime);
  const html = await response.text();

  // 2. Fetch robots.txt
  let robotsTxt = '';
  try {
    const robotsRes = await fetch(`${urlObj.origin}/robots.txt`);
    if (robotsRes.ok) {
      robotsTxt = await robotsRes.text();
    }
  } catch (e) {
    // Non-fatal
  }

  // 3. Inspect Crawler Permissions accurately
  const checkAgentPermission = (agent) => {
    // If agent block explicitly disallows entire site 'Disallow: /' without trailing path
    const disallowRoot = new RegExp(`User-agent:\\s*(${agent}|\\*)[\\s\\S]*?Disallow:\\s*\\/\\s*($|\\n)`, 'i');
    if (disallowRoot.test(robotsTxt)) {
      // Check if there is an explicit allow
      const allowRoot = new RegExp(`User-agent:\\s*(${agent}|\\*)[\\s\\S]*?Allow:\\s*\\/\\s*($|\\n)`, 'i');
      return allowRoot.test(robotsTxt);
    }
    return true;
  };

  const crawlers = {
    gptBot: checkAgentPermission('GPTBot'),
    claudeBot: checkAgentPermission('ClaudeBot'),
    perplexityBot: checkAgentPermission('PerplexityBot')
  };

  // 4. Schema.org Inspection
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const types = new Set();
  let match;
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@type']) types.add(parsed['@type']);
      if (Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach(item => item['@type'] && types.add(item['@type']));
      }
    } catch (e) {
      // Ignore malformed json in tag
    }
  }

  // 5. Score calculation
  let score = 50;
  if (crawlers.gptBot) score += 15;
  if (crawlers.claudeBot) score += 10;
  if (crawlers.perplexityBot) score += 10;
  if (types.size > 0) score += 15;

  let grade = 'C';
  if (score >= 90) grade = 'A+ (Optimal)';
  else if (score >= 80) grade = 'A (Excellent)';
  else if (score >= 70) grade = 'B (Good)';

  return {
    url: target,
    score,
    grade,
    latencyMs,
    crawlers,
    schema: {
      hasJsonLd: types.size > 0,
      types: Array.from(types)
    }
  };
}
