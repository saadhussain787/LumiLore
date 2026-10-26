/**
 * LumiLore Technologies // Autonomous Marketing & Acquisition Super-Agent
 * Personalized Cold Outreach Sequence Generator (Direct Outreach)
 * 
 * Generates 3-stage, high-converting B2B cold email and LinkedIn DM outreach sequences
 * in the Saad Sayed persona, citing verified empirical metrics, zero generic fluff,
 * and direct 1-click calendar reservation links.
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';

export class OutreachGenerator {
  constructor(options = {}) {
    this.config = options.config || CONFIG;
    this.extractor = options.extractor || new ContentExtractor();
    this.outputDir = options.outputDir || this.config.paths.outreachDir;
    this.persona = this.config.persona;
    this.lenses = this.config.lenses;
  }

  /**
   * Generate a complete 3-stage outreach sequence for a target prospect
   * @param {Object} prospect
   * @param {string} prospect.prospectCompany - Company name
   * @param {string} [prospect.industry] - 'trades' | 'corporate'
   * @param {string} [prospect.decisionMakerName] - Contact name
   * @param {string} [prospect.decisionMakerTitle] - Contact title
   * @param {string} [prospect.primaryBottleneck] - Specific problem
   * @param {string} [prospect.customNotes] - Context
   * @returns {Object} 3-Stage Cold Email Sequence + LinkedIn DM variants
   */
  generateSequence(prospect = {}) {
    const company = prospect.prospectCompany || 'Your Team';
    const industry = prospect.industry === 'trades' ? 'trades' : 'corporate';
    const name = prospect.decisionMakerName || 'there';
    const title = prospect.decisionMakerTitle || (industry === 'trades' ? 'Operations Director' : 'Engineering Lead');
    const bottleneck = prospect.primaryBottleneck || (
      industry === 'trades' 
        ? 'missed after-hours emergency repair calls' 
        : 'idle AWS EC2 infrastructure and cloud waste'
    );

    if (industry === 'trades') {
      return this._buildTradesSequence({ company, name, title, bottleneck, customNotes: prospect.customNotes });
    } else {
      return this._buildCorporateSequence({ company, name, title, bottleneck, customNotes: prospect.customNotes });
    }
  }

  /**
   * Build 3-Stage Mechanical Trades Sequence
   */
  _buildTradesSequence({ company, name, title, bottleneck }) {
    const calendarLink = `https://lumilore.ca/contact/?service=voice-dispatch&tier=growth&lens=trades&prospect=${encodeURIComponent(company)}`;
    const caseStudyLink = 'https://lumilore.ca/insights/autonomous-247-ai-voice-dispatch-mechanical-trades/';

    // Stage 1: The Pain Point Hook (empirical benchmark)
    const stage1 = {
      stage: 1,
      name: 'The Pain Point Hook',
      subjectLineCandidates: [
        `quick question regarding ${company}'s after-hours dispatch`,
        `missed emergency calls at ${company} ($1,500/call leak)`,
        `${name} - after-hours call triage for ${company}`
      ],
      selectedSubject: `quick question regarding ${company}'s after-hours dispatch`,
      body: `Hi ${name},

Most commercial HVAC and mechanical contractors lose between $180,000 and $295,750 per year not from poor field work, but simply because emergency calls between 5:00 PM and 7:00 AM hit voicemail or a slow third-party answering service.

When a facilities manager has a burst boiler or chilled water leak, they don't wait for a callback—they dial the next contractor on Google.

We built an autonomous AI voice dispatch receptionist specifically for mechanical fleet contractors that answers on the 1st ring, triages emergency severity in sub-800ms natural conversational audio, and books the technician directly into ServiceTitan or Jobber.

Are you currently relying on an on-call tech or a call center to field after-hours calls at ${company}?

Best regards,

Saad Sayed
Principal Systems Architect | LumiLore Technologies
Direct: 437-848-7086 | https://lumilore.ca`
    };

    // Stage 2: The 2-minute Architecture Solution & Diagnostic Proof
    const stage2 = {
      stage: 2,
      name: 'The 2-Minute Architecture Proof',
      delayDays: 3,
      selectedSubject: `Re: quick question regarding ${company}'s after-hours dispatch`,
      caseStudyLink,
      body: `Hi ${name},

Following up on my note from earlier this week.

When contractors look at automated dispatch, the primary objection is usually: *"Will this sound like a robotic IVR tree that infuriates our commercial customers?"*

We published the verified architecture and latency logs here:
${caseStudyLink}

The key distinction:
1. Sub-800ms conversational turn-around (faster than human call centers).
2. Direct CRM dispatch logic: validates caller address, verifies service agreement status, and pages only the designated on-call tech for true emergencies.
3. Zero dropped calls during seasonal weather spikes.

Would you be open to a 2-minute audio demo of the agent handling an emergency commercial pipe freeze scenario?

Best,

Saad Sayed
LumiLore Technologies`
    };

    // Stage 3: The 1-click Calendar Reservation Link
    const stage3 = {
      stage: 3,
      name: 'The 1-Click Calendar Reservation',
      delayDays: 4,
      selectedSubject: `${company}'s after-hours call audit (closing the loop)`,
      calendarLink,
      body: `Hi ${name},

I know you're busy running operations at ${company}, so I'll be brief.

If your after-hours answering setup is already capturing 100% of emergency revenue, feel free to disregard this.

If you'd like to test your numbers against our Ontario mechanical fleet benchmark, you can reserve a 15-minute diagnostic call directly on my calendar here:
${calendarLink}

No sales pitch—just a 1-page breakdown of how much revenue ${company} is potentially leaving on the table after 5:00 PM and how to capture it autonomously.

Cheers,

Saad Sayed
Principal Systems Architect | LumiLore Technologies
https://lumilore.ca`
    };

    // Short LinkedIn DM Variant
    const linkedInDM = {
      platform: 'LinkedIn DM',
      characterCount: 260,
      text: `Hi ${name} — saw your work leading operations at ${company}. Curious: how are you currently handling emergency after-hours dispatch? We built an AI voice agent for mechanical contractors answering on the 1st ring with direct ServiceTitan sync. Worth a 2-min demo?`
    };

    return {
      company,
      industry: 'trades',
      targetName: name,
      targetTitle: title,
      bottleneck,
      stages: [stage1, stage2, stage3],
      linkedInDM,
      calendarLink,
      caseStudyLink
    };
  }

  /**
   * Build 3-Stage Corporate Cloud Architecture Sequence
   */
  _buildCorporateSequence({ company, name, title, bottleneck }) {
    const calendarLink = `https://lumilore.ca/contact/?service=web-modernization&tier=growth&lens=corporate&prospect=${encodeURIComponent(company)}`;
    const caseStudyLink = 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/';

    // Stage 1: The Pain Point Hook (empirical benchmark)
    const stage1 = {
      stage: 1,
      name: 'The Pain Point Hook',
      subjectLineCandidates: [
        `cutting ${company}'s AWS compute waste by 50%+`,
        `serverless migration & idle cloud costs at ${company}`,
        `${name} - quick architecture question for ${company}`
      ],
      selectedSubject: `cutting ${company}'s AWS compute waste by 50%+`,
      body: `Hi ${name},

Most cloud infrastructure budgets we audit carry 40% to 68% in pure idle waste—usually over-provisioned EC2 instances, RDS connection exhaustion, and bloated container clusters provisioned for peak traffic that only occurs 5% of the time.

We recently published an engineering case study detailing how we slashed monthly cloud infrastructure spend by 68% while dropping edge latency to sub-150ms globally:
${caseStudyLink}

The stack: ARM64 Graviton3 Lambda, DynamoDB on-demand single-table design, and CloudFront edge caching.

Are you actively looking to reduce infrastructure overhead or modernize legacy services at ${company} this quarter?

Best regards,

Saad Sayed
Principal Cloud & Systems Architect | LumiLore Technologies
https://lumilore.ca`
    };

    // Stage 2: The 2-minute Architecture Solution & Diagnostic Proof
    const stage2 = {
      stage: 2,
      name: 'The 2-Minute Architecture Proof',
      delayDays: 3,
      selectedSubject: `Re: cutting ${company}'s AWS compute waste by 50%+`,
      caseStudyLink,
      body: `Hi ${name},

Following up on my note regarding ${company}'s cloud architecture.

A quick technical detail on why the 68% reduction worked without sacrificing reliability:
- Zero idle billing: We eliminated provisioned compute instances for asynchronous tasks and migrated to event-driven EventBridge pipes.
- Sub-150ms TTFB: Replaced monolithic backend routing with localized edge responses.
- Single-digit millisecond queries: Eliminated SQL connection contention via DynamoDB inverted GSI indexes.

If you have a 1-page architectural diagram or a top-level AWS cost breakdown you'd like a second pair of eyes on, I'd be glad to share our diagnostic findings.

Best,

Saad Sayed
Principal Systems Architect | LumiLore Technologies`
    };

    // Stage 3: The 1-click Calendar Reservation Link
    const stage3 = {
      stage: 3,
      name: 'The 1-Click Calendar Reservation',
      delayDays: 4,
      selectedSubject: `${company}'s cloud architecture review (closing the loop)`,
      calendarLink,
      body: `Hi ${name},

Understood you're focused on engineering delivery at ${company}.

If cloud optimization isn't an active priority right now, no problem at all.

If you'd like a confidential 20-minute architecture review to identify where ${company}'s highest compute leaks are, feel free to pick a time directly on my calendar here:
${calendarLink}

No sales pitch—just a direct peer review between systems engineers.

Regards,

Saad Sayed
Principal Cloud & Systems Architect | LumiLore Technologies
https://lumilore.ca`
    };

    // Short LinkedIn DM Variant
    const linkedInDM = {
      platform: 'LinkedIn DM',
      characterCount: 275,
      text: `Hi ${name} — loved your team's engineering updates at ${company}. Question: is reducing AWS compute waste or sub-150ms edge latency on your roadmap? We just open-sourced our blueprint cutting cloud spend by 68% via ARM64 serverless. Would love to swap notes if relevant!`
    };

    return {
      company,
      industry: 'corporate',
      targetName: name,
      targetTitle: title,
      bottleneck,
      stages: [stage1, stage2, stage3],
      linkedInDM,
      calendarLink,
      caseStudyLink
    };
  }

  /**
   * Generate default batch of sample outreach sequences across both lenses
   * @returns {Array<Object>}
   */
  generateSampleBatch() {
    return [
      this.generateSequence({
        prospectCompany: 'Apex Mechanical Contractors',
        industry: 'trades',
        decisionMakerName: 'Dave Miller',
        decisionMakerTitle: 'VP of Field Operations',
        primaryBottleneck: 'after-hours emergency calls going to voicemail'
      }),
      this.generateSequence({
        prospectCompany: 'DataFlow Systems',
        industry: 'corporate',
        decisionMakerName: 'Sarah Chen',
        decisionMakerTitle: 'VP of Engineering',
        primaryBottleneck: 'over-provisioned EC2 clusters and high monthly AWS bills'
      }),
      this.generateSequence({
        prospectCompany: 'Superior Plumbing & Heating',
        industry: 'trades',
        decisionMakerName: 'Mark Robertson',
        decisionMakerTitle: 'Managing Partner',
        primaryBottleneck: 'dropped calls during peak technician on-call shifts'
      }),
      this.generateSequence({
        prospectCompany: 'Kinetix Media Cloud',
        industry: 'corporate',
        decisionMakerName: 'Alex Mercer',
        decisionMakerTitle: 'Head of Infrastructure',
        primaryBottleneck: '3.4s slow WordPress TTFB and legacy server hosting'
      })
    ];
  }

  /**
   * Save generated sequences to disk
   * @param {Array<Object>} sequences 
   * @param {Object} [options]
   * @returns {Object} Manifest & files
   */
  saveSequences(sequences, options = {}) {
    const targetDir = options.outputDir || this.outputDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const savedFiles = [];

    sequences.forEach((seq, index) => {
      const sanitizedCompany = seq.company.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const fileName = `${String(index + 1).padStart(2, '0')}_outreach_${seq.industry}_${sanitizedCompany}.md`;
      const filePath = path.join(targetDir, fileName);

      let content = `---
company: "${seq.company}"
industry: "${seq.industry}"
targetName: "${seq.targetName}"
targetTitle: "${seq.targetTitle}"
bottleneck: "${seq.bottleneck}"
calendarLink: "${seq.calendarLink}"
caseStudyLink: "${seq.caseStudyLink}"
generatedAt: "${new Date().toISOString()}"
---

# B2B Cold Outreach Campaign // ${seq.company} (${seq.industry.toUpperCase()})

**Target Prospect:** ${seq.targetName} (${seq.targetTitle})  
**Primary Bottleneck Identified:** ${seq.bottleneck}  
**1-Click Calendar Booking:** [${seq.calendarLink}](${seq.calendarLink})  
**Author Persona:** ${this.persona.author} (${this.persona.authorTitle})

---

## 📱 LinkedIn Direct Message (Quick Intro // Under 300 Chars)
> ${seq.linkedInDM.text}

*(Characters: ${seq.linkedInDM.characterCount})*

---

`;

      seq.stages.forEach(st => {
        content += `## ✉️ Stage ${st.stage}: ${st.name} ${st.delayDays ? `(Send after ${st.delayDays} days)` : '(Initial Outreach)'}

**Subject Line:** \`${st.selectedSubject}\`  
${st.subjectLineCandidates ? `**Alternative Subject Lines:**\n${st.subjectLineCandidates.map(s => `- ${s}`).join('\n')}\n` : ''}
\`\`\`text
${st.body}
\`\`\`

---

`;
      });

      fs.writeFileSync(filePath, content, 'utf8');
      savedFiles.push(filePath);
    });

    // Write manifest
    const manifestPath = path.join(targetDir, 'latest_outreach_batch.json');
    const manifest = {
      generatedAt: new Date().toISOString(),
      totalSequences: sequences.length,
      author: this.persona.author,
      sequences: sequences.map(s => ({
        company: s.company,
        industry: s.industry,
        targetName: s.targetName,
        targetTitle: s.targetTitle,
        stagesCount: s.stages.length,
        calendarLink: s.calendarLink
      }))
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    return {
      manifestPath,
      savedFiles,
      sequences
    };
  }
}

export default OutreachGenerator;
