export const COLORS = ['#4A90D9','#E25C5C','#5CB85C','#9B59E2','#E2C15C','#00E5FF','#E25CE2','#FF8C40'];

export const HAIR = [
  { n: 'Clássico', lv: 1 },
  { n: 'Moderno', lv: 1 },
  { n: 'Punk', lv: 3 },
  { n: 'Afro', lv: 5 },
  { n: 'Espacial', lv: 7 },
];
export const OUTFIT = [
  { n: 'Básico', lv: 1 },
  { n: 'Esportivo', lv: 1 },
  { n: 'Jaleco', lv: 4 },
  { n: 'Ninja', lv: 6 },
  { n: 'Astronauta', lv: 8 },
];
export const EYES = [
  { n: 'Normal', lv: 1 },
  { n: 'Alegre', lv: 1 },
  { n: 'Sonolento', lv: 1 },
  { n: 'Estrelas', lv: 5 },
];

export const HAIR_ICO = ['👦','✂️','🤘','🌟','🤖'];
export const OUTFIT_ICO = ['👕','⚡','🔬','🥷','🚀'];
export const EYES_ICO = ['👀','😊','😴','✨'];

export const TITLES = ['Átomo','Elétron','Próton','Nêutron','Cientista','Doutor','Expert','Mestre','Lendário','Atômico'];
export const QUIZ_UNLOCK = 5;
export const xpFor = (lv: number) => 80 + (lv - 1) * 45;

export const LEVELS = [
  { cols: 4, rows: 3, time: 90 },
  { cols: 4, rows: 4, time: 100 },
  { cols: 4, rows: 4, time: 85 },
  { cols: 5, rows: 4, time: 100 },
  { cols: 5, rows: 4, time: 88 },
  { cols: 6, rows: 4, time: 110 },
  { cols: 6, rows: 5, time: 110 },
  { cols: 6, rows: 5, time: 100 },
  { cols: 6, rows: 6, time: 120 },
  { cols: 7, rows: 6, time: 120 },
];

export const EMOJIS = ['⚛️','🔬','🧬','🧪','🔭','💡','⚡','🌊','🔥','🌙','⭐','🪐','🌌','🧲','💎','🦠','🔋','🧫','🌡️','⚗️','☄️','🌈','🔩','🔮','🌐','🌀','💫','🎯','🔑','📡'];

export const SPECIALS = [
  { k: 'time', e: '⏱️', l: '+15s de tempo!' },
  { k: 'reveal', e: '👁️', l: 'Revela todas!' },
  { k: 'shuffle', e: '🔀', l: 'Embaralha!' },
] as const;

export type SpecialKey = typeof SPECIALS[number]['k'];

export const SHOP_ITEMS = [
  { id: 1, cat: 'hair' as const, idx: 0, n: 'Clássico', p: 0, ico: '👦', lv: 1 },
  { id: 2, cat: 'hair' as const, idx: 1, n: 'Moderno', p: 120, ico: '✂️', lv: 1 },
  { id: 3, cat: 'hair' as const, idx: 2, n: 'Punk', p: 250, ico: '🤘', lv: 3 },
  { id: 4, cat: 'hair' as const, idx: 3, n: 'Afro', p: 380, ico: '🌟', lv: 5 },
  { id: 5, cat: 'hair' as const, idx: 4, n: 'Espacial', p: 600, ico: '🤖', lv: 7 },
  { id: 6, cat: 'outfit' as const, idx: 0, n: 'Básico', p: 0, ico: '👕', lv: 1 },
  { id: 7, cat: 'outfit' as const, idx: 1, n: 'Esportivo', p: 150, ico: '⚡', lv: 1 },
  { id: 8, cat: 'outfit' as const, idx: 2, n: 'Jaleco', p: 320, ico: '🔬', lv: 4 },
  { id: 9, cat: 'outfit' as const, idx: 3, n: 'Ninja', p: 450, ico: '🥷', lv: 6 },
  { id: 10, cat: 'outfit' as const, idx: 4, n: 'Astronauta', p: 720, ico: '🚀', lv: 8 },
  { id: 11, cat: 'color' as const, idx: 0, n: 'Azul Clássico', p: 0, ico: '🔵', lv: 1 },
  { id: 12, cat: 'color' as const, idx: 1, n: 'Vermelho', p: 80, ico: '🔴', lv: 1 },
  { id: 13, cat: 'color' as const, idx: 2, n: 'Verde', p: 80, ico: '🟢', lv: 1 },
  { id: 14, cat: 'color' as const, idx: 3, n: 'Roxo', p: 150, ico: '🟣', lv: 2 },
  { id: 15, cat: 'color' as const, idx: 4, n: 'Dourado', p: 400, ico: '🟡', lv: 5 },
  { id: 16, cat: 'color' as const, idx: 5, n: 'Ciano Neon', p: 400, ico: '🩵', lv: 5 },
  { id: 17, cat: 'color' as const, idx: 6, n: 'Rosa Galaxy', p: 500, ico: '🩷', lv: 6 },
  { id: 18, cat: 'color' as const, idx: 7, n: 'Laranja Fogo', p: 500, ico: '🟠', lv: 6 },
];

export const ACHIEVEMENTS = [
  { k: 'first_game', ico: '🎮', n: 'Primeiro Jogo', d: 'Complete sua primeira fase' },
  { k: 'no_errors', ico: '🎯', n: 'Perfeição', d: 'Fase concluída sem erros' },
  { k: 'speed_demon', ico: '⚡', n: 'Relâmpago', d: 'Fase em menos de 30 segundos' },
  { k: 'combo_5', ico: '🔥', n: 'Combo x5', d: '5 acertos consecutivos' },
  { k: 'level_5', ico: '⭐', n: 'Cientista Jr.', d: 'Alcance o Nível 5' },
  { k: 'level_10', ico: '🏆', n: 'Mestre Atômico', d: 'Alcance o Nível 10' },
  { k: 'quiz_perfect', ico: '🧪', n: '100% no Quiz', d: 'Acerte todas as questões' },
  { k: 'rich', ico: '💰', n: 'Magnata', d: 'Acumule 500+ moedas de uma vez' },
  { k: 'shopper', ico: '🛒', n: 'Comprador', d: 'Compre 3 itens na loja' },
  { k: 'daily_done', ico: '📅', n: 'Dedicado', d: 'Complete 3 missões diárias' },
];

export const MISSIONS = [
  { k: 'play_3', l: 'Jogue 3 partidas', t: 3, c: 50, x: 30 },
  { k: 'match_20', l: 'Acerte 20 pares', t: 20, c: 80, x: 50 },
  { k: 'complete', l: 'Complete 1 fase', t: 1, c: 30, x: 20 },
  { k: 'no_err', l: 'Fase perfeita (sem err)', t: 1, c: 100, x: 60 },
  { k: 'combo3', l: 'Faça combo de 3', t: 1, c: 60, x: 40 },
  { k: 'quiz', l: 'Termine o quiz', t: 1, c: 120, x: 80 },
  { k: 'match_10', l: '10 pares em 1 jogo', t: 10, c: 40, x: 25 },
];

export const FAKES = [
  { n: 'NeonAtom', s: 9800, lv: 12, c: 5, h: 4, o: 4, e: 1 },
  { n: 'QuantumX', s: 8750, lv: 10, c: 1, h: 2, o: 3, e: 0 },
  { n: 'ProtonPunk', s: 7600, lv: 9, c: 3, h: 3, o: 1, e: 2 },
  { n: 'ElektroZap', s: 6900, lv: 8, c: 4, h: 0, o: 2, e: 3 },
  { n: 'DarkQuasar', s: 6100, lv: 7, c: 6, h: 4, o: 0, e: 1 },
  { n: 'NucleoStar', s: 5400, lv: 6, c: 2, h: 1, o: 4, e: 0 },
  { n: 'PhotonRush', s: 4800, lv: 6, c: 7, h: 2, o: 1, e: 2 },
  { n: 'AtomoFire', s: 4100, lv: 5, c: 0, h: 3, o: 2, e: 1 },
  { n: 'CryptoNova', s: 3600, lv: 4, c: 5, h: 0, o: 3, e: 0 },
  { n: 'AlphaWave', s: 2900, lv: 4, c: 3, h: 1, o: 0, e: 3 },
];

export const QUESTIONS = [
  { t: 'Qual cientista propôs o modelo "pudim de passas"?', img: '🍮', opts: ['J.J. Thomson','Rutherford','Bohr','Dalton'], ans: 0, f: 'Thomson (1897) imaginou elétrons dentro de uma esfera positiva!' },
  { t: 'No experimento de Rutherford, qual folha foi usada?', img: '✨', opts: ['Prata','Ouro','Cobre','Alumínio'], ans: 1, f: 'A folha de ouro era fina o suficiente para partículas alfa!' },
  { t: 'Segundo Bohr, os elétrons orbitam em:', img: '🌀', opts: ['Trajetórias aleatórias','Camadas de energia fixas','Nuvens','Dentro do núcleo'], ans: 1, f: 'Bohr (1913) propôs camadas de energia quantizada!' },
  { t: 'Quem descobriu o elétron em 1897?', img: '⚡', opts: ['Dalton','Rutherford','J.J. Thomson','Schrödinger'], ans: 2, f: 'Thomson usou tubos de raios catódicos para a descoberta!' },
  { t: 'O modelo quântico descreve elétrons como:', img: '☁️', opts: ['Esferas sólidas','Órbitas circulares','Nuvens de probabilidade','Partículas fixas'], ans: 2, f: 'Schrödinger (1926) criou a equação de onda quântica!' },
  { t: 'Qual partícula NÃO fica no núcleo atômico?', img: '🔬', opts: ['Próton','Nêutron','Elétron','Quark'], ans: 2, f: 'Elétrons orbitam ao redor do núcleo!' },
  { t: 'O número atômico (Z) representa o número de:', img: '🔢', opts: ['Nêutrons','Prótons','Massa total','Elétrons+Prótons'], ans: 1, f: 'O número atômico define o elemento químico!' },
  { t: 'John Dalton descreveu os átomos como:', img: '⚫', opts: ['Com núcleo central','Esferas sólidas indivisíveis','Nuvens de elétrons','Planetas em miniatura'], ans: 1, f: 'Em 1803, Dalton imaginou átomos como bolinhas maciças!' },
  { t: 'Qual foi o primeiro modelo a propor um núcleo central?', img: '🎯', opts: ['Dalton','Thomson','Rutherford','Bohr'], ans: 2, f: 'O experimento de 1911 revelou o pequeno e denso núcleo!' },
  { t: 'A equação de Schrödinger calcula a _____ do elétron:', img: '📐', opts: ['Posição exata','Velocidade','Probabilidade de encontrá-lo','Massa'], ans: 2, f: 'Mecânica quântica: não há posição exata, apenas probabilidade!' },
];
