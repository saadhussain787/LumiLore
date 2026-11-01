# ⚡ LumiLore Agency Mission Control — User Guide & Playbook

Welcome to **LumiLore Mission Control**, the visual command deck for LumiLore's 19-agent autonomous agency fleet.

This guide is written in **plain, everyday English**. You do not need to be a software developer or cloud architect to use, understand, or run any of the tools here.

---

## 📑 Table of Contents
1. [🚀 60-Second Quickstart](#1--60-second-quickstart)
2. [📖 The Plain-English Glossary](#2--the-plain-english-glossary)
3. [🖥️ Tour of Your Mission Control Screen](#3-️-tour-of-your-mission-control-screen)
4. [🏛️ The 19 Agents Directory & Output Cheat Sheet](#4-️-the-19-agents-directory--output-cheat-sheet)
   - [Division 1: Marketing & Growth (Agents 01–04)](#division-1-organic-growth--marketing-pm)
   - [Division 2: Sales & Client Closers (Agents 05–07)](#division-2-sales--solutions-architecture)
   - [Division 3: Engineering & Code Modernization (Agents 08–11)](#division-3-engineering--sdlc-factory)
   - [Division 4: Security & Legal Privacy (Agents 12–14)](#division-4-security--pipeda-compliance)
   - [Division 5: Speed & Mobile Health (Agent 15)](#division-5-web-performance--vitality)
   - [Division 6: Client Delivery & Memory Brain (Agents 16–19)](#division-6-client-delivery--autonomous-brain)
5. [💼 3 Step-by-Step Business Workflows](#5--3-step-by-step-business-workflows)
   - [Workflow A: Auditing a New Prospect's Website & Creating a Contract (Agents 06 + 07)](#workflow-a-auditing-a-prospect-and-generating-an-instant-proposal)
   - [Workflow B: Writing Founder Thought Leadership for LinkedIn (Agent 02)](#workflow-b-writing-founder-thought-leadership-for-linkedin)
   - [Workflow C: Creating a 60-Second Video Script & Ad Set (Agent 04)](#workflow-c-creating-a-60-second-video-ad-script)
6. [🛡️ Safe Mode / Zero-Cost Testing (Dry-Run)](#6-️-safe-mode--zero-cost-testing-dry-run)
7. [❓ FAQ & Troubleshooting](#7--faq--troubleshooting)

---

## 1. 🚀 60-Second Quickstart

You can start Mission Control in three simple steps:

### Step 1: Open Your Terminal & Start Mission Control
In your project folder (VS Code terminal or PowerShell), type this one command and press **Enter**:
```bash
npm run fleet:gui
```
You will see a confirmation message:
```
================================================================
⚡ LUMILORE TECHNOLOGIES // MISSION CONTROL LOCAL WEB ENGINE
📡 URL: http://127.0.0.1:3030
⚡ Conductor Fleet: 6 Divisions, 19 Operatives Ready
================================================================
```

### Step 2: Open Your Web Browser
Open Chrome, Safari, or Edge and go to:
👉 **[http://localhost:3030](http://localhost:3030)**

### Step 3: Run Any Agent
- Click on any agent card (for example, **Agent 06: Website Inspector**).
- A pop-up window appears. Type in a website address (e.g. `apexhvac.ca`).
- Click **"🚀 Dispatch Agent"**.
- A slide-out drawer appears on the right with the completed analysis, scores, and recommendations!

> **How to Stop the Server:**  
> When you are done, return to your terminal and press `Ctrl + C`. That stops the server cleanly.

---

## 2. 📖 The Plain-English Glossary

If you ever see a technical term on screen, here is what it actually means in plain English:

| Technical Term | What It Means in Everyday English | Why It Matters |
| :--- | :--- | :--- |
| **Mission Control** | Your company's visual control center dashboard. | Instead of typing code in a terminal, you click buttons in a browser. |
| **Operative / Agent** | A specialized AI worker trained to do one specific job. | Like having 19 dedicated employees on call 24/7. |
| **Division** | A department in your agency (Growth, Sales, Engineering, etc.). | Groups related agents together. |
| **Dry-Run / Resilience Mock** | Free test mode. | Lets you test or demo any agent instantly without spending money on AI API tokens. |
| **Live OmniRoute Gateway** | The live AI connection (Claude 3.5, Gemini, etc.). | Used when you want real-time, live creative generation. |
| **Circuit Breakers** | An automatic safety valve that switches AI providers if one goes down. | Guarantees that if Bedrock is slow, Gemini or the offline brain takes over seamlessly. |
| **Activity Log (`.jsonl`)** | An automatic company logbook. | Records every single task your agents run so you have a permanent audit trail. |
| **TTFB (Time to First Byte)** | How many milliseconds a website takes to start loading. | Anything under 150ms is lightning fast; over 1,000ms hurts sales. |
| **Inbound Lead Bridge** | A live radar that connects website forms and phone calls to Mission Control. | Lets you see who called or filled a form and audit their site with 1 click. |

---

## 3. 🖥️ Tour of Your Mission Control Screen

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ LUMILORE CONDUCTOR [MISSION CONTROL]   Operatives: 19/19  Runs: 42  [Full Fleet Sim] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔔 [INBOUND ALERT] Apex HVAC (Marcus Vance) | apexhvac.ca   [⚡ 1-Click Launch Scoper] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  🏛️ 6-DIVISION COMMAND DECK                                                           │
│                                                                                        │
│  ┌─ [DIV 1] Growth & Ads ─────────┐  ┌─ [DIV 2] Sales & Solutions ────┐               │
│  │ #01 SEO Dominator        [IDLE]│  │ #05 Voice Concierge     [IDLE]│               │
│  │ #02 Weekly Publisher     [IDLE]│  │ #06 Website Inspector   [IDLE]│  [OUTPUT       │
│  │ #03 Buyer Scout          [IDLE]│  │ #07 SOW Closer          [IDLE]│   DRAWER       │
│  │ #04 Video Ad Studio      [IDLE]│  └────────────────────────────────┘   SLIDES OUT   │
│  └────────────────────────────────┘                                      FROM RIGHT   │
│  ┌─ [DIV 3] Engineering ──────────┐  ┌─ [DIV 4] Security & Privacy ───┐   HERE]        │
│  │ #08 Modernization Arch   [IDLE]│  │ #12 SkillSpector        [IDLE]│                │
│  │ #09 Taste Enforcer       [IDLE]│  │ #13 Security Auditor    [IDLE]│                │
│  │ #10 Serverless Blueprint [IDLE]│  │ #14 PIPEDA Guardian     [IDLE]│                │
│  │ #11 QA Regression Hunter [IDLE]│  └────────────────────────────────┘                │
│  └────────────────────────────────┘                                                   │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 📜 PERSISTENT ACTIVITY AUDIT TRAIL                [Filter by Div] [Search] [Export CSV]│
│ Timestamp        Source   Division   Agent           Status   Summary                  │
│ 11:24:40 AM      GUI      Sales      #06 Inspector   SUCCESS  Audited apexhvac.ca      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### The 5 Core Areas of Your Dashboard:
1. **The Header Bar:** Shows global statistics: total operatives (19), completed runs, average speed, and a button to run a full agency simulation.
2. **The Inbound Alert Banner:** When someone calls the phone hotline or fills out the website contact form, this banner lights up amber with an instant **"1-Click Launch"** button.
3. **The 6-Division Command Deck:** The main visual grid of your 19 agents. Each card has an agent number, name, mission summary, and a live status badge (`IDLE`, `RUNNING`, `SUCCESS`, `ERROR`).
4. **The Click-to-Run Parameter Modal:** Clicking any agent opens a simple form asking for whatever info that agent needs (like a domain name or a topic).
5. **The Live Output Drawer:** A panel that slides out from the right displaying the agent's work with 1-click buttons to copy the text or download the report.

---

## 4. 🏛️ The 19 Agents Directory & Output Cheat Sheet

Here is your quick-reference guide to all 19 agents across the 6 divisions:

### Division 1: Organic Growth & Marketing PM
*Goal: Bring more targeted visitors, higher search rankings, and viral authority to LumiLore.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **SEO Dominator** | Finds Google keywords ranking on page 2 (positions 8–20) and shows how to push them into the Top 3. | Target website domain (e.g. `lumilore.com`) | A keyword gap report and competitor displacement comparison table. |
| **02** | **Weekly Publisher** | Writes high-authority LinkedIn posts and articles in Saad’s exact engineering voice. | Case study or topic (e.g. `Cutting AWS bills`) | A copy-paste Tuesday/Thursday LinkedIn queue free of corporate buzzwords. |
| **03** | **Buyer Scout** | Scans online forums (Reddit, HackerNews) for people asking for cloud or trade automation help. | Discussion thread or forum name | An intent score (0–100) and a helpful, non-salesy consultative answer. |
| **04** | **Video Ad Studio** | Creates high-energy 60-second video scripts for TikTok/YouTube Shorts and Facebook ad copy. | Campaign goal and target audience | A full video script with visual prompts, hooks, and mobile ad headlines. |

---

### Division 2: Sales & Solutions Architecture
*Goal: Convert curious prospects into paying, high-ticket agency clients.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **05** | **Voice Concierge** | Manages telephone conversations on our +1-437-786-5864 line and books calendar slots. | Caller transcript or phone number | A triage summary, intent classification (Cloud vs. Trades), and calendar booking record. |
| **06** | **Website Inspector PM** | Runs a complete 6-layer audit of any prospect's website (speed, mobile layout, missed phone calls). | A prospect's website URL (e.g. `apexhvac.ca`) | An executive teardown calculating exact monthly revenue lost to slow loading. |
| **07** | **SOW Closer** | Turns audit findings into a formal 3-tier proposal ($4.5k sprint, $7.5k retainer, $15k enterprise). | Client company name & audit summary | A complete Statement of Work (SOW) with milestone delivery dates and legal clauses. |

---

### Division 3: Engineering & SDLC Factory
*Goal: Build lightning-fast, ultra-clean web code that loads in under 150ms.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **08** | **Modernization Architect** | Redesigns slow, bloated WordPress/Wix sites into modern, sub-150ms Jamstack code. | Legacy website HTML or URL | Clean, modern Tailwind CSS code and a side-by-side Before/After preview. |
| **09** | **Taste Enforcer** | Acts as an artistic director, banning generic AI visuals, clunky gradients, and hard-to-read text. | Web page layout or CSS colors | A Taste Scorecard (0–100) and specific typography and color corrections. |
| **10** | **Serverless Architect** | Designs cost-effective cloud architectures (AWS Lambda / DynamoDB) that only charge per request. | Service name and event requirements | An AWS infrastructure blueprint reducing cloud costs by over 65%. |
| **11** | **QA Regression Hunter** | Tests web pages across phones, tablets, and desktop viewports to ensure zero buttons or links are broken. | List of web page routes to test | A quality report confirming 100% of links work and all touch targets are at least 48px. |

---

### Division 4: Security & PIPEDA Compliance
*Goal: Ensure enterprise-grade security, zero data leaks, and strict Canadian privacy law compliance.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **12** | **SkillSpector** | Scans prompts and user inputs to prevent AI jailbreaks and malicious prompt injections. | Inbound user text or prompt | A safety scorecard confirming the text is safe and contains no system overrides. |
| **13** | **Security Auditor** | Checks website headers and firewalls to ensure hackers cannot inject malicious scripts. | Web endpoint or URL | An edge security report grading HTTP security headers and Content Security Policies. |
| **14** | **PIPEDA Guardian** | Audits customer data to guarantee Canadian privacy compliance (zero PII leaks, cookie banner compliance). | Data processing workflow | A legal privacy attestation certifying customer data is never used to train public models. |

---

### Division 5: Web Performance & Vitality
*Goal: Keep websites at a perfect 100/100 Google Lighthouse score.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **15** | **PageSpeed Sentry** | Monitors web pages for lightning-fast speed, accessibility for the blind, and perfect mobile rendering. | Web page route or HTML | A 100/100 Core Web Vitals report verifying sub-150ms loading on mobile phones. |

---

### Division 6: Client Delivery & Autonomous Brain
*Goal: Guarantee smooth project delivery, happy clients, 5-star Google reviews, and self-improving AI memory.*

| # | Agent Name | What It Does (In Simple Terms) | What You Type In | What You Get Back |
| :-: | :--- | :--- | :--- | :--- |
| **16** | **WeKnora Hermes Brain** | Indexes all successful project deliverables into a self-evolving agency memory file. | Sprint outputs and conversion patterns | An updated `fleet_instincts.json` file making future runs even smarter. |
| **17** | **Delivery Shepherd** | Creates 14-day client onboarding roadmaps and weekly executive status briefings. | Client project name & completed tasks | A concise weekly client briefing (<300 words) with risk mitigation milestones. |
| **18** | **ROI Upsell Engine** | Calculates the exact dollar value delivered to a client (calls saved, revenue booked) and drafts next-phase proposals. | Client monthly operational numbers | An ROI Scorecard showing >5x contract value return and natural expansion ideas. |
| **19** | **Review Harvester** | Automates 5-star Google review invitations and client testimonial cards upon project completion. | Client name & project outcome | A 1-tap review invitation message and a reciprocal high-ranking footer backlink snippet. |

---

## 5. 💼 3 Step-by-Step Business Workflows

### Workflow A: Auditing a Prospect and Generating an Instant Proposal
*When to use: A new business lead asks: "Can you help modernize our website and increase calls?"*

1. Open Mission Control at `http://localhost:3030`.
2. Find **Division 2 (Sales)** and click **Agent 06 (Website Inspector)**.
3. In the popup, enter their domain (e.g. `clientwebsite.ca`) and industry (e.g. `Commercial HVAC`).
4. Click **"🚀 Dispatch Agent"**.
5. When the drawer opens, review the **Executive Financial Leakage Summary** (e.g., *$3,400/month lost to missed calls*).
6. Next, click **Agent 07 (SOW Closer)**.
7. Enter the client's name and select their tier (e.g. `Growth Retainer`).
8. Click **"🚀 Dispatch Agent"**.
9. You now have a complete, lawyer-grade Statement of Work with pricing, milestones, and deliverables ready to copy and send!

---

### Workflow B: Writing Founder Thought Leadership for LinkedIn
*When to use: Every Tuesday or Thursday morning to keep Saad’s personal brand top-of-mind.*

1. Open Mission Control at `http://localhost:3030`.
2. In **Division 1 (Growth)**, click **Agent 02 (Weekly Publisher)**.
3. Enter the topic or recent case study (e.g. `Cutting AWS bills for high-volume trade contractors`).
4. Click **"🚀 Dispatch Agent"**.
5. Within 5 seconds, the drawer opens with:
   - A high-hook Tuesday post for enterprise CTOs.
   - A relatable Thursday post for blue-collar trade business owners.
   - A Google Business Profile local post.
6. Click **"📋 Copy Output"** at the bottom of the drawer and paste it directly into LinkedIn!

---

### Workflow C: Creating a 60-Second Video Ad Script
*When to use: When launching a paid ad campaign on TikTok, Instagram Reels, or YouTube Shorts.*

1. Open Mission Control at `http://localhost:3030`.
2. In **Division 1 (Growth)**, click **Agent 04 (Video Ad Studio)**.
3. In the popup, enter your target audience (e.g. `Trade company owners with 5-20 trucks`).
4. Click **"🚀 Dispatch Agent"**.
5. The drawer opens with:
   - A second-by-second 9:16 vertical video script (0-3s hook, 4-30s problem teardown, 31-50s solution proof, 51-60s call to action).
   - Visual cues for the editor.
   - Ad headline under 40 characters for mobile ad managers.

---

## 6. 🛡️ Safe Mode / Zero-Cost Testing (Dry-Run)

Every time you click an agent in Mission Control, you will notice a checkbox:
```
[x] 🛡️ Dry-Run (Offline Resilience Mock)
```

### What is this?
- **Checked (Recommended for testing & demos):** The agent runs completely free using LumiLore's built-in offline brain. It completes in **under 15 milliseconds**, generates structured mock data, and uses zero external AI tokens.
- **Unchecked (Live Production):** The agent connects to live AI models (AWS Bedrock or Google Gemini) to generate real, dynamic content from the live internet.

> **Tip:** Leave **Dry-Run checked** whenever you are demonstrating the platform to others or testing out new ideas. Switch to live mode when you are producing real deliverables for real clients!

---

## 7. ❓ FAQ & Troubleshooting

### Q1: What do I do if port 3030 is already being used?
**Answer:** Mission Control handles this automatically! If port 3030 is occupied by another program on your computer, the server will automatically test port 3031, 3032, etc., and print the active URL in your terminal. Look at the terminal to see the exact port (e.g., `http://127.0.0.1:3031`).

### Q2: How do I export my company activity log to Excel?
**Answer:**
1. Scroll down to the **Persistent Activity Audit Trail** at the bottom of Mission Control.
2. Click the **"📥 Export CSV"** button.
3. A spreadsheet file (`fleet_activity_log.csv`) will instantly download to your computer, which you can open in Excel, Google Sheets, or Numbers.

### Q3: What happens if an inbound lead arrives while I'm looking at the screen?
**Answer:** Mission Control uses real-time live synchronization. As soon as a lead submits a form on `lumilore.com/contact/` or finishes a call on the phone hotline, the amber **Inbound Lead Alert Banner** will immediately slide down at the top of your screen with their name, phone number, and a 1-click launch button.

### Q4: Can I run all 19 agents at once to test the whole company?
**Answer:** Yes! In the top-right corner of the header, click the **"⚡ Full Fleet Sim"** button. The dashboard will automatically sequence through all 19 agents one by one, lighting up each card with a running indicator, and record the entire sweep in your logbook.

### Q5: How do I close Mission Control when I'm finished?
**Answer:**
1. Close your browser tab.
2. Go back to your terminal window where you ran `npm run fleet:gui`.
3. Press `Ctrl + C` on your keyboard. The server will shut down gracefully in under one second.

---

*LumiLore Technologies // Lead Systems Architect Documentation // Sprints 1–35 Certified*

