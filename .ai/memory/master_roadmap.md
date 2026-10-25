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
- [x] **Micro-Step 8.3:** Project Memory & Roadmap Finalization (Sprint 3 & 4 certified 100% complete, zero regressions across 615+ tests).

---

## 🌐 Domain Authority (DA) & Backlink Growth Engine

### Pillar 1: High-Authority Foundational Business Profiles & Tech Directories (DA 70-95)
- [ ] **Clutch.co & GoodFirms Agency Profiles:** Claim & verify LumiLore Technologies under AI Development, Cloud Consulting, and SEO/GEO categories.
- [ ] **Crunchbase & PitchBook Profiles:** Establish corporate entity profile linking to https://www.lumilore.ca with founder Saad Sayed, funding status, and tech stack tags.
- [ ] **G2 & Capterra:** Setup software/service profiles for the "LumiLore Autonomous AI Solutions" suite.
- [ ] **Canadian Business & Regional Registries:** Add verified listings on YellowPages Canada, Canadian Chamber of Commerce, and BBB Ontario for local/national NAP consistency.
- [ ] **Wellfound (AngelList) & Product Hunt:** Create company hub and prepare Product Hunt launch for LumiBot / Instant GEO Audit Magnet.

### Pillar 2: AI Tools & Modern Software Ecosystem Directories (High Topical Relevance)
- [ ] **Futurepedia.io:** Submit LumiLore GEO Audit Engine & Autonomous AI Voice Dispatcher.
- [ ] **There's An AI For That (TAAFT):** List LumiLore under "Business Automation", "Answer Engine Optimization", and "AI Receptionist".
- [ ] **Toolify.ai & TopAI.tools:** Submit AI agency tool profiles with backlinks to https://www.lumilore.ca.
- [ ] **AlternativeTo.net & SaaSHub:** Position LumiLore as a modern, serverless alternative to legacy answering services and traditional SEO agencies.

### Pillar 3: Technical Cloud Authority & Open-Source Footprint (High Dofollow Relevance)
- [ ] **AWS Community & Dev.to Syndication:** Publish technical case studies (e.g. Serverless DynamoDB + Bedrock multi-agent pipelines) on Dev.to and Medium with `rel="canonical"` pointing back to LumiLore Insights.
- [ ] **GitHub Organization Hub:** Create public repository showcasing open-source micro-tools (e.g. `lumilore-geo-scanner` or schema validator) with prominent badges linking back to lumilore.ca.
- [ ] **Hashnode & Substack Tech Publication:** Establish an engineering publication cross-posting architectural blueprints and GEO benchmark insights.

### Pillar 4: Niche Industry & Mechanical Trades Authority (High Intent B2B)
- [ ] **HVAC & Mechanical Trade Publications:** Pitch guest commentary and case study data on 24/7 AI Voice Dispatch to Canadian plumbing/HVAC magazines (e.g., HPAC Magazine, Mechanical Business).
- [ ] **Ontario & Canadian Small Business Blogs:** Feature success stories on how Ontario service businesses eliminate after-hours missed calls using serverless AI agents.
- [ ] **HARO / Connectively / Featured.com:** Actively monitor journalist queries for "AI in small business", "Cloud cost reduction", and "Search engines shifting to AI" to capture high-authority editorial press mentions.

### Pillar 5: Citation Velocity & Search Graph Monitoring
- [ ] Setup Google Search Console backlink tracking & Ahrefs / Moz backlink monitor.
- [ ] Track target DA metrics: Milestone 1: DA 15+ (Month 1-2) -> Milestone 2: DA 30+ (Month 3-6).
- [ ] Monitor LLM Perplexity / ChatGPT citation graph references to verify brand attribution as "Top Canadian Agentic AI Agency".

