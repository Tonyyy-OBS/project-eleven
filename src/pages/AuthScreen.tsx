import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { SFX } from '@/lib/sounds';
import AtomSpinner from '@/components/AtomSpinner';

export default function AuthScreen() {
  const { login, register } = useGame();
  const [tab, setTab] = useState<'login' | 'reg'>('login');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const pwdStrength = () => {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthColors = ['', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#10b981'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    SFX.init();
    setError('');
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 200));
      if (tab === 'login') {
        if (!email || !pwd) throw new Error('Preencha email e senha.');
        login(email, pwd);
      } else {
        if (!name || !email || !pwd) throw new Error('Preencha todos os campos.');
        if (name.length < 3) throw new Error('Nome deve ter pelo menos 3 caracteres.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email inválido.');
        if (pwd.length < 6) throw new Error('Senha mínima: 6 caracteres.');
        register(name, email, pwd);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex w-full min-h-screen">
        {/* Left deco - hidden on mobile */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, hsl(240 60% 3%), hsl(240 60% 6%))' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.11), transparent 68%)' }} />
          <AtomSpinner size={200} />
          <h2 className="font-display text-2xl text-center leading-relaxed z-10">
            Aprenda.<br />Memorize.<br />
            <span className="text-primary text-glow-cyan">Domine.</span>
          </h2>
        </div>

        {/* Auth panel */}
        <div className="w-full md:w-[420px] md:min-w-[320px] flex flex-col gap-5 p-8 md:p-10 overflow-y-auto md:border-l border-border"
          style={{ background: 'rgba(0,0,0,0.38)' }}>
          <div className="font-display text-xl font-black text-primary text-glow-cyan text-center">
            ⚛️ UNIVERSO ATÔMICO
          </div>

          <div className="grid grid-cols-2 gap-1 surface-1 rounded-md p-1">
            <button
              onClick={() => { SFX.click(); setTab('login'); setError(''); }}
              className={`py-2.5 rounded-md font-extrabold text-sm transition-all ${tab === 'login' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >Entrar</button>
            <button
              onClick={() => { SFX.click(); setTab('reg'); setError(''); }}
              className={`py-2.5 rounded-md font-extrabold text-sm transition-all ${tab === 'reg' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >Criar Conta</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {tab === 'reg' && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">🎮 Nome de Jogador</label>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full surface-1 border border-border rounded-md px-4 py-3 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1)] transition-all"
                    placeholder="SeuNick" maxLength={20}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">📧 Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full surface-1 border border-border rounded-md px-4 py-3 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1)] transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">
                🔒 Senha {tab === 'reg' && <span className="text-muted-foreground font-normal">(mín. 6)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd} onChange={e => setPwd(e.target.value)}
                  className="w-full surface-1 border border-border rounded-md px-4 py-3 pr-12 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,229,255,0.1)] transition-all"
                  placeholder={tab === 'reg' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {tab === 'reg' && pwd.length > 0 && (
                <div className="h-1 surface-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, pwdStrength() * 20)}%`, background: strengthColors[Math.min(pwdStrength(), 5)] }} />
                </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive rounded-md px-3 py-2 text-destructive text-sm font-semibold"
                >⚠️ {error}</motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit" disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-extrabold py-3.5 rounded-md glow-cyan hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-35 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? <span className="animate-spin inline-block">⟳</span> : tab === 'login' ? 'ENTRAR ⚡' : 'CRIAR CONTA 🚀'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
