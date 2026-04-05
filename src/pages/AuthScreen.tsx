import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { SFX } from '@/lib/sounds';

export default function AuthScreen() {
  const { login, register } = useGame();
  const [tab, setTab] = useState<'login' | 'reg'>('login');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    SFX.init();
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 200));
      if (tab === 'login') {
        if (!name || !pwd) throw new Error('Preencha nome e senha.');
        login(name, pwd);
      } else {
        if (!name || !pwd) throw new Error('Preencha todos os campos.');
        if (name.trim().length < 3) throw new Error('Nome deve ter pelo menos 3 caracteres.');
        if (pwd.length < 4) throw new Error('Senha mínima: 4 caracteres.');
        register(name, pwd);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center p-4"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card w-full max-w-md p-8 flex flex-col items-center gap-5"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 20 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl animate-float">⚛️</div>
          <h1 className="font-display text-2xl text-primary text-center">Universos Atômicos</h1>
          <p className="text-muted-foreground text-sm text-center">Aprenda, jogue e domine a tabela periódica!</p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-secondary/50 w-full">
          <button onClick={() => { SFX.click(); setTab('login'); setError(''); }}
            className={`py-2.5 rounded-lg font-bold text-sm transition-all ${tab === 'login' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
            Entrar
          </button>
          <button onClick={() => { SFX.click(); setTab('reg'); setError(''); }}
            className={`py-2.5 rounded-lg font-bold text-sm transition-all ${tab === 'reg' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1.5">🎮 Nome de Jogador</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="SeuNick" maxLength={20}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1.5">
              🔒 Senha {tab === 'reg' && <span className="font-normal">(mín. 4)</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={pwd} onChange={e => setPwd(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-12 text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Sua senha"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm hover:text-foreground transition-colors">
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2.5 text-destructive text-sm font-semibold"
              >⚠️ {error}</motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-spin inline-block">⟳</span> : tab === 'login' ? 'ENTRAR ⚡' : 'CRIAR CONTA 🚀'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
