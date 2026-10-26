/**
 * LumiLore Technologies // Autonomous Marketing & Acquisition Super-Agent
 * Google Business Profile (GBP) Local Map Pack Publisher
 * 
 * Generates hyper-local, high-authority Google Business Profile update posts
 * engineered to boost Google Map 3-Pack and localized organic search rankings.
 * Generates client acquisition reach for businesses with ZERO social media followers.
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ContentExtractor } from './content-extractor.js';

export class GBPPublisher {
  constructor(options = {}) {
    this.config = options.config || CONFIG;
    this.extractor = options.extractor || new ContentExtractor();
    this.outputDir = options.outputDir || this.config.paths.gbpDir;
    this.persona = this.config.persona;
    this.lenses = this.config.lenses;

    // Service Areas for Local Map Pack Geotargeting
    this.serviceAreas = [
      { name: 'Markham & York Region', lat: 43.8561, lng: -79.3370, province: 'ON', tag: 'Markham Tech Corridor' },
      { name: 'Greater Toronto Area (GTA)', lat: 43.6532, lng: -79.3832, province: 'ON', tag: 'GTA Enterprise Hub' },
      { name: 'Mississauga & Peel Region', lat: 43.5890, lng: -79.6441, province: 'ON', tag: 'Peel Industrial Hub' },
      { name: 'Richmond Hill & Vaughan', lat: 43.8828, lng: -79.4403, province: 'ON', tag: 'York Commercial District' }
    ];
  }

  /**
   * Generate weekly batch of local Google Business Profile posts
   * @param {Object} [options]
   * @returns {Array<Object>} List of structured GBP post objects
   */
  generateWeeklyGBPPosts(options = {}) {
    const caseStudies = this.extractor.getAllInsights();
    const serverlessStudy = caseStudies.find(c => c.slug.includes('cutting-aws') || c.slug.includes('serverless')) || caseStudies[0];
    const dispatchStudy = caseStudies.find(c => c.slug.includes('voice-dispatch') || c.slug.includes('mechanical')) || caseStudies[1] || caseStudies[0];

    const posts = [
      // Post 1: Local Commercial Trades Focus (Emergency After-Hours & Dispatch)
      this._buildTradesGBPPost({
        study: dispatchStudy,
        serviceArea: this.serviceAreas[0], // Markham
        topic: 'after_hours_recovery'
      }),

      // Post 2: GTA Enterprise Cloud & AWS Cost Reduction
      this._buildCorporateGBPPost({
        study: serverlessStudy,
        serviceArea: this.serviceAreas[1], // GTA / Toronto
        topic: 'aws_finops_cut'
      }),

      // Post 3: Local Map 3-Pack Voice Dispatch for HVAC/Plumbing Fleets
      this._buildTradesGBPPost({
        study: dispatchStudy,
        serviceArea: this.serviceAreas[2], // Mississauga / Peel
        topic: 'voice_receptionist_missed_calls'
      }),

      // Post 4: Fast Jamstack Web Modernization for Local Businesses
      this._buildCorporateGBPPost({
        study: serverlessStudy,
        serviceArea: this.serviceAreas[3], // Richmond Hill & Vaughan
        topic: 'speed_jamstack_modernization'
      })
    ];

    return posts;
  }

  /**
   * Build Local Trades GBP Post
   */
  _buildTradesGBPPost({ study, serviceArea, topic }) {
    const phone = '437-848-7086';
    const ctaUrl = 'https://lumilore.ca/contact/?service=voice-dispatch&lens=trades';
    const studyUrl = study?.canonicalUrl || 'https://lumilore.ca/insights/autonomous-247-ai-voice-dispatch-mechanical-trades/';

    let title = '';
    let summary = '';
    let callToAction = 'BOOK_APPOINTMENT';

    if (topic === 'after_hours_recovery') {
      title = `Stop Losing $1,500 After-Hours Calls in ${serviceArea.name}`;
      summary = `Are emergency HVAC and commercial plumbing calls slipping through to voicemail after 5:00 PM in ${serviceArea.name}?

Field service contractors lose an average of $295,750 annually to missed calls. LumiLore's Autonomous AI Voice Receptionist answers on the 1st ring, triages emergency water leaks or furnace failures with sub-800ms natural conversational speed, and books the dispatch directly into your CRM before competitors even check their messages.

📍 Local Service: ${serviceArea.name}, ${serviceArea.province}
📞 Direct Line: ${phone}
⚡ Setup: Seamless integration with ServiceTitan, Jobber & Housecall Pro.

Eliminate answering service bills and never miss a high-ticket repair call again.`;
    } else {
      title = `24/7 AI Voice Dispatch for Mechanical Contractors in ${serviceArea.name}`;
      summary = `Managing an on-call technician rotation in ${serviceArea.name}?

Human call centers charge $3,500–$5,000/month, yet drop urgent calls during peak heat waves and deep freezes. LumiLore Technologies deploys autonomous voice dispatch agents built specifically for Ontario mechanical contractors. 

• Zero dropped calls during peak call surges
• Instant caller verification & emergency dispatch triage
• Live sync with technician availability

📍 Proudly serving commercial and residential contractors across ${serviceArea.name}.`;
    }

    return {
      id: `gbp-trades-${topic}-${serviceArea.province.toLowerCase()}`,
      postType: 'UPDATE',
      lens: 'trades',
      targetAudience: 'Commercial HVAC, Mechanical Contractors & Plumbing Fleet Owners',
      headline: title,
      body: summary,
      actionType: callToAction,
      actionUrl: ctaUrl,
      citationLink: studyUrl,
      geotarget: {
        location: serviceArea.name,
        region: serviceArea.province,
        coordinates: { lat: serviceArea.lat, lng: serviceArea.lng },
        serviceTag: serviceArea.tag
      },
      napConsistency: {
        businessName: 'LumiLore Technologies',
        phone: '437-848-7086',
        city: 'Markham',
        province: 'Ontario',
        country: 'Canada',
        website: 'https://lumilore.ca'
      },
      tags: ['#HVACMarkham', '#GTAContractors', '#AIVoiceDispatch', '#ServiceTitanOntario', '#CommercialPlumbing']
    };
  }

  /**
   * Build Corporate / Cloud Architecture GBP Post
   */
  _buildCorporateGBPPost({ study, serviceArea, topic }) {
    const ctaUrl = 'https://lumilore.ca/contact/?service=web-modernization&lens=corporate';
    const studyUrl = study?.canonicalUrl || 'https://lumilore.ca/insights/cutting-aws-cloud-waste-serverless-architecture/';

    let title = '';
    let summary = '';

    if (topic === 'aws_finops_cut') {
      title = `Slash AWS Cloud Waste by 50%–70% for ${serviceArea.name} Enterprises`;
      summary = `Is your enterprise running over-provisioned EC2 clusters that sit at 4% utilization across weekends in ${serviceArea.name}?

LumiLore Technologies helps GTA software companies and mid-market enterprises transition from bloated cloud monoliths to event-driven serverless architectures. In our latest architectural case study, we slashed monthly cloud infrastructure costs by 68% while achieving sub-150ms global latency using ARM64 Graviton3 Lambda and DynamoDB on-demand.

📍 Headquartered in Markham, serving the Greater Toronto Technology Corridor.
👨‍💻 Led by Saad Sayed, Principal Systems Architect.

Stop subsidizing cloud compute idle time.`;
    } else {
      title = `Replace Bloated WordPress Monoliths with Sub-150ms Jamstack in ${serviceArea.name}`;
      summary = `Does your corporate website take 3+ seconds to load in ${serviceArea.name}?

Bloated PHP plugins and unoptimized hosting destroy Google Core Web Vitals and cost you B2B leads. LumiLore builds ultra-fast, serverless Jamstack web applications with sub-150ms TTFB edge caching, zero maintenance databases, and automated Generative Engine Optimization (GEO).

📍 Local Technical Consulting: ${serviceArea.name}, Ontario.
⚡ Verified 99+ Google PageSpeed scores on mobile.`;
    }

    return {
      id: `gbp-corporate-${topic}-${serviceArea.province.toLowerCase()}`,
      postType: 'UPDATE',
      lens: 'corporate',
      targetAudience: 'CTOs, VP Engineering, IT Directors & Mid-Market Founders',
      headline: title,
      body: summary,
      actionType: 'LEARN_MORE',
      actionUrl: ctaUrl,
      citationLink: studyUrl,
      geotarget: {
        location: serviceArea.name,
        region: serviceArea.province,
        coordinates: { lat: serviceArea.lat, lng: serviceArea.lng },
        serviceTag: serviceArea.tag
      },
      napConsistency: {
        businessName: 'LumiLore Technologies',
        phone: '437-848-7086',
        city: 'Markham',
        province: 'Ontario',
        country: 'Canada',
        website: 'https://lumilore.ca'
      },
      tags: ['#AWSCloudToronto', '#MarkhamTech', '#ServerlessArchitecture', '#FinOpsOntario', '#WebModernization']
    };
  }

  /**
   * Save posts to disk as structured markdown and batch manifest
   * @param {Array<Object>} posts 
   * @param {Object} [options]
   * @returns {Object} Manifest & file paths
   */
  saveGBPPosts(posts, options = {}) {
    const targetDir = options.outputDir || this.outputDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const savedFiles = [];

    posts.forEach((post, index) => {
      const fileName = `${String(index + 1).padStart(2, '0')}_${post.id}.md`;
      const filePath = path.join(targetDir, fileName);

      const content = `---
id: "${post.id}"
postType: "${post.postType}"
lens: "${post.lens}"
targetAudience: "${post.targetAudience}"
headline: "${post.headline}"
actionType: "${post.actionType}"
actionUrl: "${post.actionUrl}"
citationLink: "${post.citationLink}"
location: "${post.geotarget.location}"
region: "${post.geotarget.region}"
lat: ${post.geotarget.coordinates.lat}
lng: ${post.geotarget.coordinates.lng}
phone: "${post.napConsistency.phone}"
tags: ${JSON.stringify(post.tags)}
generatedAt: "${new Date().toISOString()}"
---

# ${post.headline}

**Service Area:** ${post.geotarget.location} (${post.geotarget.serviceTag})  
**Call to Action:** [${post.actionType}](${post.actionUrl})  
**Reference Case Study:** [${post.citationLink}](${post.citationLink})  
**Contact / NAP:** ${post.napConsistency.businessName} | ${post.napConsistency.phone} | ${post.napConsistency.city}, ${post.napConsistency.province}

---

### Google Business Profile Post Text (Copy & Paste):

${post.body}

---

### Local SEO & Geotargeting Attribution:
- **NAP Verified:** ${post.napConsistency.businessName}, ${post.napConsistency.city}, ${post.napConsistency.province}, ${post.napConsistency.country} (${post.napConsistency.phone})
- **Map Coordinates:** \`${post.geotarget.coordinates.lat}, ${post.geotarget.coordinates.lng}\`
- **Recommended Photo Asset:** Screenshot of architecture diagram or voice dispatch latency waveform
`;

      fs.writeFileSync(filePath, content, 'utf8');
      savedFiles.push(filePath);
    });

    // Write batch manifest
    const manifestPath = path.join(targetDir, 'latest_gbp_batch.json');
    const manifest = {
      generatedAt: new Date().toISOString(),
      totalPosts: posts.length,
      publisher: 'LumiLore Autonomous GBP Publisher',
      persona: this.persona.author,
      serviceAreas: this.serviceAreas.map(s => s.name),
      posts: posts.map(p => ({
        id: p.id,
        headline: p.headline,
        lens: p.lens,
        location: p.geotarget.location,
        actionUrl: p.actionUrl,
        tags: p.tags
      }))
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    return {
      manifestPath,
      savedFiles,
      posts
    };
  }
}

export default GBPPublisher;
