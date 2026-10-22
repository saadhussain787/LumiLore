/**
 * Google Real-Time Indexing Bridge
 * Directly notifies Google Indexing API (URL_UPDATED / URL_DELETED)
 * Cuts index latency for new architectural case studies and products from weeks to hours.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JWT } from '../../backend/src/node_modules/google-auth-library/build/src/index.js';
import { CONFIG } from './config.js';

const GOOGLE_INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

export class GoogleIndexer {
  constructor(options = {}) {
    this.keyPath = options.keyPath || CONFIG.paths.googleKeyPath;
    this.credentials = null;
    this.jwtClient = null;
    this.loadCredentials();
  }

  /**
   * Load and validate Google Service Account credentials
   */
  loadCredentials() {
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        this.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      } else if (fs.existsSync(this.keyPath)) {
        const raw = fs.readFileSync(this.keyPath, 'utf8');
        this.credentials = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[GoogleIndexer Notice] Could not parse credentials from', this.keyPath, err.message);
      this.credentials = null;
    }

    if (this.credentials && this.credentials.client_email && this.credentials.private_key) {
      this.jwtClient = new JWT({
        email: this.credentials.client_email,
        key: this.credentials.private_key,
        scopes: [INDEXING_SCOPE]
      });
    }
  }

  /**
   * Check if credentials are valid and active
   */
  hasValidCredentials() {
    return Boolean(this.jwtClient && this.credentials?.client_email);
  }

  /**
   * Obtain an active Google OAuth2 access token for Indexing API
   */
  async getAccessToken() {
    if (!this.hasValidCredentials()) {
      throw new Error('Missing Google Service Account credentials.');
    }
    const tokenResponse = await this.jwtClient.getAccessToken();
    return tokenResponse.token;
  }

  /**
   * Publish an indexing notification to Google
   * @param {object} params
   * @param {string} params.url
   * @param {'URL_UPDATED'|'URL_DELETED'} [params.type='URL_UPDATED']
   * @param {boolean} [params.dryRun=false]
   */
  async notifyUrl({ url, type = 'URL_UPDATED', dryRun = false }) {
    if (!url || !url.startsWith('http')) {
      throw new Error(`Invalid URL for Google indexing: ${url}`);
    }

    if (!this.hasValidCredentials()) {
      return {
        url,
        type,
        status: 'CREDENTIALS_MISSING',
        success: false,
        timestamp: new Date().toISOString(),
        instructions: 'Please configure Google Service Account JSON to activate Google Indexing API.'
      };
    }

    if (dryRun) {
      return {
        url,
        type,
        status: 'DRY_RUN_SIMULATED',
        success: true,
        clientEmail: this.credentials.client_email,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(GOOGLE_INDEXING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          url,
          type
        })
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.ok) {
        return {
          url,
          type,
          status: 'PUBLISHED_SUCCESS',
          success: true,
          httpStatus: response.status,
          notificationMetadata: responseBody.urlNotificationMetadata || {},
          timestamp: new Date().toISOString()
        };
      }

      // Handle common Google Search Console permission requirement (403 Permission Denied)
      const isForbidden = response.status === 403;
      return {
        url,
        type,
        status: isForbidden ? 'PERMISSION_DENIED_GSC' : 'HTTP_ERROR',
        success: false,
        httpStatus: response.status,
        clientEmail: this.credentials.client_email,
        error: responseBody.error?.message || response.statusText,
        instructions: isForbidden
          ? `Action Required: Add "${this.credentials.client_email}" as an Owner in Google Search Console for property "${CONFIG.persona.canonicalDomain}" to authorize programmatic indexing pings.`
          : 'Check Google Cloud Console to ensure "Web Search Indexing API" is enabled for your project.'
      };
    } catch (err) {
      return {
        url,
        type,
        status: 'NETWORK_EXCEPTION',
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Ingest all URLs from _site/sitemap.xml and submit in batch
   * @param {object} [options={}]
   * @param {boolean} [options.dryRun=false]
   * @param {number} [options.limit=10]
   */
  async notifySitemap({ dryRun = false, limit = 10 } = {}) {
    const sitemapPath = path.join(CONFIG.paths.distDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      throw new Error(`sitemap.xml not found at ${sitemapPath}. Run "npm run build" first.`);
    }

    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = [...sitemapXml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
    const urls = locMatches.map(m => m[1]).slice(0, limit);

    const results = [];
    for (const url of urls) {
      const res = await this.notifyUrl({ url, type: 'URL_UPDATED', dryRun });
      results.push(res);
    }

    return {
      totalFound: locMatches.length,
      totalSubmitted: results.length,
      dryRun,
      results
    };
  }
}

export default GoogleIndexer;
