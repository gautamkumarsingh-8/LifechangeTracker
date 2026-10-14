/**
 * Web Audio API Sound Synthesizer for Life Change Taker
 * Completely self-contained, creates organic harmonic tones with smooth attack/decay.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Soft, subtle click sound for interactive buttons and switches.
 */
export function playClickSound(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Ignore audio context restriction errors
  }
}

/**
 * Ascending harmonious chime when a day is completed.
 */
export function playSuccessSound(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);

      const noteStart = now + index * 0.07;
      const noteDuration = 0.35;

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.08, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
    });
  } catch {
    // Ignore audio context restriction errors
  }
}

/**
 * Grand victorious fanfare chord when all challenge days are completed.
 */
export function playFanfareSound(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Sequential fanfare brass chords
    const chord1 = [523.25, 659.25, 783.99]; // C Major
    const chord2 = [587.33, 739.99, 880.00]; // D Major
    const chord3 = [659.25, 783.99, 1046.5, 1318.51]; // C Major high with octave

    const sequence = [
      { notes: chord1, start: 0, duration: 0.22, vol: 0.06 },
      { notes: chord2, start: 0.24, duration: 0.22, vol: 0.07 },
      { notes: chord3, start: 0.48, duration: 0.8, vol: 0.09 },
    ];

    sequence.forEach(({ notes, start, duration, vol }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        const startTime = now + start;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    });
  } catch {
    // Ignore audio context restriction errors
  }
}
