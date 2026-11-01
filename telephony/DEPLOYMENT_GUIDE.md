# LumiLore Technologies — Telephony Deployment Guide
## Amazon Connect ca-central-1 (`lumilore-voice.my.connect.aws`)

This guide provides **exact, click-by-click instructions** in the **AWS Console** and **Amazon Connect Admin Portal** for deploying your Conversational AI Voice Agent on **`+1-437-786-5864`**.

---

### Phase A: Link Your Lambda Function in AWS Management Console (1 Minute)

> **Goal:** Grant your Amazon Connect instance permission to invoke your backend Lambda function.

1. Open your browser and log into the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top navigation search bar, ensure your region is set to **Canada (Central) `ca-central-1`**.
3. Search for **Amazon Connect** and click on it.
4. In the list of instances, click on your instance alias: **`lumilore-voice`**.
5. In the left-hand navigation menu under the instance overview, click **Contact flows**.
6. Scroll down to the **AWS Lambda** section:
   - In the **Select function** dropdown, choose:  
     `lumilore-backend-LumiLoreFunction-JCxBNzZ7VJCO` (or `LumiLoreFunction`).
   - Click the **+ Add Lambda Function** button.
   - ✅ *Status confirmation:* You will see the Lambda ARN appear in the table with state *Active*. AWS has now automatically added the invocation permissions!

---

### Phase B: Import & Publish the Conversational Flow in Amazon Connect (2 Minutes)

> **Goal:** Load the natural speech contact flow into Amazon Connect's flow designer.

1. At the top of your Amazon Connect instance overview page in the AWS Console, click the **Log in for emergency access** button (or navigate to `https://lumilore-voice.my.connect.aws`).
2. Log into the Amazon Connect Admin Workspace.
3. In the black sidebar on the left:
   - Hover over the **Routing** icon (the split arrows icon: `🔀`).
   - Click on **Flows** (or *Contact flows*).
4. In the top-right corner, click the blue **Create flow** (or *Create contact flow*) button.
5. In the Flow Designer canvas:
   - Look at the top-right toolbar next to the *Save* button. Click the **small dropdown arrow (⌄) next to Save**.
   - Click **Import flow**.
   - In the pop-up modal, click **Select file**.
   - Browse to your local project directory and select:  
     `telephony/contact-flows/LumiLore_Unified_Voice_Concierge_Flow.json`.
   - Click **Import**.
6. The entire visual flow will immediately populate on your canvas!
   - *Flow Name:* `LumiLore_Unified_Voice_Concierge_Flow`
   - *Voice Block:* Configured for Amazon Polly Neural `Liam` (`en-CA`).
   - *Lambda Block:* Automatically wired to your Lambda function.
7. Click **Save** in the top right.
8. Click **Publish** (blue button).
   - ✅ *Status confirmation:* A green banner will confirm: *"Flow published successfully."*

---

### Phase C: Claim & Bind Your Canadian Inbound Number (1 Minute)

> **Goal:** Connect your Canadian phone number `+1-437-786-5864` to the published voice flow.

1. In the Amazon Connect left sidebar, hover over the **Channels** icon (phone icon: `📞`).
2. Click **Phone numbers**.
3. Check your phone number inventory:
   - **If your number is already claimed:**  
     Click directly on the phone number link in the list.
   - **If claiming a new number:**  
     Click **Claim a number** in the top-right corner.  
     - Select **DID (Direct Inward Dialing)**.
     - Country: **Canada (+1)**.
     - In the number selector, locate or pick your target number (e.g., `(437) 786-5864` or available GTA `437`/`647` DID).
4. In the phone number settings panel:
   - **Flow / IVR:** Click the dropdown and select:  
     **`LumiLore_Unified_Voice_Concierge_Flow`**.
   - **Description:** Type `LumiLore Unified AI Voice Concierge`.
5. Click **Save** at the bottom of the screen.
   - ✅ *Status confirmation:* Your Canadian carrier number is now live and wired to the AI Voice Agent!

---

### Phase D: Live Verification & Testing (1 Minute)

1. Pick up your mobile phone and dial the number: **`+1-437-786-5864`**.
2. **Test Scenario 1 (Natural Greeting):**
   - Listen to the warm Canadian Polly Neural voice greet you:  
     *"Hello, and thank you for calling LumiLore Technologies. I'm the AI Executive Assistant to Principal Systems Architect Saad Sayed and Operations Lead Arfa Sayeed. How can I help you today?"*
3. **Test Scenario 2 (Natural Spoken Triage):**
   - Speak naturally: *"We're an HVAC contractor in Markham and we keep missing customer calls on weekends."*  
     -> The AI will immediately acknowledge after-hours phone leaks and probe how many technicians you have.
   - Or speak: *"We're spending too much on AWS and want to modernize our serverless architecture."*  
     -> The AI will probe your current tech stack and offer a 20-minute architecture scoping session with Saad Sayed.
4. **Test Scenario 3 (Live Calendar Booking):**
   - The AI will offer available slots: *"Saad has availability tomorrow at 11:00 AM Eastern or Thursday at 2:30 PM Eastern. Which of those works better?"*
   - Say: *"Tomorrow at 11 works great."*
   - The AI locks the appointment, gives you verbal confirmation, and creates the Google Meet coordinates!
5. **Check Your Inbox:**
   - An immediate high-priority briefing email will arrive at **`info@lumilore.ca`** with the caller ID, full conversation transcript, discovery summary, and calendar link.

---

### AWS CLI Alternative (For Automated Scripting)

If you prefer running terminal commands via AWS CLI instead of the console:

```bash
# 1. Add Lambda permission to Amazon Connect
aws lambda add-permission \
  --function-name "lumilore-backend-LumiLoreFunction-JCxBNzZ7VJCO" \
  --statement-id "AmazonConnectTelephonyExecution-LumiLoreVoice" \
  --action "lambda:InvokeFunction" \
  --principal "connect.amazonaws.com" \
  --source-arn "arn:aws:connect:ca-central-1:303238378489:instance/lumilore-voice" \
  --region ca-central-1

# 2. Create the Contact Flow
aws connect create-contact-flow \
  --instance-id "lumilore-voice" \
  --name "LumiLore_Unified_Voice_Concierge_Flow" \
  --type "CONTACT_FLOW" \
  --description "Autonomous AI Executive Concierge with Live Google Calendar Booking" \
  --content file://telephony/contact-flows/LumiLore_Unified_Voice_Concierge_Flow.json \
  --region ca-central-1
```
