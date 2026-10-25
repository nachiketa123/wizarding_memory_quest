/* ============================================================================
 * 3. SYNTHESIZED SOUND ENGINE (Web Audio API — Magical Spells & Toilet Flush!)
 * ============================================================================ */
class WizardingSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playChime(type = 'sparkle') {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'sparkle') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.08, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.36);
        });
      } else if (type === 'success') {
        // Hedwig-inspired magical arpeggio
        const notes = [493.88, 659.25, 783.99, 739.99, 659.25, 987.77, 880.0];
        const times = [0, 0.14, 0.28, 0.38, 0.5, 0.68, 0.9];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + times[i]);
          gain.gain.setValueAtTime(0.14, now + times[i]);
          gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + times[i]);
          osc.stop(now + times[i] + 0.46);
        });
      } else if (type === 'error') {
        // Descending dark spell buzz
        const notes = [311.13, 277.18, 233.08];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.14);
          gain.gain.setValueAtTime(0.09, now + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.14);
          osc.stop(now + i * 0.14 + 0.32);
        });
      }
    } catch {
      // Ignore audio errors on restricted devices
    }
  }

  /**
   * Realistic 2.8-second Western Toilet Flush sound effect synthesized via Web Audio API:
   * - Stage 1 (0.0s - 0.5s): Lever clank & sudden rushing water burst (bandpass white noise)
   * - Stage 2 (0.5s - 2.1s): Swirling vortex drain (sweeping resonant filter + low water rumble)
   * - Stage 3 (2.1s - 2.8s): Gurgle & tank refill hiss
   */
  playToiletFlush() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 2.8;

      // 1. Create white noise buffer for rushing water
      const bufferSize = this.ctx.sampleRate * duration;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter that sweeps up then spirals down like flushing water
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.2, now);
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(180, now + 2.1);
      filter.frequency.linearRampToValueAtTime(650, now + 2.75);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.25);
      noiseGain.gain.setValueAtTime(0.26, now + 1.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 2.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);

      // 2. Add swirling water glug-glug LFO oscillator
      const glugOsc = this.ctx.createOscillator();
      const glugGain = this.ctx.createGain();
      glugOsc.type = 'sine';
      glugOsc.frequency.setValueAtTime(140, now + 0.3);
      glugOsc.frequency.exponentialRampToValueAtTime(55, now + 2.2);

      glugGain.gain.setValueAtTime(0.001, now);
      glugGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
      glugGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

      glugOsc.connect(glugGain);
      glugGain.connect(this.ctx.destination);
      glugOsc.start(now);
      glugOsc.stop(now + 2.35);
    } catch {
      // Ignore if audio is blocked
    }
  }
}

const soundEngine = new WizardingSoundEngine();
export default soundEngine;