# Zero-Trust Credential & Technical Intake Specification

**Platform:** LumiLore Technologies // PIPEDA Sovereign Cloud (ca-central-1)

> [!IMPORTANT]
> Never send plain text passwords via unencrypted email. Use our KMS-encrypted client portal.

### 1. Cloud & Hosting Delegation (Choose One)
- [ ] **Option A (AWS):** Cross-account IAM Role with `LumiLoreDeploymentRole` policy.
- [ ] **Option B (Cloudflare / DNS):** Add `dns-admin@lumilore.ca` as scoped DNS administrator.

### 2. Inbound Telephony & Carrier Forwarding
- [ ] **Target Demo / Inbound Number:** `437-786-5864` (Amazon Connect ca-central-1).
- [ ] **Forwarding Rule:** Conditional forwarding on busy / unanswered after 3 rings.
- [ ] **Emergency Bypass Tech Number:** Mobile number for high-priority SMS dispatch alerts.

### 3. CRM & Calendar Integration
- [ ] **Google Calendar / Workspace:** Service Account delegation for real-time freebusy lookup.
- [ ] **Trade CRM (ServiceTitan / Jobber / Housecall Pro):** Scoped API Token with job creation permissions.

---
*Verified by Agent 14 (PIPEDA Guardian) & Agent 17 (Delivery Shepherd)*