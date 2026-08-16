/** Synthesised startup chime (no audio file needed). Safe to call anywhere. */
export function playBootChime(volume = 0.22) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return () => undefined;
    const ctx = new Ctx();
    void ctx.resume?.();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const t0 = ctx.currentTime + 0.02;
    const dur = 3.4;
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(volume, t0 + 0.18);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    // Warm F#-major-ish chord, the classic Mac startup colour.
    const partials = [92.5, 185, 277.2, 369.9, 554.4, 739.9];
    partials.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 2 ? "triangle" : "sine";
      osc.frequency.value = freq;
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * 4;
      gain.gain.value = 0.9 / (i + 1.4);
      osc.connect(gain).connect(master);
      osc.start(t0);
      osc.stop(t0 + dur);
    });

    // Soft shimmer tail.
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    noise.buffer = buf;
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.value = 0.12;
    noise.connect(nf).connect(ng).connect(master);
    noise.start(t0);

    return () => {
      try {
        void ctx.close();
      } catch {
        /* ignore */
      }
    };
  } catch {
    return () => undefined;
  }
}

/** Boot loading sound — continuous soft tone during boot */
export function playBootLoadingSound(duration: number, volume = 0.3) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return () => undefined;
    const ctx = new Ctx();
    void ctx.resume?.();

    const master = ctx.createGain();
    master.connect(ctx.destination);

    const t0 = ctx.currentTime;
    const dur = Math.max(duration / 1000, 0.5);
    
    // Fade in, hold, fade out
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(volume, t0 + 0.2);
    master.gain.setValueAtTime(volume, t0 + Math.max(dur - 0.3, t0 + 0.2));
    master.gain.linearRampToValueAtTime(0, t0 + dur);

    // Main oscillator — soft low tone
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, t0);
    osc.frequency.linearRampToValueAtTime(120, t0 + dur);
    osc.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur);

    // Add subtle harmonics for richness
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(160, t0);
    osc2.frequency.linearRampToValueAtTime(240, t0 + dur);
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.3;
    osc2.connect(gain2).connect(master);
    osc2.start(t0);
    osc2.stop(t0 + dur);

    return () => {
      try {
        void ctx.close();
      } catch {
        /* ignore */
      }
    };
  } catch (e) {
    console.error("Boot sound error:", e);
    return () => undefined;
  }
}
