export default function AtomSpinner({ size = 140 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="text-4xl z-10 animate-float">⚛️</span>
      <div className="absolute border border-primary/20 rounded-full animate-orb1 flex items-center justify-center"
        style={{ width: size * 0.79, height: size * 0.31 }}>
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary glow-cyan" />
      </div>
      <div className="absolute border border-primary/20 rounded-full animate-orb2 flex items-center justify-center"
        style={{ width: size * 0.63, height: size * 0.5 }}>
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary glow-cyan" />
      </div>
      <div className="absolute border border-primary/20 rounded-full animate-orb3 flex items-center justify-center"
        style={{ width: size * 0.43, height: size * 0.79 }}>
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary glow-cyan" />
      </div>
    </div>
  );
}
