/**
 * Self-Verification Harness 4.2: WebVTT Synchronized Captions & Audio Player
 * Verifies WebVTT syntax, monotonic timestamps, and accessible audio player markup
 */

import assert from 'assert';
import { VoiceBriefingEngine } from '../../agents/seo-geo-agent/voice-briefing.js';

async function runTest() {
  console.log('🧪 [Self-Verification 4.2] Testing WebVTT Captions & Audio Player Component...');
  const engine = new VoiceBriefingEngine();

  const title = 'Autonomous Mechanical Trades Voice Dispatch';
  const segments = [
    'LumiLore Technologies engineers sub-800ms inbound voice dispatch.',
    'Integrating Amazon Connect directly with ServiceTitan and DynamoDB.',
    'Capturing 100% of emergency overnight service calls without hold times.'
  ];

  // Test 1: WebVTT generation
  const vtt = engine.generateWebVttCaptions({ title, segments, averageSecondsPerSegment: 3.5 });

  assert.ok(vtt.startsWith('WEBVTT'), 'Must start with WEBVTT signature');
  assert.ok(vtt.includes('00:00:00.000 --> 00:00:03.500'), 'First cue timestamp must match calculation');
  assert.ok(vtt.includes('00:00:03.700 --> 00:00:07.200'), 'Second cue timestamp must include gap and valid progression');
  console.log('  ✓ Verified WebVTT header and monotonic timecode formatting');

  // Test 2: Accessible Audio Player markup
  const playerHtml = engine.renderAudioPlayerSnippet({
    audioSrc: '/assets/audio/briefing-trades.mp3',
    vttSrc: '/assets/audio/briefing-trades.vtt',
    title
  });

  assert.ok(playerHtml.includes('<audio controls'), 'Must render audio controls element');
  assert.ok(playerHtml.includes('<track kind="captions"'), 'Must render accessible captions track element');
  assert.ok(playerHtml.includes('srclang="en"'), 'Must specify srclang="en"');
  assert.ok(playerHtml.includes('STUDIO NEURAL AUDIO BRIEFING'), 'Must render VoiceStudio branding');
  console.log('  ✓ Verified accessible HTML5 audio player markup with embedded captions track');

  console.log('✅ [Self-Verification 4.2 PASSED] 100% assertions verified.\n');
}

runTest().catch(err => {
  console.error('❌ [Self-Verification 4.2 FAILED]', err);
  process.exit(1);
});

