let ctx: AudioContext | null = null;

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** "Tshhh" grill sizzle for wrong answers */
export function playGrill(): void {
  try {
    const ac = audio();
    const now = ac.currentTime;
    const duration = 0.55;

    // White noise buffer
    const bufSize = Math.floor(ac.sampleRate * duration);
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ac.createBufferSource();
    src.buffer = buf;

    // High-pass to get that sizzle hiss
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2800;

    // Band-pass on top for steam character
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 4500;
    bp.Q.value = 0.6;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.018);   // fast attack
    gain.gain.setValueAtTime(0.9, now + 0.06);             // hold
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // decay

    src.connect(hp);
    hp.connect(bp);
    bp.connect(gain);
    gain.connect(ac.destination);
    src.start(now);
    src.stop(now + duration);
  } catch {
    // AudioContext blocked or unavailable — silent fail
  }
}

/** Clapping applause for correct answers */
export function playClap(): void {
  try {
    const ac = audio();
    const now = ac.currentTime;
    const clapCount = 4;
    const gap = 0.13;

    for (let i = 0; i < clapCount; i++) {
      const t = now + i * gap;
      const clapDur = 0.07;

      const bufSize = Math.floor(ac.sampleRate * clapDur);
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) data[j] = Math.random() * 2 - 1;

      const src = ac.createBufferSource();
      src.buffer = buf;

      // Shaped noise that sounds like a hand-clap slap
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1100 + i * 80; // slight pitch variation per clap
      bp.Q.value = 0.7;

      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 700;

      const gain = ac.createGain();
      const vol = 0.55 + (i === clapCount - 1 ? 0.15 : 0); // last clap slightly louder
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, t + clapDur);

      src.connect(hp);
      hp.connect(bp);
      bp.connect(gain);
      gain.connect(ac.destination);
      src.start(t);
      src.stop(t + clapDur + 0.01);
    }
  } catch {
    // silent fail
  }
}
