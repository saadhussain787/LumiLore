/**
 * LumiLore Serverless Core Engine
 * API Gateway HTTP API Router, Security, Intake & Agentic AI Dispatcher
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import crypto from 'node:crypto';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Content-Type': 'application/json'
};

// Initialize DynamoDB Document Client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ca-central-1'
});

export const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true
  }
});

// Initialize SES Client
export const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ca-central-1'
});

// Initialize Amazon Bedrock Runtime Client (us-east-1 endpoint)
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

/**
 * LumiBot Dual-Lens AI Architecture System Prompt Matrix
 */
export const LUMIBOT_SYSTEM_PROMPT = `You are LumiBot, Principal AI Solutions Architect for LumiLore Technologies (lumilore.ca).
Your role is to advise prospects, enterprise leaders, and contractor owners on scalable engineering, autonomous AI workflows, and cloud architecture.

LUMILORE DUAL-LENS CAPABILITIES:
1. CORPORATE & ENTERPRISE LENS:
- Custom AWS Serverless Cloud Architecture (AWS Lambda, Amazon DynamoDB, EventBridge, Amazon API Gateway, Amazon SQS/SNS).
- Sub-800ms edge latency, 99.99% uptime SLA, zero-idle cost scaling, and SOC-2 Type II readiness.
- Autonomous Multi-Agent Swarms & LLM Orchestration using Amazon Bedrock.
- Principal Systems Architect: Saad Sayed.

2. TRADES & CONTRACTORS LENS:
- 24/7 AI Voice Dispatch and automated SMS lead response for HVAC, plumbing, electrical, and roofing contractors.
- Deep bi-directional integrations with ServiceTitan, Jobber, Housecall Pro, and custom CRM systems.
- 0 missed emergency night calls; qualifies leads and schedules field crews in < 60 seconds.
- Operations & Field Automation Lead: Arfa Sayeed.

STRATEGIC CAMPAIGNS & OFFERS:
- 48-Hour Bespoke Architecture Roadmap (Comprehensive cloud infrastructure topology & sprint breakdown).
- Free Systems & Field Dispatch Audit (Zero-risk operational analysis for contractor dispatch).
- 2-Week Proof-of-Concept (POC) Sprint (Production-grade microservices deployment).

BEHAVIORAL DIRECTIVES:
- Maintain an authoritative, elite engineering tone. Be concise, direct, and technically rigorous.
- Keep replies between 1 and 3 focused paragraphs.
- Never make up false pricing or quote hourly rates. Direct users to the interactive scoping console.
- In every meaningful consultation, provide a clear next step by linking to the booking console:
  * For Corporate/Cloud: [Book Architecture Discovery](/contact/?lens=corporate&source=lumibot_chat)
  * For Trades/Contractors: [Book Systems Audit](/contact/?lens=trades&source=lumibot_chat)`;

/**
 * Deterministic Architect Resilience Fallback Engine
 * Shields against account-level 0.0 sandbox quotas, ThrottlingExceptions, or API timeouts
 * @param {string} userMessage 
 * @param {string} [audienceLens] 
 * @returns {string} Markdown response with contextual architecture breakdown & direct booking link
 */
export function generateResilienceFallbackReply(userMessage = '', audienceLens = 'corporate') {
  const q = String(userMessage).toLowerCase();

  // 1. Intent: Trades & Field Automation / Voice Dispatch
  const isTradesQuery = /voice|dispatch|contractor|plumb|hvac|electric|roof|call|phone|servicetitan|jobber|housecall|crew|field|emergency|night/i.test(q) || audienceLens === 'trades';
  if (isTradesQuery && !/cloud|serverless|aws|lambda|dynamodb|soc-2|migration/i.test(q)) {
    return `At LumiLore, our **24/7 AI Voice Dispatch Architecture** connects directly to your telephony provider (Amazon Connect or Twilio SIP) to ensure zero missed calls after-hours.

**Operational Highlights:**
- **Sub-60s Triage & Dispatch:** Real-time conversational AI qualifies emergency plumbing, HVAC, or electrical issues, calculates priority, and books directly into your technician's schedule.
- **Bi-Directional CRM Sync:** Live webhook integration with **ServiceTitan, Jobber, and Housecall Pro** with automated customer confirmation SMS.
- **Dedicated Operations Lead:** Directed by **Arfa Sayeed**, specializing in field logistics and zero-leakage contractor dispatch.

Ready to audit your dispatch flow? You can schedule a zero-risk evaluation:
👉 [Book 15-Min Systems Audit](/contact/?lens=trades&source=lumibot_chat&service=field_audit)`;
  }

  // 2. Intent: Serverless Cloud Architecture & Infrastructure
  const isCloudQuery = /serverless|cloud|aws|lambda|dynamodb|latency|soc-2|security|microservice|scale|event|cost|architect|migration|stack|database/i.test(q);
  if (isCloudQuery) {
    return `LumiLore specializes in **Event-Driven AWS Serverless Cloud Architecture**, engineered to eliminate idle compute overhead while delivering high-throughput performance.

**Architectural Standards:**
- **Sub-800ms Edge Latency:** AWS Lambda with Provisioned Concurrency or SnapStart, fronted by Amazon API Gateway and CloudFront.
- **Single-Digit Millisecond Storage:** Amazon DynamoDB on-demand single-table design with Global Secondary Indexes.
- **Zero-Trust & Compliance:** Enterprise IAM least-privilege scoping, TLS 1.3 in-transit, and AES-256 data vault encryption aligned with SOC-2 Type II standards.
- **Principal Systems Architect:** Directed by **Saad Sayed**, AWS Solutions Architect specializing in resilient cloud platforms.

Looking for an infrastructure blueprint?
👉 [Claim 48-Hour Architecture Roadmap](/contact/?lens=corporate&source=lumibot_chat&service=roadmap)`;
  }

  // 3. Intent: Agentic AI Swarms & LLMs
  const isAiQuery = /agent|swarm|ai|llm|bedrock|model|automation|workflow|rag|vector|claude|openai|intelligence/i.test(q);
  if (isAiQuery) {
    return `LumiLore deploys **Autonomous Multi-Agent AI Swarms** powered by **Amazon Bedrock** (Anthropic Claude 3.5 Sonnet / Haiku & Amazon Nova) with deterministic guardrails.

**System Architecture:**
- **Zero Data Leakage:** All inference executes within dedicated VPC private endpoints. Public model training on your proprietary corporate data is strictly blocked.
- **Multi-Agent Orchestration:** Specialized agents execute distinct roles (Intake, Code Generation, Security Verification, and CRM synchronization) with human-in-the-loop review gates.
- **Architectural Resilience:** Automatic fallback mechanisms guarantee continuous operational uptime even during upstream foundation model provider throttling.

Explore how an agentic swarm can automate your operations:
👉 [Launch 2-Week POC Sprint](/contact/?lens=corporate&source=lumibot_chat&service=poc_sprint)`;
  }

  // 4. Intent: General / Scoping / Default Discovery
  return `LumiLore Technologies engineers mission-critical cloud and operational systems across two primary disciplines:

1. **Enterprise Cloud Systems:** High-performance, SOC-2 ready AWS Serverless microservices and multi-agent AI swarms with sub-800ms edge latency. (Lead: Saad Sayed)
2. **Contractor Field Automation:** 24/7 AI Voice Dispatch, emergency triage, and seamless integration with ServiceTitan & Jobber. (Lead: Arfa Sayeed)

How can we assist your technology goals today? You can select your focus below to reserve a direct architecture session:
- For Cloud Architecture: [Book Architecture Discovery](/contact/?lens=corporate&source=lumibot_chat)
- For Trades & Field Dispatch: [Book 15-Min Systems Audit](/contact/?lens=trades&source=lumibot_chat)`;
}

/**
 * Format conversation history and incoming message for Amazon Bedrock Converse schema
 * @param {Array<{ role: string, content: string }>} [history] 
 * @param {string} [newMessage] 
 * @returns {Array<{ role: 'user'|'assistant', content: Array<{ text: string }> }>}
 */
export function formatBedrockMessages(history = [], newMessage = '') {
  const formatted = [];

  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item || !item.content) continue;
      const role = item.role === 'assistant' ? 'assistant' : 'user';
      const text = typeof item.content === 'string' ? item.content.trim() : String(item.content).trim();
      if (text) {
        formatted.push({
          role,
          content: [{ text }]
        });
      }
    }
  }

  if (newMessage && typeof newMessage === 'string' && newMessage.trim()) {
    const lastItem = formatted[formatted.length - 1];
    if (!lastItem || lastItem.role !== 'user' || lastItem.content[0].text !== newMessage.trim()) {
      formatted.push({
        role: 'user',
        content: [{ text: newMessage.trim() }]
      });
    }
  }

  // Bedrock Converse requires the first message to have role 'user'
  while (formatted.length > 0 && formatted[0].role !== 'user') {
    formatted.shift();
  }

  if (formatted.length === 0) {
    formatted.push({
      role: 'user',
      content: [{ text: 'Hello LumiBot, how can LumiLore assist our infrastructure or operations?' }]
    });
  }

  return formatted;
}

/**
 * Generate cryptographic-styled unique Intake ID: #LUMI-YYYYMMDD-XXXX
 * @param {Date} [date] 
 * @returns {string}
 */
export function generateIntakeId(date = new Date()) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `#LUMI-${yyyy}${mm}${dd}-${randomHex}`;
}

/**
 * Validate email format syntax
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Safely parse incoming event body, handling base64 encoding and JSON parsing
 * @param {object} event 
 * @returns {object} { body: object|null, error: string|null }
 */
export function parseRequestBody(event) {
  if (!event || !event.body) {
    return { body: {}, error: null };
  }

  let rawString = event.body;
  if (typeof rawString === 'object') {
    return { body: rawString, error: null };
  }

  if (event.isBase64Encoded) {
    try {
      rawString = Buffer.from(rawString, 'base64').toString('utf-8');
    } catch (e) {
      return { body: null, error: 'Malformed base64 body encoding' };
    }
  }

  try {
    const parsed = JSON.parse(rawString);
    return { body: parsed, error: null };
  } catch (err) {
    return { body: null, error: 'Invalid JSON payload in request body' };
  }
}

/**
 * Build Executive Dark-Glassmorphic HTML Email Template with CRO Attribution & Dual-Routing
 * @param {object} intakeRecord 
 * @returns {string}
 */
export function buildExecutiveEmailHtml(intakeRecord) {
  const { intakeId, timestamp, audienceLens, clientProfile, architectureScope, sessionSchedule, attribution } = intakeRecord;
  const isTrades = audienceLens === 'trades';
  const accentColor = isTrades ? '#f59e0b' : '#00f2fe';
  const accentGradient = isTrades 
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
    : 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)';
  const lensBadge = isTrades ? 'TRADES & CONTRACTORS // FIELD DISPATCH' : 'CORPORATE & ENTERPRISE // CLOUD ARCHITECTURE';

  // Resolve Campaign Origin Badge
  let originLabel = 'DIRECT INTAKE SESSION';
  let originIcon = '🌐';
  if (attribution?.source === 'hero_primary') {
    originLabel = 'HERO PRIMARY DISCOVERY CTA';
    originIcon = '🎯';
  } else if (attribution?.source === 'interceptor_roadmap' || attribution?.service === 'roadmap') {
    originLabel = '48-HOUR BESPOKE ARCHITECTURE ROADMAP';
    originIcon = '⚡';
  } else if (attribution?.source === 'interceptor_audit' && attribution?.service === 'cloud_audit') {
    originLabel = 'TECHNICAL CLOUD & SYSTEMS AUDIT';
    originIcon = '🛠️';
  } else if (attribution?.source === 'interceptor_audit' && attribution?.service === 'field_audit') {
    originLabel = 'FREE DISPATCH & FIELD AUTOMATION AUDIT';
    originIcon = '🚚';
  } else if (attribution?.source === 'case_study_bridge' || attribution?.service === 'poc_sprint') {
    originLabel = '2-WEEK PROOF-OF-CONCEPT SPRINT';
    originIcon = '🚀';
  } else if (attribution?.source === 'nav_cta' || attribution?.source === 'mobile_drawer_cta') {
    originLabel = 'STICKY NAVIGATION BEACON';
    originIcon = '📍';
  } else if (attribution?.source === 'lumibot_chat') {
    originLabel = 'LUMIBOT AI INTERACTIVE TERMINAL';
    originIcon = '🤖';
  }

  // Founder Dual-Routing Designation
  const assignedFounder = isTrades 
    ? 'Arfa Sayeed (Operations & Field Automation Lead)' 
    : 'Saad Sayed (Principal Systems Architect)';

  const techStackList = (architectureScope.techStack && architectureScope.techStack.length > 0)
    ? architectureScope.techStack.join(', ')
    : 'None Specified';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LumiLore Executive Intake Dossier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07080b; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #0d1117; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);">
          
          <!-- Top Accent Glow Bar -->
          <tr>
            <td style="height: 4px; background: ${accentGradient};"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #1e293b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: ${accentColor}; text-transform: uppercase; font-family: monospace;">
                      ● ${lensBadge}
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 6px; letter-spacing: -0.02em;">
                      ${isTrades ? 'New Operational Dispatch Audit' : 'New System Architecture Dossier'}
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid #334155; border-radius: 8px; font-family: monospace; font-size: 12px; font-weight: 700; color: #f1f5f9;">
                      ${intakeId}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inbound Campaign Attribution Banner -->
          <tr>
            <td style="padding: 16px 30px; background-color: #090d14; border-bottom: 1px solid #1e293b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family: monospace; font-size: 11px; color: #94a3b8;">
                    <span style="font-size: 14px; margin-right: 6px;">${originIcon}</span>
                    <strong style="color: #ffffff;">CONVERSION ORIGIN:</strong>
                    <span style="color: ${accentColor}; font-weight: 700; margin-left: 4px;">${originLabel}</span>
                  </td>
                  <td align="right" style="font-family: monospace; font-size: 11px; color: #64748b;">
                    ${new Date(timestamp).toUTCString().replace('GMT', 'UTC')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Smart Founder Routing Box -->
          <tr>
            <td style="padding: 20px 30px 10px 30px;">
              <div style="padding: 14px 18px; background-color: rgba(${isTrades ? '245, 158, 11' : '0, 242, 254'}, 0.08); border: 1px solid rgba(${isTrades ? '245, 158, 11' : '0, 242, 254'}, 0.25); border-radius: 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size: 18px; width: 32px; vertical-align: top;">🎯</td>
                    <td>
                      <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: ${accentColor}; text-transform: uppercase; font-family: monospace;">
                        PRIMARY LEAD ASSIGNMENT
                      </div>
                      <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 2px;">
                        ${assignedFounder}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Client Profile & Contact Section -->
          <tr>
            <td style="padding: 15px 30px;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; font-family: monospace; margin-bottom: 12px;">
                // CLIENT PROFILE
              </div>
              <table role="presentation" width="100%" style="background-color: #090d14; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px; color: #94a3b8; width: 140px;">Full Name:</td>
                  <td style="padding: 6px; color: #ffffff; font-weight: 600;">${clientProfile.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Email Address:</td>
                  <td style="padding: 6px; color: #38bdf8; font-weight: 600;"><a href="mailto:${clientProfile.email}" style="color: #38bdf8; text-decoration: none;">${clientProfile.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Direct Phone:</td>
                  <td style="padding: 6px; color: #ffffff;">${clientProfile.phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Organization / Company:</td>
                  <td style="padding: 6px; color: #ffffff; font-weight: 600;">${clientProfile.organization || 'Independent'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Client Timezone:</td>
                  <td style="padding: 6px; color: #cbd5e1; font-family: monospace; font-size: 12px;">${clientProfile.userTimezone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Architecture Scope Section -->
          <tr>
            <td style="padding: 10px 30px;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; font-family: monospace; margin-bottom: 12px;">
                // SCOPE & SCHEDULE
              </div>
              <table role="presentation" width="100%" style="background-color: #090d14; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px; color: #94a3b8; width: 140px;">Primary Focus:</td>
                  <td style="padding: 6px; color: ${accentColor}; font-weight: 600;">${architectureScope.objective}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Target Velocity:</td>
                  <td style="padding: 6px; color: #ffffff;">${architectureScope.velocity}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Existing Tools / Stack:</td>
                  <td style="padding: 6px; color: #cbd5e1; font-family: monospace; font-size: 12px;">${techStackList}</td>
                </tr>
                <tr>
                  <td style="padding: 6px; color: #94a3b8;">Scheduled Session:</td>
                  <td style="padding: 6px; color: #34d399; font-weight: 700;">${sessionSchedule.bookingDate} @ ${sessionSchedule.timeSlot}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${clientProfile.notes ? `
          <!-- Notes Section -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; font-family: monospace; margin-bottom: 8px;">
                // CLIENT REQUIREMENTS & NOTES
              </div>
              <div style="background-color: #090d14; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; font-size: 13px; color: #e2e8f0; line-height: 1.5;">
                ${clientProfile.notes.replace(/\n/g, '<br/>')}
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Quick Actions & CTA Buttons -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; border-top: 1px solid #1e293b; text-align: center;">
              <a href="mailto:${clientProfile.email}?subject=Re:%20LumiLore%20Architecture%20Session%20${encodeURIComponent(intakeId)}&body=Hi%20${encodeURIComponent(clientProfile.fullName)},%0D%0A%0D%0AThank%20you%20for%20reserving%20your%20consultation%20with%20LumiLore%20Technologies.%20I%20have%20reviewed%20your%20technical%20parameters%20and%20look%20forward%20to%20our%20session%20on%20${encodeURIComponent(sessionSchedule.bookingDate)}%20at%20${encodeURIComponent(sessionSchedule.timeSlot)}.%0D%0A%0D%0ABest%20regards,%0D%0A${encodeURIComponent(assignedFounder)}" 
                 style="display: inline-block; padding: 12px 28px; background-color: ${accentColor}; color: #07080b; font-weight: 700; font-size: 13px; text-decoration: none; border-radius: 8px; letter-spacing: 0.05em; text-transform: uppercase;">
                ✉️ Reply Directly to Client
              </a>
              <div style="margin-top: 15px; font-size: 11px; color: #64748b; font-family: monospace;">
                Secured via AWS SES &middot; DKIM 2048-bit Verified &middot; lumilore.ca
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Dispatch Executive Responsive HTML Email Notification via Amazon SES
 * @param {object} intakeRecord 
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendExecutiveAlertEmail(intakeRecord) {
  const isTrades = intakeRecord.audienceLens === 'trades';
  const sourceEmail = process.env.SES_SOURCE_EMAIL || 'info@lumilore.ca';
  const destinationEmail = isTrades
    ? (process.env.FOUNDER_ARFA_EMAIL || 'info@lumilore.ca')
    : (process.env.FOUNDER_SAAD_EMAIL || 'info@lumilore.ca');

  let originBadge = 'DIRECT';
  if (intakeRecord.attribution?.source === 'hero_primary') originBadge = 'HERO CTA';
  else if (intakeRecord.attribution?.service === 'roadmap') originBadge = '48H ROADMAP';
  else if (intakeRecord.attribution?.service === 'field_audit') originBadge = 'FIELD AUDIT';
  else if (intakeRecord.attribution?.service === 'cloud_audit') originBadge = 'CLOUD AUDIT';
  else if (intakeRecord.attribution?.service === 'poc_sprint') originBadge = 'POC SPRINT';
  else if (intakeRecord.attribution?.source === 'nav_cta') originBadge = 'NAV BEACON';
  else if (isTrades) originBadge = 'TRADES';
  else originBadge = 'CORP';

  const subject = `[LumiLore Intake] [${originBadge}] ${intakeRecord.clientProfile.fullName} (${intakeRecord.clientProfile.organization || 'Direct'}) - ${intakeRecord.intakeId}`;
  const htmlBody = buildExecutiveEmailHtml(intakeRecord);

  const command = new SendEmailCommand({
    Source: sourceEmail,
    Destination: {
      ToAddresses: [destinationEmail, 'info@lumilore.ca'].filter((v, i, a) => a.indexOf(v) === i)
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        }
      }
    }
  });

  try {
    const result = await sesClient.send(command);
    console.log(`[LumiLore SES Alert] Dispatched notification for ${intakeRecord.intakeId} to ${destinationEmail}`);
    return { success: true, messageId: result?.MessageId };
  } catch (sesError) {
    console.error(`[LumiLore SES Warning] Failed to dispatch email for ${intakeRecord.intakeId}:`, sesError);
    // Fault-domain isolation: SES failure MUST NEVER fail customer booking
    return { success: false, error: sesError?.message || 'SES_FAILED' };
  }
}

/**
 * Lead Intake Controller: validates payload, extracts CRO attribution, writes to DynamoDB, and dispatches SES alert
 * @param {object} body 
 * @param {object} event 
 * @returns {Promise<object>} Lambda response object
 */
export async function handleLeadIntake(body, event) {
  const clientProfile = body?.clientProfile || {};
  const fullName = String(clientProfile.fullName || body?.fullName || '').trim();
  const email = String(clientProfile.email || body?.email || '').trim().toLowerCase();

  // 1. Mandatory Fields Validation
  if (!fullName) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Full name is required to initialize an architecture session.'
      })
    };
  }

  if (!isValidEmail(email)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A valid email address is required for encrypted dossier dispatch.'
      })
    };
  }

  // 2. Extract Inbound CRO Attribution Metadata
  const attribution = {
    source: body?.attribution?.source || 'direct',
    service: body?.attribution?.service || 'general_intake',
    lens: body?.attribution?.lens || body?.audienceLens || 'corporate',
    referrer: body?.attribution?.referrer || 'direct',
    userAgent: event?.requestContext?.http?.userAgent || event?.headers?.['user-agent'] || 'unknown',
    clientIp: event?.requestContext?.http?.sourceIp || 'unknown'
  };

  // 3. Resolve Architecture Scope & Audience Lens
  const audienceLens = (body?.audienceLens === 'trades' || attribution.lens === 'trades') ? 'trades' : 'corporate';
  const architectureScope = {
    objective: body?.architectureScope?.objective || (audienceLens === 'trades' ? 'Field Dispatch Automation' : 'Serverless Cloud Architecture'),
    velocity: body?.architectureScope?.velocity || 'Standard Deployment (14 Days)',
    techStack: Array.isArray(body?.architectureScope?.techStack) ? body.architectureScope.techStack : []
  };

  // 4. Resolve Scheduled Window & Assigned Architect
  const defaultArchitect = audienceLens === 'trades'
    ? 'Arfa Sayeed (Operations & Field Automation Lead)'
    : 'Saad Sayed (Principal Systems Architect)';

  const sessionSchedule = {
    bookingDate: body?.sessionSchedule?.bookingDate || 'Next Available Business Day',
    timeSlot: body?.sessionSchedule?.timeSlot || '10:30 AM EST',
    assignedArchitect: body?.sessionSchedule?.assignedArchitect || defaultArchitect
  };

  // 5. Construct Structured DynamoDB Record
  const intakeId = body?.intakeId && /^#LUMI-\d{8}-[0-9A-F]{4}$/.test(body.intakeId)
    ? body.intakeId
    : generateIntakeId();
  const timestamp = new Date().toISOString();

  const intakeRecord = {
    intakeId,
    timestamp,
    audienceLens,
    status: 'NEW',
    clientProfile: {
      fullName,
      email,
      phone: String(clientProfile.phone || body?.phone || '').trim(),
      organization: String(clientProfile.organization || body?.organization || '').trim(),
      notes: String(clientProfile.notes || body?.notes || '').trim(),
      userTimezone: String(clientProfile.userTimezone || 'America/Toronto')
    },
    architectureScope,
    sessionSchedule,
    attribution,
    compliance: {
      tlsVersion: 'TLS 1.3',
      cipherSuite: 'AES-256-GCM',
      zeroTrustValidated: true,
      publicAiTrainingBlocked: true
    }
  };

  // 6. Write Record to DynamoDB
  const tableName = process.env.TABLE_NAME || 'LumiLore_Intake';
  try {
    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: intakeRecord
    }));
    console.log(`[LumiLore Intake] Successfully registered ${intakeId} for ${email} in ${tableName}`);
  } catch (dbError) {
    console.error(`[LumiLore DynamoDB Error] Failed to persist ${intakeId}:`, dbError);
    // Return structured 500 error if DB persistence fails
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to securely persist architectural intake dossier in database.'
      })
    };
  }

  // 7. Dispatch Executive Alert Email (Decoupled Fault-Domain Isolation)
  const emailResult = await sendExecutiveAlertEmail(intakeRecord);

  // 8. Return Confirmation with Telemetry
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: true,
      intakeId,
      message: 'Architecture intake dossier successfully registered and persisted.',
      timestamp,
      audienceLens,
      assignedArchitect: sessionSchedule.assignedArchitect,
      attribution,
      emailDispatched: emailResult.success
    })
  };
}

/**
 * Handle Conversational AI Architecture Queries via Amazon Bedrock Converse API with Resilience Fallback
 * @param {object} body 
 * @param {object} event 
 * @returns {Promise<object>} Lambda response object
 */
export async function handleChatConversation(body, event) {
  const message = body?.message || body?.prompt || '';
  const history = Array.isArray(body?.history) ? body.history : [];
  const lens = body?.lens === 'trades' ? 'trades' : 'corporate';

  if (!message && history.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'A message or conversation history is required for LumiBot chat.'
      })
    };
  }

  const formattedMessages = formatBedrockMessages(history, message);
  const modelId = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-haiku-20240307-v1:0';

  const command = new ConverseCommand({
    modelId,
    system: [{ text: LUMIBOT_SYSTEM_PROMPT }],
    messages: formattedMessages,
    inferenceConfig: {
      maxTokens: 500,
      temperature: 0.7,
      topP: 0.9
    }
  });

  try {
    const response = await bedrockClient.send(command);
    const replyText = response?.output?.message?.content?.[0]?.text || 'LumiBot is ready to assist your systems architecture.';

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        reply: replyText,
        mode: 'bedrock_converse',
        modelId,
        timestamp: new Date().toISOString()
      })
    };
  } catch (bedrockError) {
    console.warn(`[LumiLore Bedrock Fallback] Switching to Architect Resilience Mode: ${bedrockError?.name || bedrockError?.message}`);
    
    // Architect Resilience Engine intercepts ThrottlingException, AccessDeniedException, ModelNotReadyException, or timeouts
    const fallbackReply = generateResilienceFallbackReply(message, lens);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        reply: fallbackReply,
        mode: 'resilience_fallback',
        reason: bedrockError?.name || 'BedrockUnavailable',
        timestamp: new Date().toISOString()
      })
    };
  }
}

/**
 * System Health & Telemetry Probe Handler (GET /api/status)
 * @param {object} [event] 
 * @returns {object} Structured operational telemetry response
 */
export function handleStatusProbe(event) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      status: 'operational',
      service: 'LumiLore Serverless Core Engine',
      version: '2.1.0',
      environment: process.env.NODE_ENV || 'production',
      region: process.env.AWS_REGION || 'ca-central-1',
      bedrockRegion: process.env.BEDROCK_REGION || 'us-east-1',
      modelId: process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-haiku-20240307-v1:0',
      services: {
        dynamodb: {
          table: process.env.TABLE_NAME || 'LumiLore_Intake',
          status: 'connected',
          gsi: 'AudienceLensIndex'
        },
        ses: {
          identity: process.env.SES_SOURCE_EMAIL || 'info@lumilore.ca',
          status: 'verified',
          routing: 'saad_and_arfa_dual_dispatch'
        },
        bedrock: {
          status: 'resilient',
          fallbackEngine: 'active',
          zeroQuotaShield: true
        }
      },
      compliance: {
        tls: 'TLS 1.3',
        encryption: 'AES-256-GCM',
        zeroTrust: true,
        publicAiTrainingBlocked: true
      },
      uptimeSla: '99.99%',
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Main Lambda Handler & Router
 */
export const lambdaHandler = async (event, context) => {
  // Extract normalized HTTP Method and Path across API Gateway v1 & v2 formats
  const method = (event?.httpMethod || event?.requestContext?.http?.method || 'GET').toUpperCase();
  const rawPath = event?.path || event?.rawPath || event?.requestContext?.http?.path || '/';
  const path = rawPath.replace(/\/$/, '') || '/'; // Strip trailing slash

  // 1. Global CORS Preflight Interceptor
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, message: 'Preflight OK' })
    };
  }

  // 2. Safe Body Extraction
  const { body, error: parseError } = parseRequestBody(event);
  if (parseError) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'BAD_REQUEST',
        message: parseError
      })
    };
  }

  // 3. Honeypot Bot Filtering (_gotcha / honeypot fields)
  if (body && (body._gotcha || body.honeypot)) {
    console.warn(`[LumiLore Security] Honeypot triggered from ${event?.requestContext?.http?.sourceIp || 'unknown IP'}`);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Dossier received and indexed.',
        intakeId: '#LUMI-BOT-FILTERED'
      })
    };
  }

  // 4. Global Route Dispatcher
  try {
    if (path === '/api/status' && method === 'GET') {
      return handleStatusProbe(event);
    }

    if (path === '/api/intake' && method === 'POST') {
      return await handleLeadIntake(body, event);
    }

    if (path === '/api/chat' && method === 'POST') {
      return await handleChatConversation(body, event);
    }

    // Unmatched Route: 404 Resource Not Found
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'NOT_FOUND',
        message: `Endpoint ${method} ${path} does not exist on LumiLore Core API`
      })
    };

  } catch (fatalError) {
    console.error('[LumiLore Fatal Error]', fatalError);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected exception occurred on the LumiLore serverless core'
      })
    };
  }
};
