# LumiLore Master Roadmap & Multi-Sprint Tracker

## 📌 Active System State
- **Primary Domain:** https://www.lumilore.ca (AWS Amplify Job 32 active)
- **Backend Stack:** AWS SAM (`lumilore-backend` in ca-central-1)
- **Active Endpoints:** `/api/intake`, `/api/chat`, `/api/calendar/availability`, `/api/audit`
- **DNS & Mail:** DKIM 2048-bit active, SES info@lumilore.ca verified

---

## 🚀 The 4 Active Sprints

### Sprint 1: Legal Shield & Global Footer (COMPLETED — 100%)
- [x] Create 4-column Footer component (Services, Company, Resources, Legal) based on AIRE reference.
- [x] Add Terms & Conditions page (`frontend/terms.html`) with liability limits & AI disclaimers.
- [x] Add Privacy Policy page (`frontend/privacy.html`) with PIPEDA/GDPR compliance.
- [x] Add lightweight Cookie Consent banner saving preferences to localStorage.

### Sprint 2: Agentic AI Agency Services Catalog & Positioning (COMPLETED — 100%)
- [x] Package Service 1: Autonomous Calendar & Booking Agent (Client Product).
- [x] Package Service 2: 24/7 AI Voice Dispatch & Inbound Receptionist.
- [x] Package Service 3: GEO & AI Answer Engine Optimization.
- [x] Package Service 4: High-Conversion Website Redevelopment & Speed Optimization.
- [x] Update Navigation dropdowns and Homepage cards to reflect these 4 pillars.

### Sprint 3: Contact & Intake Page Overhaul (COMPLETED — 100%)
- [x] **Micro-Step 1.1:** Modernize Step 01 Architecture Objective Cards in `frontend/contact.html` (4 flagship services + custom enterprise suite).
- [x] **Micro-Step 1.2:** Dual-Lens Content Dictionary Expansion for Contact Page (`contactLensData` sync for Corporate & Trades).
- [x] **Micro-Step 2.1:** Implement Query Parameter Ingestion (`?service=...`, `?tier=...`, `?lens=...`).
- [x] **Micro-Step 2.2:** Contextual Inbound Scoping Banner above Step 01 (`#service-scoping-banner` with smooth scrolling quick change button).
- [x] **Micro-Step 2.3:** Cross-Pillar CTA Link Alignment across product pages (100% canonical slugs, tiers, and lenses).
- [x] **Micro-Step 3.1:** Form Telemetry Payload Calibration (`attribution.service`, `architectureScope.objective`, `attribution.lens`).
- [x] **Micro-Step 3.2:** Backend Handler Verification & Safe Extension in `backend/src/app.js` (DynamoDB schema, attribution preservation & SES email origin badges/titles).
- [x] **Micro-Step 4.1:** Production Build & Link Audit (10/10 layout health pass, 803 links audited, 0 broken links, 100% sitemap resolution).
- [x] **Micro-Step 4.2:** End-to-End Contact Intake Flow Smoke Test (82/82 assertions passed across all 6 scenarios).

### Sprint 4: UI/UX Bug Sweep & Mobile Polish (COMPLETED — 100%)
- [x] **Micro-Step 5.1:** Small Mobile Viewport Audit (320px–375px: overflow-x hidden, Space Grotesk h1 text-3xl/5xl scaling, 3D orbit carousel 235px cap & 1-column bento fallback).
- [x] **Micro-Step 5.2:** Tablet & Medium Screen Audit (768px–1024px: lg: navigation transition breakpoint, tablet quick CTA button, grid-cols-1 lg:grid-cols-3 pricing cards, md:grid-cols-2 architecture matrices, 2-column footer layout).
- [x] **Micro-Step 6.1:** Touch Target Compliance (48x48px WCAG compliance on mobile hamburger, lens pills, mobile nav items, footer links, cookie banner triggers).
- [x] **Micro-Step 6.2:** Color Contrast & Glassmorphic Readability Audit (WCAG AA 4.5:1 ratio on muted text, placeholder contrast, and focus-visible outlines).
- [x] **Micro-Step 7.1:** Client Script & Console Error Sweep across all routes (asset 404 audit, WebGL context loss recovery, and unhandledrejection guard).
- [x] **Micro-Step 7.2:** Swiper, Three.js & GSAP Lifecycle Guardrails (conditional lazy loader, script deferral, ScrollTrigger teardown, and element guards).
- [x] **Micro-Step 8.1:** Final Production Build & Optimization (Tailwind v4 minification, Eleventy 14 files / 28 assets in 0.11s).
- [x] **Micro-Step 8.2:** Comprehensive End-to-End Regression Sweep (10/10 test suites passed, 615+ automated assertions, zero regressions).
- [x] **Micro-Step 8.3:** UI Bug Fix & Universal Visual System Deployment:
  - Fixed raw plain-text JavaScript leak at page bottom by encapsulating Card Flip script inside `<script>` tag in `frontend/_includes/layout.html`.
  - Created modular `frontend/_includes/components/particle-field.html` deploying a Universal Ambient Three.js Particle Field across all 12 inner routes (subtle cyan/indigo wave drift + mouse parallax) while preserving full 4-stage GSAP scroll-morphing on the homepage.
  - Workspace cleanup & token optimization: deleted 20 dead/unused files (including 13.74MB root video and one-off scratch scripts) and streamlined `scratch/run_full_regression_suite.js`.
  - Project Memory & Roadmap Finalization: Sprints 1, 2, 3 & 4 certified 100% complete and production-verified. **SPRINT 4 IS 100% COMPLETE.**

---

## 🌐 Sprint 5: Domain Authority (DA) & Backlink Growth Engine (READY TO LAUNCH)

- [x] **Clutch.co & GoodFirms Agency Profiles:** Claimed and submitted verified profiles for LumiLore Technologies under AI Development, Cloud Consulting, and Web Modernization (DA 90 & DA 86 backlinks queued).
- [x] **Crunchbase Profile:** Established verified corporate profile (https://www.crunchbase.com/organization/lumilore-technologies) linking to https://www.lumilore.ca with founder Saad Hussain Sayed (DA 91 backlink live).
- [x] **Google Business Profile (GBP):** Created and submitted official Google Business Profile for LumiLore Technologies (Service Areas: GTA / Ontario, Phone: 437-848-7086, URL: https://www.lumilore.ca) — verification actively processing.
- [ ] **Canadian Business & Regional Registries:** Add verified listings on YellowPages Canada, Canadian Chamber of Commerce, and BBB Ontario for local/national NAP consistency.
- [ ] **Wellfound (AngelList) & Product Hunt:** Create company hub and prepare Product Hunt launch for LumiBot / Instant GEO Audit Magnet.

- [x] **AlternativeTo.net Listing:** Created & submitted profile at https://alternativeto.net/software/lumilore/ positioned against Ruby Virtual Receptionists, Smith.ai, and Intercom (DA 81 backlink queued).
- [ ] **There's An AI For That (TAAFT) & Futurepedia.io:** Monitor free inclusion paths for LumiLore GEO Audit & Voice Receptionist.

### Pillar 3: Technical Cloud Authority & Open-Source Footprint (High Dofollow Relevance)
- [x] **Dev.to Technical Case Study Syndication (DA 90):** Published live at Dev.to ("Cutting AWS Cloud Waste by 68%: An Enterprise Serverless Architecture Case Study") with verified canonical link to https://www.lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/ (live dofollow backlink).
- [ ] **GitHub Organization Hub:** Create public repository showcasing open-source micro-tools (e.g. `lumilore-geo-scanner` or schema validator) with prominent badges linking back to lumilore.ca.
- [ ] **Hashnode & Substack Tech Publication:** Establish an engineering publication cross-posting architectural blueprints and GEO benchmark insights.

### Pillar 4: Niche Industry & Mechanical Trades Authority (High Intent B2B)
- [ ] **HVAC & Mechanical Trade Publications:** Pitch guest commentary and case study data on 24/7 AI Voice Dispatch to Canadian plumbing/HVAC magazines (e.g., HPAC Magazine, Mechanical Business).
- [ ] **Ontario & Canadian Small Business Blogs:** Feature success stories on how Ontario service businesses eliminate after-hours missed calls using serverless AI agents.
- [ ] **HARO / Connectively / Featured.com:** Actively monitor journalist queries for "AI in small business", "Cloud cost reduction", and "Search engines shifting to AI" to capture high-authority editorial press mentions.

### Pillar 5: Citation Velocity & Search Graph Monitoring
- [x] **Google Search Console (GSC) & Verification:** Connected and deployed for https://www.lumilore.ca with verified token (`S590ENsUVNg5tL3iKx2ZlWETQ_q_sn7Tb5zYscYaksA`) and `/sitemap.xml` indexing.
- [ ] **Track target DA metrics:** Milestone 1: DA 15+ (Month 1-2) -> Milestone 2: DA 30+ (Month 3-6).
- [ ] **Monitor LLM Perplexity / ChatGPT citation graph references:** Verify brand attribution as "Top Canadian Agentic AI Agency".

---

## 📢 Sprint 6: Autonomous Marketing & Omnichannel Distribution Agent (`agents/marketing-agent/`) (SCHEDULED AFTER SPRINT 5)

### 6.1: Marketing Agent Architecture & Configuration Engine
- [ ] Initialize `agents/marketing-agent/` directory structure and package setup.
- [ ] Create `agents/marketing-agent/config.js` defining Saad Sayed persona, editorial voice, target B2B buyer hooks, and API credentials.
- [ ] Create unified CLI orchestrator: `agents/marketing-agent/run.js` (`--all`, `--linkedin`, `--twitter`, `--syndicate`, `--dry-run`).

### 6.2: LinkedIn Thought Leadership & Story Engine
- [ ] Build `agents/marketing-agent/linkedin-generator.js` extracting empirical metrics from `/insights/` and generating 3 weekly high-engagement B2B posts targeting CTOs and trade business owners.
- [ ] Include automated hooks, architectural proof points, and direct links to `/products/` and `/contact/`.

### 6.3: Twitter/X Viral Technical Breakdown Threader
- [ ] Build `agents/marketing-agent/twitter-threader.js` converting serverless AWS blueprints, TTFB speed proofs, and Mermaid diagrams into 8-tweet viral engineering threads.

### 6.4: Active Community Interceptor (Reddit Radar via `Agent-Reach`)
- [ ] Build `agents/marketing-agent/community-radar.js` powered by `Agent-Reach` to monitor `r/aws`, `r/smallbusiness`, `r/HVAC`, and local business forums for active buyer questions.
- [ ] Auto-draft expert engineering responses citing LumiLore case studies.

### 6.5: High-DA Multi-Platform Syndication Publisher (Dev.to & Medium)
- [ ] Build `agents/marketing-agent/syndication-publisher.js` to automatically format `/insights/` articles with `canonical_url` headers.
- [ ] Auto-publish to Dev.to (DA 90) and Medium (DA 95) via API to generate instant high-DA backlinks and organic referral traffic.

---

## ⚡ Sprint 7: Website Conversion Magnets & Interactive Studios (ON-SITE UPGRADES)

### 7.1: Dual-Lens ROI Calculator Upgrade & Inbound Linkage
- [ ] Pass dynamic ROI calculations (`?calc_revenue=...`, `?ticket=...`, `?calls=...`) from the Homepage Sticky ROI Bar directly into the `/contact/` URL query parameters.
- [ ] Update `/contact/` Scoping Banner to greet prospects with their exact calculated revenue recovery figure: *"Scoping Strategy Session to recover your estimated $295,750/yr in missed revenue."*
- [ ] Add direct ROI Calculator anchor/embed to [`frontend/products/voice-dispatch.html`](file:///c:/Users/saadh%20Documents/Cloud/LumiLore/frontend/products/voice-dispatch.html).

### 7.2: Live In-Browser "Talk to the AI Dispatcher" Voice Sandbox
- [ ] Build interactive WebRTC microphone test studio on `/products/voice-dispatch/` (powered by Amazon Connect / WebRTC / VoiceStudio architecture).
- [ ] Enable visitors to talk live to the voice receptionist, experience sub-800ms latency, and receive a simulated dispatch confirmation SMS.
- [ ] Add optional 1-800 live test number badge for instant telephone verification.

### 7.3: Real-Time Competitor & Answer Engine Scan Engine
- [ ] Upgrade the Homepage "Instant AI Audit Magnet" bar with live `every-app/open-seo` / DataForSEO API connectivity.
- [ ] Output real Google keyword rankings, domain authority metrics, and live ChatGPT / Perplexity / Claude brand citation status.
- [ ] Highlight missing local buyer keywords with 1-click CTA to book a strategic audit with Saad Sayed.

### 7.4: Interactive Split-Screen Speed Simulator
- [ ] Add draggable before/after comparison slider to [`frontend/products/web-modernization.html`](file:///c:/Users/saadh%20Documents/Cloud/LumiLore/frontend/products/web-modernization.html).
- [ ] Visual demonstration comparing a sluggish 3.8s bloated WordPress/Wix site vs LumiLore's 120ms serverless Jamstack architecture.

### 7.5: Live "Agent Operations Command Center" Demo Dashboard
- [ ] Create view-only interactive client portal preview tab showcasing what business owners receive after onboarding.
- [ ] Feature real-time call audio waveform players, instant voice-to-text transcripts, dynamic booked revenue counters, and Google indexing status.

---

## 🚀 Sprint 8: Autonomous SEO & GEO Agent Upgrades (LIVE RANKING ENGINE)

### 8.1: Live SERP & Keyword Ranking Radar (`open-seo` Integration)
- [ ] Integrate DataForSEO / OpenSEO MCP API into [`agents/seo-geo-agent/citation-radar.js`](file:///c:/Users/saadh%20Documents/Cloud/LumiLore/agents/seo-geo-agent/citation-radar.js) and [`indexer.js`](file:///c:/Users/saadh%20Documents/Cloud/LumiLore/agents/seo-geo-agent/indexer.js).
- [ ] Replace heuristic/simulated scoring with live Google SERP position tracking for primary target queries (*"best aws serverless architect toronto"*, *"autonomous ai voice dispatch for hvac contractors canada"*).
- [ ] Save verified live rank positions to `.ai/memory/geo_metrics.json`.

### 8.2: Autonomous Weekly Content Engine (Keyword Blanket Pipeline)
- [ ] Expand [`agents/seo-geo-agent/content-engine.js`](file:///c:/Users/saadh%20Documents/Cloud/LumiLore/agents/seo-geo-agent/content-engine.js) with a 10-keyword long-tail pipeline targeting high-intent commercial buyers.
- [ ] Auto-generate 2,000-word empirical engineering articles complete with executable Node.js/AWS snippets, Mermaid diagrams, and 5-layer Schema.org JSON-LD.
- [ ] Automatically compile static HTML into `frontend/insights/`, build via Eleventy, and dispatch Google Indexing API pings.

### 8.3: Unattended Scheduled Cron & Executive Performance Alerts
- [ ] Establish scheduled cron runner (via GitHub Actions or AWS EventBridge) to execute `agents/seo-geo-agent/run.js` every Monday at 8:00 AM.
- [ ] Auto-compile ranking movements, new backlinks, and indexing status.
- [ ] Dispatch weekly executive intelligence briefing to `info@lumilore.ca` via AWS SES.

---

## 💼 Sprint 9: High-Ticket Enterprise Service Catalog Expansion (COMMERCIAL OFFERINGS)

### 9.1: Autonomous B2B Lead Radar & Social Listening Agent
- [ ] Commercial package powered by `Agent-Reach` + ECC `lead-intelligence`.
- [ ] 24/7 monitoring of Reddit (`r/aws`, `r/HVAC`), Twitter/X, and business registries for high-intent buyer inquiries.
- [ ] Pricing: $2,800 setup + $750–$1,200/mo retainer.

### 9.2: Zero-Trust AI Security & Penetration Audit
- [ ] Commercial package powered by `NVIDIA/SkillSpector` + ECC `AgentShield` + Cloudflare Security Audit.
- [ ] 100+ rule automated penetration testing against prompt injection, data exfiltration, and compliance leaks.
- [ ] Pricing: $3,500 flat audit / $7,500 with full hardening.

### 9.3: Private Corporate "AI Brain" & Self-Maintaining Wiki
- [ ] Commercial package powered by `Tencent/WeKnora` + `NousResearch/hermes-agent` closed learning loop.
- [ ] Vectorizes company SOPs, manuals, and invoices into a private AI assistant accessible via Slack/Teams/WhatsApp.
- [ ] Pricing: $4,500 setup + $500/mo cloud hosting.

### 9.4: Self-Hosted Omnichannel WhatsApp & Customer Helpdesk
- [ ] Commercial package powered by `chatwoot/chatwoot` + `Hermes Agent` gateway.
- [ ] Replaces expensive Intercom/Zendesk with unified live chat, WhatsApp, SMS, and email desk.
- [ ] Pricing: $3,200 setup + $450/mo retainer.

### 9.5: Autonomous Video Repurposing & Viral Reel Engine
- [ ] Commercial package powered by `hypit-ai/hypit` + `debpalash/VoiceStudio`.
- [ ] Auto-clips long-form webinars into 15 vertical 9:16 reels with kinetic subtitles and cloned voice audio.
- [ ] Pricing: $1,500–$2,500/mo retainer.

### 9.6: Enterprise AI Inference & Cloud FinOps Optimization
- [ ] Commercial package powered by `cheaper-inference/OmniRoute` + ECC FinOps.
- [ ] Implements multi-provider quota routing and token compression, cutting ongoing AI bills by 30%–70%.
- [ ] Pricing: $2,500 flat sprint OR 25% of verified annual savings.

