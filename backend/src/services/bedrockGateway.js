/**
 * Centralized Amazon Bedrock Converse Gateway Service
 * Multi-Model Routing, Standard Tool-Use Schemas & FinOps Token Accounting
 * 
 * Target Models:
 * - Fast Execution: us.anthropic.claude-3-haiku-20240307-v1:0
 * - Deep Reasoning: us.anthropic.claude-3-5-sonnet-20241022-v2:0
 */

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

// ============================================================================
// 1. Model Definitions & Canonical Identifiers
// ============================================================================

export const BEDROCK_MODELS = {
  FAST_EXECUTION: 'us.anthropic.claude-3-haiku-20240307-v1:0',
  DEEP_REASONING: 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
  DEFAULT: 'us.anthropic.claude-3-haiku-20240307-v1:0',
  NOVA_LITE: 'ca.amazon.nova-lite-v1:0'
};

/**
 * Resolves a model alias or custom ID to an official Bedrock model ID
 * @param {string} [modelIdOrTier]
 * @returns {string}
 */
export function resolveModelId(modelIdOrTier = '') {
  if (!modelIdOrTier || typeof modelIdOrTier !== 'string') {
    return BEDROCK_MODELS.DEFAULT;
  }
  const clean = modelIdOrTier.trim().toLowerCase();
  if (clean === 'fast' || clean === 'haiku' || clean === 'fast_execution') {
    return BEDROCK_MODELS.FAST_EXECUTION;
  }
  if (clean === 'reasoning' || clean === 'deep' || clean === 'sonnet' || clean === 'deep_reasoning') {
    return BEDROCK_MODELS.DEEP_REASONING;
  }
  if (clean === 'nova' || clean === 'nova-lite' || clean === 'nova_lite') {
    return BEDROCK_MODELS.NOVA_LITE;
  }
  if (modelIdOrTier.includes('anthropic.claude') || modelIdOrTier.includes('amazon.nova')) {
    return modelIdOrTier.trim();
  }
  return BEDROCK_MODELS.DEFAULT;
}

// ============================================================================
// 2. Resilient Client Factory with Region Fallback
// ============================================================================

export const DEFAULT_PRIMARY_REGION = process.env.BEDROCK_REGION || 'us-east-1';
export const DEFAULT_FALLBACK_REGION = 'ca-central-1';

const clientCache = new Map();

/**
 * Returns a cached BedrockRuntimeClient for the requested region
 * @param {object} [options]
 * @param {string} [options.region]
 * @returns {BedrockRuntimeClient}
 */
export function getBedrockClient({ region = DEFAULT_PRIMARY_REGION } = {}) {
  const targetRegion = region || DEFAULT_PRIMARY_REGION;
  if (!clientCache.has(targetRegion)) {
    clientCache.set(
      targetRegion,
      new BedrockRuntimeClient({
        region: targetRegion,
        maxAttempts: 3
      })
    );
  }
  return clientCache.get(targetRegion);
}

// Default client instance for quick imports
export const bedrockClient = getBedrockClient({ region: DEFAULT_PRIMARY_REGION });

// ============================================================================
// 3. Autonomous Booking Tool Schemas (Bedrock Converse toolConfig)
// ============================================================================

export const CHECK_AVAILABILITY_TOOL = {
  toolSpec: {
    name: 'checkAvailability',
    description: 'Checks real-time available consultation time slots on Google Calendar within a given date range.',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD or ISO 8601 format (e.g. 2026-10-22).'
          },
          endDate: {
            type: 'string',
            description: 'End date in YYYY-MM-DD or ISO 8601 format (e.g. 2026-10-23).'
          },
          lens: {
            type: 'string',
            enum: ['corporate', 'trades'],
            description: 'Audience lens: "corporate" for enterprise cloud architecture (45-min slots) or "trades" for contractor dispatch audit (30-min slots).'
          }
        },
        required: ['startDate', 'endDate']
      }
    }
  }
};

export const BOOK_CONSULTATION_TOOL = {
  toolSpec: {
    name: 'bookConsultation',
    description: 'Autonomously books a confirmed consultation session, creates Google Meet conference, and dispatches calendar invitations.',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Prospect or client full name.'
          },
          email: {
            type: 'string',
            description: 'Prospect or client valid email address for receiving Google Meet coordinates and calendar invite.'
          },
          dateTime: {
            type: 'string',
            description: 'Target date and time in YYYY-MM-DD HH:mm or ISO 8601 format (e.g. 2026-10-22 14:00 or 2026-10-22T14:00:00Z).'
          },
          serviceInterest: {
            type: 'string',
            description: 'Primary architecture or service interest (e.g. "Cloud Modernization", "AI Voice Dispatch", "GEO Optimization").'
          },
          phone: {
            type: 'string',
            description: 'Prospect contact phone number (optional).'
          },
          organization: {
            type: 'string',
            description: 'Company or organization name (optional).'
          },
          notes: {
            type: 'string',
            description: 'Specific architectural goals, current cloud bottlenecks, or trade requirements (optional).'
          },
          lens: {
            type: 'string',
            enum: ['corporate', 'trades'],
            description: 'Audience lens (optional, defaults to corporate).'
          }
        },
        required: ['name', 'email', 'dateTime', 'serviceInterest']
      }
    }
  }
};

// Legacy tool schema aliases for backward compatibility
export const LEGACY_CHECK_CALENDAR_TOOL = {
  toolSpec: {
    name: 'check_calendar_availability',
    description: 'Legacy alias: Checks real-time available consultation time slots on Saad Sayed\'s Google Calendar for a target date and audience lens.',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Target date in YYYY-MM-DD format (e.g. 2026-10-22).'
          },
          lens: {
            type: 'string',
            enum: ['corporate', 'trades'],
            description: 'Audience lens.'
          }
        },
        required: ['date']
      }
    }
  }
};

export const LEGACY_BOOK_CALENDAR_TOOL = {
  toolSpec: {
    name: 'book_calendar_session',
    description: 'Legacy alias: Autonomously books a confirmed consultation session on Saad Sayed\'s Google Calendar.',
    inputSchema: {
      json: {
        type: 'object',
        properties: {
          fullName: { type: 'string', description: 'Client\'s full name.' },
          email: { type: 'string', description: 'Client\'s valid email address.' },
          phone: { type: 'string', description: 'Client\'s phone number (optional).' },
          organization: { type: 'string', description: 'Company or organization name (optional).' },
          date: { type: 'string', description: 'Session date in YYYY-MM-DD format.' },
          timeSlot: { type: 'string', description: 'The selected time slot (e.g. "2:00 PM – 2:45 PM EDT").' },
          slotStart: { type: 'string', description: 'ISO 8601 start timestamp (optional).' },
          slotEnd: { type: 'string', description: 'ISO 8601 end timestamp (optional).' },
          lens: { type: 'string', enum: ['corporate', 'trades'], description: 'Audience lens.' },
          notes: { type: 'string', description: 'Client requirements or notes.' }
        },
        required: ['fullName', 'email', 'date', 'timeSlot']
      }
    }
  }
};

export const AUTONOMOUS_BOOKING_TOOLS = [
  CHECK_AVAILABILITY_TOOL,
  BOOK_CONSULTATION_TOOL,
  LEGACY_CHECK_CALENDAR_TOOL,
  LEGACY_BOOK_CALENDAR_TOOL
];

export const DEFAULT_TOOL_CONFIG = {
  tools: AUTONOMOUS_BOOKING_TOOLS
};

// ============================================================================
// 4. FinOps Token Sanitization & Cost Estimator
// ============================================================================

/**
 * Sanitizes and compresses input text to optimize token usage prior to sending to Bedrock
 * - Strips redundant whitespace and tabs
 * - Collapses 3+ consecutive newlines to 2
 * - Strips unprintable control characters while preserving valid code and punctuation
 * @param {string} text
 * @returns {string}
 */
export function sanitizeAndCompressText(text = '') {
  if (typeof text !== 'string') return '';
  return text
    // Replace non-printable ASCII characters (preserve newline \n and tab \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize Windows carriage returns
    .replace(/\r\n/g, '\n')
    // Strip leading and trailing whitespace on each line
    .replace(/^[ \t]+/gm, '')
    .replace(/[ \t]+$/gm, '')
    // Collapse consecutive spaces and tabs on a line
    .replace(/[ \t]+/g, ' ')
    // Collapse 3 or more newlines into double newline
    .replace(/\n{3,}/g, '\n\n')
    // Trim leading and trailing whitespace
    .trim();
}

/**
 * Traverses Bedrock message structure and compresses text blocks
 * @param {Array<object>} messages
 * @returns {Array<object>}
 */
export function compressMessagePayload(messages = []) {
  if (!Array.isArray(messages)) return [];

  return messages.map(msg => {
    if (!msg || typeof msg !== 'object') return msg;

    if (Array.isArray(msg.content)) {
      const compressedContent = msg.content.map(block => {
        if (!block || typeof block !== 'object') return block;

        if (typeof block.text === 'string') {
          return {
            ...block,
            text: sanitizeAndCompressText(block.text)
          };
        }
        return block;
      });

      return {
        ...msg,
        content: compressedContent
      };
    }

    return msg;
  });
}

/**
 * FinOps Pricing Matrix (USD per 1,000 tokens)
 */
export const FINOPS_PRICING = {
  [BEDROCK_MODELS.FAST_EXECUTION]: {
    inputPer1k: 0.00025,   // $0.25 per 1M tokens
    outputPer1k: 0.00125  // $1.25 per 1M tokens
  },
  [BEDROCK_MODELS.DEEP_REASONING]: {
    inputPer1k: 0.00300,   // $3.00 per 1M tokens
    outputPer1k: 0.01500  // $15.00 per 1M tokens
  },
  [BEDROCK_MODELS.NOVA_LITE]: {
    inputPer1k: 0.00006,   // $0.06 per 1M tokens
    outputPer1k: 0.00024  // $0.24 per 1M tokens
  }
};

export const USD_TO_CAD_RATE = 1.38;

/**
 * Calculates estimated FinOps cost for token consumption
 * @param {object} params
 * @param {string} params.modelId
 * @param {number} params.inputTokens
 * @param {number} params.outputTokens
 * @returns {object}
 */
export function calculateFinOpsCost({ modelId = BEDROCK_MODELS.DEFAULT, inputTokens = 0, outputTokens = 0 }) {
  const resolved = resolveModelId(modelId);
  const pricing = FINOPS_PRICING[resolved] || FINOPS_PRICING[BEDROCK_MODELS.DEFAULT];

  const inTokens = Math.max(0, Number(inputTokens) || 0);
  const outTokens = Math.max(0, Number(outputTokens) || 0);
  const totalTokens = inTokens + outTokens;

  const inputCostUsd = (inTokens / 1000) * pricing.inputPer1k;
  const outputCostUsd = (outTokens / 1000) * pricing.outputPer1k;
  const totalCostUsd = inputCostUsd + outputCostUsd;
  const totalCostCad = totalCostUsd * USD_TO_CAD_RATE;

  return {
    modelId: resolved,
    inputTokens: inTokens,
    outputTokens: outTokens,
    totalTokens,
    inputCostUsd,
    outputCostUsd,
    totalCostUsd,
    totalCostCad
  };
}

// ============================================================================
// 5. Multi-Turn Session Sanitizer & Alternating Role Validator
// ============================================================================

/**
 * Validates and normalizes multi-turn conversations for Bedrock Converse schema
 * - Enforces strict alternating role sequence: user <-> assistant
 * - Coalesces consecutive messages with identical roles
 * - Ensures conversation begins with a 'user' message
 * - Strips empty messages and sanitizes whitespace
 * 
 * @param {Array<object>} [history]
 * @param {string|object} [newMessage]
 * @returns {Array<{ role: 'user'|'assistant', content: Array<object> }>}
 */
export function normalizeBedrockConversation(history = [], newMessage = null) {
  const rawList = [];

  // 1. Ingest history items
  if (Array.isArray(history)) {
    for (const item of history) {
      if (!item) continue;
      const role = item.role === 'assistant' ? 'assistant' : 'user';

      if (Array.isArray(item.content)) {
        rawList.push({ role, content: item.content });
      } else if (typeof item.content === 'string') {
        const text = sanitizeAndCompressText(item.content);
        if (text) {
          rawList.push({ role, content: [{ text }] });
        }
      } else if (item.text && typeof item.text === 'string') {
        const text = sanitizeAndCompressText(item.text);
        if (text) {
          rawList.push({ role, content: [{ text }] });
        }
      }
    }
  }

  // 2. Ingest newMessage if provided
  if (newMessage) {
    if (typeof newMessage === 'string') {
      const text = sanitizeAndCompressText(newMessage);
      if (text) {
        rawList.push({ role: 'user', content: [{ text }] });
      }
    } else if (typeof newMessage === 'object') {
      const role = newMessage.role === 'assistant' ? 'assistant' : 'user';
      if (Array.isArray(newMessage.content)) {
        rawList.push({ role, content: newMessage.content });
      } else if (typeof newMessage.text === 'string') {
        const text = sanitizeAndCompressText(newMessage.text);
        if (text) {
          rawList.push({ role, content: [{ text }] });
        }
      }
    }
  }

  if (rawList.length === 0) {
    return [];
  }

  // 3. Bedrock Converse Requirement: Conversation MUST start with a 'user' turn
  let startIndex = 0;
  while (startIndex < rawList.length && rawList[startIndex].role !== 'user') {
    startIndex++;
  }

  if (startIndex >= rawList.length) {
    // If only assistant messages were provided, prepend a fallback user turn
    rawList.unshift({
      role: 'user',
      content: [{ text: 'Hello, please assist me.' }]
    });
    startIndex = 0;
  }

  const validSlice = rawList.slice(startIndex);

  // 4. Strict Alternating Role Coalescence
  const alternating = [];

  for (const turn of validSlice) {
    if (!turn.content || turn.content.length === 0) continue;

    if (alternating.length === 0) {
      alternating.push({ role: turn.role, content: [...turn.content] });
      continue;
    }

    const lastTurn = alternating[alternating.length - 1];

    if (lastTurn.role === turn.role) {
      // Coalesce consecutive turns of same role
      for (const block of turn.content) {
        if (block.text && lastTurn.content.length > 0 && lastTurn.content[lastTurn.content.length - 1].text) {
          // Merge text blocks with newline
          lastTurn.content[lastTurn.content.length - 1].text += `\n\n${block.text}`;
        } else {
          lastTurn.content.push(block);
        }
      }
    } else {
      alternating.push({ role: turn.role, content: [...turn.content] });
    }
  }

  return alternating;
}

// ============================================================================
// 6. Tool Result Formatting Utilities
// ============================================================================

/**
 * Formats a tool execution output into a standard Bedrock toolResult block
 * @param {object} params
 * @param {string} params.toolUseId
 * @param {object} params.output
 * @param {'success'|'error'} [params.status='success']
 * @returns {object}
 */
export function formatToolResult({ toolUseId, output = {}, status = 'success' }) {
  return {
    toolResult: {
      toolUseId,
      content: [{ json: output }],
      status: status === 'error' ? 'error' : 'success'
    }
  };
}

/**
 * Assembles follow-up message turns for Bedrock after tool execution
 * @param {object} params
 * @param {Array<object>} params.messages
 * @param {object} params.assistantMessage
 * @param {Array<object>} params.toolResults
 * @returns {Array<object>}
 */
export function buildFollowUpToolMessages({ messages = [], assistantMessage, toolResults = [] }) {
  return [
    ...messages,
    assistantMessage,
    {
      role: 'user',
      content: toolResults
    }
  ];
}

// ============================================================================
// 7. Core Export: invokeConverse Gateway
// ============================================================================

/**
 * Centralized invocation gateway for Amazon Bedrock Converse API
 * Handles input sanitization, multi-model selection, FinOps tracking, and region fallback
 * 
 * @param {object} params
 * @param {Array<object>} params.messages - Multi-turn conversation messages
 * @param {string} [params.systemPrompt] - System instructions
 * @param {string} [params.modelId] - Target Bedrock model ID or tier ('fast' | 'reasoning')
 * @param {Array<object>} [params.tools] - Optional tools array (overrides default booking tools)
 * @param {object} [params.toolConfig] - Complete Bedrock toolConfig specification
 * @param {object} [params.inferenceConfig] - Model inference hyperparams (maxTokens, temperature)
 * @param {BedrockRuntimeClient} [params.client] - Custom client instance (for testing or multi-account)
 * @param {string} [params.region] - AWS region override
 * @returns {Promise<object>} Normalized result payload
 */
export async function invokeConverse({
  messages = [],
  systemPrompt = '',
  modelId = BEDROCK_MODELS.DEFAULT,
  tools = null,
  toolConfig = null,
  inferenceConfig = null,
  client = null,
  region = DEFAULT_PRIMARY_REGION
}) {
  const resolvedModelId = resolveModelId(modelId);
  const targetModelId = (region === 'ca-central-1') ? resolvedModelId.replace(/^us\./, '') : resolvedModelId;
  const runtimeClient = client || getBedrockClient({ region });

  // 1. Sanitize & Normalize Messages
  const normalizedMessages = normalizeBedrockConversation(messages);
  const compressedMessages = compressMessagePayload(normalizedMessages);

  if (compressedMessages.length === 0) {
    throw new Error('[BedrockGateway] At least one valid user message is required.');
  }

  // 2. Prepare System Prompt
  let system = undefined;
  if (systemPrompt && typeof systemPrompt === 'string') {
    const cleanSystem = sanitizeAndCompressText(systemPrompt);
    if (cleanSystem) {
      system = [{ text: cleanSystem }];
    }
  } else if (Array.isArray(systemPrompt)) {
    system = systemPrompt;
  }

  // 3. Prepare Inference Config
  const resolvedInferenceConfig = {
    maxTokens: inferenceConfig?.maxTokens || 800,
    temperature: inferenceConfig?.temperature !== undefined ? inferenceConfig.temperature : 0.7,
    topP: inferenceConfig?.topP !== undefined ? inferenceConfig.topP : 0.9
  };

  // 4. Prepare Tool Config
  let resolvedToolConfig = undefined;
  if (toolConfig && typeof toolConfig === 'object') {
    resolvedToolConfig = toolConfig;
  } else if (Array.isArray(tools)) {
    resolvedToolConfig = { tools };
  }

  // 5. Build Converse Command
  const commandInput = {
    modelId: targetModelId,
    messages: compressedMessages,
    inferenceConfig: resolvedInferenceConfig
  };

  if (system) {
    commandInput.system = system;
  }
  if (resolvedToolConfig) {
    commandInput.toolConfig = resolvedToolConfig;
  }

  const command = new ConverseCommand(commandInput);

  let response;
  try {
    response = await runtimeClient.send(command);
  } catch (primaryErr) {
    // If region connection fault, access denied, or unsupported model ID, attempt fallback region
    if (
      region !== DEFAULT_FALLBACK_REGION &&
      (primaryErr?.name === 'EndpointConnectionError' ||
       primaryErr?.message?.includes('ENOTFOUND') ||
       primaryErr?.code === 'NetworkingError' ||
       primaryErr?.name === 'AccessDeniedException' ||
       primaryErr?.name === 'ValidationException' ||
       primaryErr?.name === 'ResourceNotFoundException')
    ) {
      console.warn(`[BedrockGateway] Primary region ${region} (${resolvedModelId}) failed with ${primaryErr.name}: ${primaryErr.message}. Attempting fallback to ${DEFAULT_FALLBACK_REGION}...`);
      const fallbackModelId = (DEFAULT_FALLBACK_REGION === 'ca-central-1')
        ? resolvedModelId.replace(/^us\./, '')
        : (resolvedModelId.startsWith('anthropic.') ? `us.${resolvedModelId}` : resolvedModelId);
      const fallbackCommandInput = {
        ...commandInput,
        modelId: fallbackModelId
      };
      const fallbackCommand = new ConverseCommand(fallbackCommandInput);
      const fallbackClient = getBedrockClient({ region: DEFAULT_FALLBACK_REGION });
      response = await fallbackClient.send(fallbackCommand);
    } else {
      throw primaryErr;
    }
  }

  // 6. Extract Output & FinOps Accounting
  const outputMessage = response?.output?.message || { role: 'assistant', content: [] };
  const contentBlocks = outputMessage.content || [];
  
  let replyText = '';
  const firstTextBlock = contentBlocks.find(b => typeof b.text === 'string');
  if (firstTextBlock) {
    replyText = firstTextBlock.text;
  }

  const toolUseBlocks = contentBlocks.filter(b => b.toolUse);
  const stopReason = response?.stopReason || 'end_turn';

  const usage = {
    inputTokens: response?.usage?.inputTokens || 0,
    outputTokens: response?.usage?.outputTokens || 0,
    totalTokens: response?.usage?.totalTokens || ((response?.usage?.inputTokens || 0) + (response?.usage?.outputTokens || 0))
  };

  const finOpsCost = calculateFinOpsCost({
    modelId: resolvedModelId,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens
  });

  // Log structured FinOps telemetry
  console.log(
    `[LumiLore FinOps] Model: ${resolvedModelId} | In: ${usage.inputTokens} | Out: ${usage.outputTokens} | Cost: $${finOpsCost.totalCostUsd.toFixed(6)} USD ($${finOpsCost.totalCostCad.toFixed(6)} CAD)`
  );

  return {
    success: true,
    outputMessage,
    replyText,
    stopReason,
    toolUseBlocks,
    toolCallsExecuted: toolUseBlocks.map(b => b.toolUse.name),
    usage,
    finOpsCost,
    modelId: resolvedModelId,
    rawResponse: response
  };
}
