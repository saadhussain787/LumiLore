/**
 * LumiLore Technologies // Autonomous Marketing & Omnichannel Distribution Agent
 * High-DA Multi-Platform Syndication Publisher
 * 
 * Formats published insight articles into platform-optimized Markdown payloads
 * for Dev.to (DA 90) and Medium (DA 95) with mandatory canonical URL headers
 * to pass maximum domain authority without duplicate content penalties.
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';

export class SyndicationPublisher {
  constructor(options = {}) {
    this.config = options.config || CONFIG;
    this.extractor = options.extractor || new ContentExtractor();
    this.enforceCanonical = this.config.channels?.syndication?.enforceCanonicalUrl ?? true;
    this.author = this.config.persona.author;
    this.canonicalDomain = this.config.persona.canonicalDomain;
  }

  /**
   * Format an insight article for Dev.to publication (YAML frontmatter + Markdown)
   * @param {Object} insight Extracted insight object
   * @returns {Object} Dev.to payload object and formatted markdown
   */
  formatArticleForDevTo(insight) {
    const canonicalUrl = insight.canonicalUrl || `${this.canonicalDomain}/insights/${insight.slug}/`;
    const title = this._cleanTitle(insight.title);
    const tags = this._formatDevToTags(insight.keywords, insight.lens);
    const bodyContent = this._buildSyndicatedBody(insight, canonicalUrl);

    const devToMarkdown = `---
title: "${title.replace(/"/g, '\\"')}"
published: false
description: "${(insight.description || '').replace(/"/g, '\\"')}"
tags: ${tags.join(', ')}
canonical_url: ${canonicalUrl}
cover_image: ${this.canonicalDomain}/public/logo.webp
---

${bodyContent}
`;

    return {
      platform: 'devto',
      slug: insight.slug,
      title,
      canonicalUrl,
      tags,
      payload: {
        article: {
          title,
          published: false, // Default to draft for safety
          body_markdown: devToMarkdown.trim(),
          tags,
          canonical_url: canonicalUrl
        }
      },
      rawMarkdown: devToMarkdown.trim()
    };
  }

  /**
   * Publish an article to Dev.to via API (supporting safe dry-run mode)
   * @param {Object} insight Extracted insight object
   * @param {Object} [options]
   * @returns {Promise<Object>} Publication result
   */
  async publishToDevTo(insight, options = {}) {
    const isDryRun = options.dryRun ?? true;
    const devToData = this.formatArticleForDevTo(insight);
    const apiKey = this.config.credentials.devtoApiKey;

    // Save Markdown file to output vault
    const outputDir = options.outputDir || this.config.paths.syndicationDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outPath = path.join(outputDir, `devto_${insight.slug}.md`);
    fs.writeFileSync(outPath, devToData.rawMarkdown, 'utf-8');

    if (isDryRun || !apiKey) {
      return {
        success: true,
        platform: 'devto',
        slug: insight.slug,
        title: devToData.title,
        mode: isDryRun ? 'dry-run' : 'offline-saved',
        canonicalUrl: devToData.canonicalUrl,
        savedPath: outPath,
        savedMdPath: outPath,
        reason: isDryRun ? 'Executed in dry-run mode' : 'No DEVTO_API_KEY provided; saved to disk'
      };
    }

    try {
      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'User-Agent': 'LumiLore-Syndication-Publisher/1.0'
        },
        body: JSON.stringify(devToData.payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Dev.to API error (${response.status}): ${errText}`);
      }

      const json = await response.json();
      return {
        success: true,
        platform: 'devto',
        slug: insight.slug,
        title: devToData.title,
        mode: 'live',
        articleId: json.id,
        url: json.url,
        canonicalUrl: json.canonical_url,
        savedPath: outPath,
        savedMdPath: outPath
      };
    } catch (err) {
      return {
        success: false,
        platform: 'devto',
        slug: insight.slug,
        mode: 'live-failed',
        error: err.message,
        savedPath: outPath,
        savedMdPath: outPath
      };
    }
  }

  /**
   * Format an insight article for Medium publication (Medium API JSON Schema)
   * @param {Object} insight Extracted insight object
   * @returns {Object} Medium API payload object
   */
  formatArticleForMedium(insight) {
    const canonicalUrl = insight.canonicalUrl || `${this.canonicalDomain}/insights/${insight.slug}/`;
    const title = this._cleanTitle(insight.title);
    const tags = this._formatMediumTags(insight.keywords, insight.lens);
    const bodyContent = this._buildSyndicatedBody(insight, canonicalUrl);

    const mediumMarkdown = `# ${title}\n\n${bodyContent}`;

    return {
      platform: 'medium',
      slug: insight.slug,
      title,
      canonicalUrl,
      tags,
      payload: {
        title,
        contentFormat: 'markdown',
        content: mediumMarkdown.trim(),
        canonicalUrl: canonicalUrl,
        tags,
        publishStatus: 'draft' // Safe draft mode
      },
      rawMarkdown: mediumMarkdown.trim()
    };
  }

  /**
   * Publish an article to Medium via API (supporting safe dry-run and draft mode protection)
   * @param {Object} insight Extracted insight object
   * @param {Object} [options]
   * @returns {Promise<Object>} Publication result
   */
  async publishToMedium(insight, options = {}) {
    const isDryRun = options.dryRun ?? true;
    const mediumData = this.formatArticleForMedium(insight);
    const token = this.config.credentials.mediumIntegrationToken;

    // Save Markdown and JSON payloads to output vault
    const outputDir = options.outputDir || this.config.paths.syndicationDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const mdPath = path.join(outputDir, `medium_${insight.slug}.md`);
    const jsonPath = path.join(outputDir, `medium_${insight.slug}.json`);
    fs.writeFileSync(mdPath, mediumData.rawMarkdown, 'utf-8');
    fs.writeFileSync(jsonPath, JSON.stringify(mediumData.payload, null, 2), 'utf-8');

    if (isDryRun || !token) {
      return {
        success: true,
        platform: 'medium',
        slug: insight.slug,
        title: mediumData.title,
        mode: isDryRun ? 'dry-run' : 'offline-saved',
        canonicalUrl: mediumData.canonicalUrl,
        publishStatus: 'draft',
        savedMdPath: mdPath,
        savedJsonPath: jsonPath,
        reason: isDryRun ? 'Executed in dry-run mode' : 'No MEDIUM_INTEGRATION_TOKEN provided; saved to disk'
      };
    }

    try {
      // 1. Resolve author user ID if not explicitly configured
      let userId = this.config.credentials.mediumUserId;
      if (!userId) {
        const userRes = await fetch('https://api.medium.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!userRes.ok) {
          throw new Error(`Medium user resolution failed (${userRes.status})`);
        }
        const userJson = await userRes.json();
        userId = userJson?.data?.id;
      }

      if (!userId) {
        throw new Error('Unable to resolve Medium User ID');
      }

      // 2. Dispatch Post in Draft Mode
      const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(mediumData.payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Medium API error (${response.status}): ${errText}`);
      }

      const json = await response.json();
      return {
        success: true,
        platform: 'medium',
        slug: insight.slug,
        title: mediumData.title,
        mode: 'live',
        articleId: json.data?.id,
        url: json.data?.url,
        canonicalUrl: json.data?.canonicalUrl,
        publishStatus: 'draft',
        savedMdPath: mdPath
      };
    } catch (err) {
      return {
        success: false,
        platform: 'medium',
        slug: insight.slug,
        mode: 'live-failed',
        error: err.message,
        savedMdPath: mdPath
      };
    }
  }

  /**
   * Syndicate all insight articles across all platforms
   * @param {Object} [options]
   * @returns {Promise<Object>} Consolidated syndication manifest
   */
  async publishAll(options = {}) {
    const isDryRun = options.dryRun ?? true;
    const insights = this.extractor.getAllInsights();
    const devtoResults = [];
    const mediumResults = [];

    for (const insight of insights) {
      const devtoRes = await this.publishToDevTo(insight, { dryRun: isDryRun });
      devtoResults.push(devtoRes);

      const mediumRes = await this.publishToMedium(insight, { dryRun: isDryRun });
      mediumResults.push(mediumRes);
    }

    const outputDir = options.outputDir || this.config.paths.syndicationDir;
    const manifest = {
      timestamp: new Date().toISOString(),
      mode: isDryRun ? 'DRY-RUN (SIMULATION)' : 'LIVE-PUBLISHED',
      totalArticles: insights.length,
      platforms: ['devto', 'medium'],
      devto: devtoResults,
      medium: mediumResults
    };

    const manifestPath = path.join(outputDir, 'latest_syndication_manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return manifest;
  }

  /**
   * Format all insight articles for all supported syndication platforms
   * @returns {Array<Object>} Formatted articles across platforms
   */
  getAllFormattedArticles() {
    const insights = this.extractor.getAllInsights();
    const formatted = [];

    insights.forEach(insight => {
      formatted.push({
        slug: insight.slug,
        lens: insight.lens,
        canonicalUrl: insight.canonicalUrl,
        devto: this.formatArticleForDevTo(insight),
        medium: this.formatArticleForMedium(insight)
      });
    });

    return formatted;
  }

  /**
   * Build syndicated body with canonical attribution header and footer
   */
  _buildSyndicatedBody(insight, canonicalUrl) {
    const attributionHeader = `> *Originally published at [${this.config.persona.company}](${canonicalUrl}) by [${this.author}](${this.canonicalDomain}/about/).*

---
`;

    // Inject empirical metrics callout block if structured metrics are extracted
    let metricsBlock = '';
    if (insight.metrics && Object.keys(insight.metrics).length > 0) {
      const metricItems = [];
      if (insight.metrics.costReduction) metricItems.push(`**Cost Reduction:** ${insight.metrics.costReduction}`);
      if (insight.metrics.revenueImpact) metricItems.push(`**Revenue Impact:** ${insight.metrics.revenueImpact}`);
      if (insight.metrics.primaryStat) metricItems.push(`**Latency:** ${insight.metrics.primaryStat}`);
      if (insight.metrics.speedBoost) metricItems.push(`**Performance:** ${insight.metrics.speedBoost}`);
      if (insight.metrics.annualSavings) metricItems.push(`**Annual Savings:** ${insight.metrics.annualSavings}`);
      if (insight.metrics.answerSpeed) metricItems.push(`**Dispatch Speed:** ${insight.metrics.answerSpeed}`);

      if (metricItems.length > 0) {
        metricsBlock = `> 📊 **Empirical Architectural Benchmarks:** ${metricItems.join(' • ')}\n\n`;
      }
    }

    const attributionFooter = `

---

### About the Author & Architecture
**${this.author}** is the Principal Systems Architect and Founder of [${this.config.persona.company}](${this.canonicalDomain}), specializing in event-driven AWS serverless systems, autonomous multi-agent tool loops, and sub-150ms cloud modernizations.

* **Original Case Study:** [${canonicalUrl}](${canonicalUrl})
* **Schedule an Architecture Audit:** [${this.canonicalDomain}/contact/](${this.canonicalDomain}/contact/)
`;

    // Process insight body markdown to remove site-specific navigation links
    let cleanMarkdown = insight.bodyMarkdown || '';
    cleanMarkdown = cleanMarkdown.replace(/\[\s*←\s*Back to[^\]]*\]\([^)]*\)/gi, '');
    cleanMarkdown = cleanMarkdown.replace(/^#\s+[^\n]+\n+/, ''); // Remove duplicate top H1

    return `${attributionHeader}\n${metricsBlock}${cleanMarkdown.trim()}\n${attributionFooter}`;
  }

  /**
   * Clean site suffixes from titles (e.g. "| LumiLore Technologies")
   */
  _cleanTitle(rawTitle) {
    return (rawTitle || '')
      .replace(/\s*\|\s*LumiLore Technologies.*$/i, '')
      .replace(/\s*-\s*LumiLore Technologies.*$/i, '')
      .trim();
  }

  /**
   * Format tags for Dev.to (lowercase, alphanumeric, max 4 tags)
   */
  _formatDevToTags(keywords = [], lens) {
    const baseTags = lens === 'trades' 
      ? ['ai', 'voicetech', 'automation', 'fieldservices']
      : ['aws', 'serverless', 'cloud', 'architecture'];

    const formatted = keywords
      .map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(k => k.length >= 2 && k.length <= 20)
      .slice(0, 2);

    const merged = Array.from(new Set([...formatted, ...baseTags])).slice(0, 4);
    return merged;
  }

  /**
   * Format tags for Medium (max 5 tags)
   */
  _formatMediumTags(keywords = [], lens) {
    const baseTags = lens === 'trades'
      ? ['Artificial Intelligence', 'Voice AI', 'Automation', 'Field Services', 'Small Business']
      : ['AWS', 'Serverless', 'Cloud Architecture', 'FinOps', 'Software Engineering'];

    return baseTags.slice(0, 5);
  }
}

export default SyndicationPublisher;
