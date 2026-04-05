let ctx: AudioContext | null = null;

const init = () => {
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
  }
};

const tone = (f: number, d: number, t: OscillatorType = 'sine', v = 0.18, dl = 0) => {
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = t; o.frequency.setValueAtTime(f, ctx.currentTime + dl);
    g.gain.setValueAtTime(0, ctx.currentTime + dl);
    g.gain.linearRampToValueAtTime(v, ctx.currentTime + dl + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dl + d);
    o.start(ctx.currentTime + dl); o.stop(ctx.currentTime + dl + d + 0.01);
  } catch {}
};

type Note = { f: number; d: number; t?: OscillatorType; v?: number; dl?: number };
const mel = (ns: Note[]) => ns.forEach(n => tone(n.f, n.d, n.t || 'sine', n.v || 0.18, n.dl || 0));

export const SFX = {
  init,
  click() { init(); tone(520, 0.05, 'sine', 0.1); },
  flip() { init(); tone(380, 0.06, 'triangle', 0.12); },
  match() { init(); mel([{ f: 523, d: 0.1 }, { f: 659, d: 0.1, dl: 0.1 }, { f: 784, d: 0.16, dl: 0.2 }]); },
  error() { init(); tone(200, 0.2, 'sawtooth', 0.14); },
  combo(c: number) { init(); const b = 400 + c * 60; mel([{ f: b, d: 0.07 }, { f: b * 1.25, d: 0.1, dl: 0.08 }, { f: b * 1.5, d: 0.12, dl: 0.18 }]); },
  phase() { init(); mel([{ f: 523, d: 0.1 }, { f: 659, d: 0.1, dl: 0.12 }, { f: 784, d: 0.1, dl: 0.24 }, { f: 1047, d: 0.3, dl: 0.37 }]); },
  levelup() { init(); mel([{ f: 392, d: 0.1, t: 'square', v: 0.16 }, { f: 523, d: 0.1, t: 'square', v: 0.16, dl: 0.12 }, { f: 659, d: 0.1, t: 'square', v: 0.16, dl: 0.24 }, { f: 784, d: 0.1, t: 'square', v: 0.18, dl: 0.36 }, { f: 1047, d: 0.3, t: 'square', v: 0.2, dl: 0.48 }]); },
  correct() { init(); mel([{ f: 659, d: 0.08 }, { f: 880, d: 0.14, dl: 0.09 }]); },
  wrong() { init(); mel([{ f: 280, d: 0.12, t: 'sawtooth' }, { f: 220, d: 0.16, t: 'sawtooth', dl: 0.13 }]); },
  buy() { init(); mel([{ f: 523, d: 0.07 }, { f: 659, d: 0.1, dl: 0.08 }]); },
  achieve() { init(); mel([{ f: 784, d: 0.07, t: 'square' }, { f: 988, d: 0.07, t: 'square', dl: 0.09 }, { f: 1047, d: 0.09, t: 'square', dl: 0.18 }, { f: 1319, d: 0.28, t: 'square', dl: 0.28 }]); },
};
