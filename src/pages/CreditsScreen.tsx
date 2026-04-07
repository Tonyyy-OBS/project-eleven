import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Atom } from 'lucide-react';

const TEAM = [
  { name: 'Rodrigo Yamaguchi', role: 'Desenvolvedor' },
  { name: 'Antony Conelian', role: 'Desenvolvedor' },
  { name: 'Felipe Tozadore', role: 'Desenvolvedor' },
  { name: 'Miguel Carvalho', role: 'Desenvolvedor' },
  { name: 'Lucas Sales', role: 'Desenvolvedor' },
];

export default function CreditsScreen() {
  const navigate = useNavigate();

  return (
    <motion.div className="fixed inset-0 z-10 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card mx-3 mt-3 mb-2 px-4 py-3 flex items-center gap-3 rounded-2xl flex-shrink-0">
        <button onClick={() => navigate('/hub')} className="bg-secondary/60 text-foreground px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-border/30 hover:bg-secondary transition-colors">
          <ArrowLeft size={14} />
        </button>
        <h1 className="font-display text-base text-foreground flex-1 text-center">Créditos</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <motion.div className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-6"
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
          <motion.div className="w-20 h-20 rounded-2xl avatar-stage flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Atom size={36} className="text-primary" />
          </motion.div>

          <div>
            <h2 className="font-display text-2xl text-foreground mb-1">Universos Atômicos</h2>
            <p className="text-muted-foreground text-sm">Projeto educacional sobre química, memória e progressão visual.</p>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users size={16} className="text-primary" />
              <h3 className="font-display text-sm text-primary">Grupo 9 B</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {TEAM.map((member, i) => (
                <motion.div key={member.name} className="glass-card px-4 py-3 flex items-center gap-3 border border-border/30"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.08 }}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-display text-sm text-primary">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-foreground">{member.name}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span>Feito com dedicação</span>
            <Heart size={12} className="text-destructive fill-destructive" />
            <span>para aprender química</span>
          </div>
          <p className="text-[0.6rem] text-muted-foreground/60">© 2025 Universos Atômicos</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
