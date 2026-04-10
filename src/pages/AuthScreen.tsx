import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { SFX } from '@/lib/sounds';
import { Atom, Eye, EyeOff, ShieldCheck, Mail, User } from 'lucide-react';

export default function AuthScreen() {
  const { login, register } = useGame();
  const [tab, setTab] = useState<'login' | 'reg'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      if (tab === 'login') {
        if (!email || !pwd) throw new Error('Preencha email e senha.');
        await login(email, pwd);
      } else {
        if (!name || !email || !pwd) throw new Error('Preencha todos os campos.');
        if (name.trim().length < 3) throw new Error('Nome deve ter pelo menos 3 caracteres.');
        if (pwd.length < 6) throw new Error('Senha mínima: 6 caracteres.');
        await register(name, email, pwd);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
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
        initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl avatar-stage flex items-center justify-center animate-pulse-glow">
            <Atom size={30} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Universos Atômicos</h1>
            <p className="text-muted-foreground text-sm mt-1">Jogo da memória, quiz científico e avatar em uma experiência interativa.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-secondary/60 border border-border w-full">
          <button
            onClick={() => { SFX.click(); setTab('login'); setError(''); }}
            className={`py-3 rounded-xl font-bold text-sm transition-all ${tab === 'login' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { SFX.click(); setTab('reg'); setError(''); }}
            className={`py-3 rounded-xl font-bold text-sm transition-all ${tab === 'reg' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {tab === 'reg' && (
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1.5">Nome do jogador</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Seu nome"
                  maxLength={20}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1.5">
              Senha {tab === 'reg' && <span className="font-normal">(mín. 6 caracteres)</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-12 text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-destructive text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="btn-primary w-full text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? 'Processando...' : tab === 'login' ? 'Entrar no laboratório' : 'Criar conta'}
          </button>
        </form>

        <div className="status-chip flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" />
          Autenticação segura com Lovable Cloud
        </div>
      </motion.div>
    </motion.div>
  );
}
