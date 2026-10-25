# LumiLore GEO Scanner 🌐🔍

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://www.lumilore.ca)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by LumiLore](https://img.shields.io/badge/Powered%20By-LumiLore%20Technologies-00f2fe.svg)](https://www.lumilore.ca)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> **Generative Engine Optimization (GEO) Scanner & AI Answer Engine Inspector.**  
> Built and maintained by [LumiLore Technologies](https://www.lumilore.ca) — Autonomous Agentic AI & Cloud Architecture.

---

## ⚡ What is Generative Engine Optimization (GEO)?

As search traffic shifts from traditional Google blue links to conversational AI answer engines (**ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews**), websites must be accessible to LLM crawlers and provide rich structured data graphs.

`lumilore-geo-scanner` is an ultra-fast, zero-dependency CLI tool that evaluates any web URL for:
1. **AI Crawler Permissions:** Inspects `robots.txt` for `GPTBot`, `ClaudeBot`, and `PerplexityBot`.
2. **Entity Graph Depth:** Scans for Schema.org JSON-LD structured data (`TechArticle`, `FAQPage`, `Organization`).
3. **TTFB Latency:** Verifies sub-second edge response times required for LLM citation selection.
4. **Overall GEO Readiness Score (0–100):** Provides a standardized audit grade.

---

## 🚀 Quick Start

Run instantly with `npx` (no installation required):

```bash
npx lumilore-geo-scanner https://www.lumilore.ca
```

Or install globally:

```bash
npm install -g lumilore-geo-scanner
geo-scanner https://yourdomain.com
```

---

## 📊 Sample Output

```text
========================================================
  LumiLore GEO Scanner (AI Search Readiness CLI)
========================================================
Powered by LumiLore Technologies — https://www.lumilore.ca

🔍 Scanning https://www.lumilore.ca for Generative Engine Optimization (GEO)...

GEO READINESS SCORECARD:
--------------------------------------------------------
Target:               https://www.lumilore.ca
Overall GEO Score:    100/100 (A+ (Optimal))
TTFB Latency:         118ms
--------------------------------------------------------
LLM Crawler Accessibility:
  • GPTBot (OpenAI):        ✅ Permitted
  • ClaudeBot (Anthropic):  ✅ Permitted
  • PerplexityBot:          ✅ Permitted
--------------------------------------------------------
Structured Data & Entity Graph:
  • JSON-LD Present:        ✅ Yes
  • Schema Types Detected:  Organization, TechArticle, FAQPage
--------------------------------------------------------
Need an enterprise AI audit? Visit https://www.lumilore.ca/contact/
```

---

## 🛠️ Programmatic Usage (Node.js SDK)

```javascript
import { scanUrl } from 'lumilore-geo-scanner';

const results = await scanUrl('https://example.com');
console.log(`GEO Score: ${results.score}/100`);
console.log(`Crawlers Permitted:`, results.crawlers);
```

---

## 👨‍💻 Author & Enterprise Services

This open-source engine is developed by **[Saad Hussain Sayed](https://www.linkedin.com/in/saadhussainsayed)**, Principal Cloud & AI Architect at **[LumiLore Technologies](https://www.lumilore.ca)**.

Organizations looking for full-scale Generative Engine Optimization (GEO), 24/7 AI Voice Dispatch, or Serverless Modernization can schedule a strategy session at **[lumilore.ca/contact](https://www.lumilore.ca/contact/)**.

---

## 📄 License

MIT License © 2026 [LumiLore Technologies](https://www.lumilore.ca).
