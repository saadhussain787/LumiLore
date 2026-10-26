/**
 * LumiLore Technologies // Autonomous Marketing & Omnichannel Distribution Agent
 * Configuration & Multi-Channel Persona Engine
 * 
 * Defines Saad Sayed author persona, dual-lens B2B editorial voice,
 * channel formatting constraints, paths, and API credential abstractions.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  // Author & Agency Persona
  persona: {
    author: 'Saad Sayed',
    authorTitle: 'Principal Cloud & AI Systems Architect',
    authorBio: 'Principal Systems Architect and Founder of LumiLore Technologies. Specializes in event-driven AWS serverless architectures, autonomous multi-agent systems, and generative engine optimization.',
    company: 'LumiLore Technologies',
    canonicalDomain: 'https://lumilore.ca',
    contactEmail: 'info@lumilore.ca',
    location: {
      city: 'Markham',
      region: 'Ontario',
      country: 'CA',
      locality: 'Greater Toronto Area'
    },
    socialProfiles: {
      linkedin: 'https://www.linkedin.com/in/saadhussainsayed',
      github: 'https://github.com/saadhussain787',
      website: 'https://lumilore.ca'
    }
  },

  // Dual-Lens Audience Positioning Hooks
  lenses: {
    corporate: {
      targetAudience: 'CTOs, VPs of Engineering, Cloud Architects, Technical Founders',
      tone: 'authoritative, empirical, architectural, zero corporate fluff',
      coreThemes: [
        'Slashing AWS cloud waste by 50%–70% via serverless event-driven architectures',
        'Sub-150ms TTFB Jamstack vs bloated WordPress/PHP monoliths',
        'Why autonomous multi-agent tool loops defeat fragile chat wrappers'
      ],
      metricsAnchor: {
        costReduction: '68%',
        ttfbLatency: '120ms',
        architectureStack: 'AWS Lambda (ARM64 Graviton) + DynamoDB On-Demand + CloudFront'
      },
      conversionLinks: {
        product: 'https://lumilore.ca/products/web-modernization/',
        insight: 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/',
        contact: 'https://lumilore.ca/contact/?service=web-modernization&lens=corporate'
      }
    },
    trades: {
      targetAudience: 'Mechanical Contractors, HVAC Fleet Owners, Commercial Plumbers, Field Service Directors',
      tone: 'pragmatic, direct, operational, revenue-first, zero jargon',
      coreThemes: [
        'Eliminating missed $1,500 after-hours emergency repair calls on the 1st ring',
        'Sub-800ms conversational AI voice dispatch directly integrated into ServiceTitan/Jobber',
        'Saving $3,500–$5,000/month by replacing human answering services with zero dropped calls'
      ],
      metricsAnchor: {
        missedCallLoss: '$295,750/yr',
        revenueImpact: '$295,750/yr',
        voiceLatency: 'sub-800ms',
        answerSpeed: '1st ring (instant 24/7 availability)'
      },
      conversionLinks: {
        product: 'https://lumilore.ca/products/voice-dispatch/',
        insight: 'https://lumilore.ca/insights/autonomous-247-ai-voice-dispatch-mechanical-trades/',
        contact: 'https://lumilore.ca/contact/?service=voice-dispatch&lens=trades'
      }
    }
  },

  // Platform Formatting & Generation Constraints
  channels: {
    linkedin: {
      name: 'LinkedIn Thought Leadership',
      hookMaxChars: 140,
      minWordCount: 220,
      maxWordCount: 450,
      maxHashtags: 4,
      allowedHashtags: ['#CloudArchitecture', '#Serverless', '#AgenticAI', '#HVACTech', '#B2BGrowth', '#FieldServices']
    },
    twitter: {
      name: 'Twitter/X Viral Technical Breakdown',
      maxTweetLength: 280,
      threadLength: 8,
      numberingFormat: '[{index}/{total}]',
      requireCodeSnippet: true,
      requireDiagram: true
    },
    communityRadar: {
      name: 'Community Interceptor & Intent Radar',
      targetCommunities: [
        { platform: 'reddit', community: 'r/aws', lens: 'corporate' },
        { platform: 'reddit', community: 'r/webdev', lens: 'corporate' },
        { platform: 'reddit', community: 'r/smallbusiness', lens: 'dual' },
        { platform: 'reddit', community: 'r/HVAC', lens: 'trades' },
        { platform: 'reddit', community: 'r/Plumbing', lens: 'trades' }
      ],
      intentKeywords: [
        'high aws bill',
        'lambda cold start',
        'serverless architecture',
        'answering service recommendations',
        'missed calls after hours',
        'servicetitan voice integration',
        'wordpress slow speed ttfb'
      ],
      draftsOnly: true // Zero automated spam; requires human review before dispatch
    },
    syndication: {
      name: 'High-DA Syndication Publisher',
      platforms: [
        { id: 'devto', name: 'Dev.to', da: 90, apiEndpoint: 'https://dev.to/api/articles' },
        { id: 'medium', name: 'Medium', da: 95, apiEndpoint: 'https://api.medium.com/v1' }
      ],
      enforceCanonicalUrl: true
    }
  },

  // System Paths & Output Vault
  paths: {
    rootDir: path.resolve(__dirname, '../../'),
    frontendDir: path.resolve(__dirname, '../../frontend'),
    insightsDir: path.resolve(__dirname, '../../frontend/insights'),
    memoryDir: path.resolve(__dirname, '../../.ai/memory'),
    outputDir: path.resolve(__dirname, '../../.ai/memory/marketing_output'),
    linkedinDir: path.resolve(__dirname, '../../.ai/memory/marketing_output/linkedin'),
    twitterDir: path.resolve(__dirname, '../../.ai/memory/marketing_output/twitter'),
    syndicationDir: path.resolve(__dirname, '../../.ai/memory/marketing_output/syndication'),
    radarDraftsFile: path.resolve(__dirname, '../../.ai/memory/marketing_output/community_radar_drafts.json'),
    summaryReportFile: path.resolve(__dirname, '../../.ai/memory/marketing_output/latest_run_summary.json')
  },

  // API Credentials & Environment Variables
  credentials: {
    devtoApiKey: process.env.DEVTO_API_KEY || '',
    mediumIntegrationToken: process.env.MEDIUM_INTEGRATION_TOKEN || '',
    mediumUserId: process.env.MEDIUM_USER_ID || '',
    twitterBearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    redditClientId: process.env.REDDIT_CLIENT_ID || '',
    redditClientSecret: process.env.REDDIT_CLIENT_SECRET || ''
  }
};

export default CONFIG;
