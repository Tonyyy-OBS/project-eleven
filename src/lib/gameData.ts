// ==================== AVATAR DATA ====================

export const SKIN_TONES = ['#FDDCB5','#E8B88A','#C4956A','#A67B5B','#8B6142','#6B4226','#3D2415'];

export const BODY_TYPES = [
  { id: 0, n: 'Padrão', free: true },
  { id: 1, n: 'Magro', free: true },
  { id: 2, n: 'Robusto', free: true },
  { id: 3, n: 'Alto', free: true },
  { id: 4, n: 'Cadeirante', free: true },
  { id: 5, n: 'Cadeirante 2', free: true },
];

export interface AvatarItem {
  id: number;
  n: string;
  free: boolean;
  price?: number;
  gems?: number;
  emoji: string;
}

export const HAIR_STYLES: AvatarItem[] = [
  { id: 0, n: 'Nenhum', free: true, emoji: '🚫' },
  { id: 1, n: 'Curto', free: false, price: 100, gems: 10, emoji: '💇' },
  { id: 2, n: 'Liso', free: true, emoji: '💇‍♀️' },
  { id: 3, n: 'Cacheado', free: false, price: 100, gems: 10, emoji: '🌀' },
  { id: 4, n: 'Moicano', free: false, price: 100, gems: 10, emoji: '🤘' },
  { id: 5, n: 'Longo', free: true, emoji: '👩' },
  { id: 6, n: 'Franja', free: true, emoji: '💁' },
  { id: 7, n: 'Coque', free: false, price: 100, gems: 10, emoji: '👩‍🦰' },
  { id: 8, n: 'Rabo de Cavalo', free: false, price: 100, gems: 10, emoji: '🎀' },
  { id: 9, n: 'Afro', free: false, price: 100, gems: 10, emoji: '🌟' },
  { id: 10, n: 'Trançado', free: false, price: 100, gems: 10, emoji: '🪢' },
  { id: 11, n: 'Raspado', free: false, price: 100, gems: 10, emoji: '🪒' },
];

export const HAIR_COLORS = ['#2D1B0E','#000000','#8B4513','#DAA520','#FF6347','#FF69B4','#800080','#4169E1','#228B22','#C0C0C0'];

export const EYE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Normal', free: true, emoji: '👀' },
  { id: 1, n: 'Vermelho', free: false, price: 100, gems: 10, emoji: '🔴' },
  { id: 2, n: 'Feliz', free: false, price: 100, gems: 10, emoji: '😊' },
  { id: 3, n: 'Curioso', free: true, emoji: '🤔' },
  { id: 4, n: 'Azul', free: true, emoji: '🔵' },
  { id: 5, n: 'Pequeno', free: true, emoji: '👁️' },
  { id: 6, n: 'Castanho', free: true, emoji: '🟤' },
  { id: 7, n: 'Verde', free: true, emoji: '🟢' },
  { id: 8, n: 'Cinza', free: true, emoji: '⚪' },
  { id: 9, n: 'Âmbar', free: false, price: 100, gems: 10, emoji: '🟡' },
];

export const NOSE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Padrão', free: true, emoji: '👃' },
  { id: 1, n: 'Grande', free: true, emoji: '👃' },
  { id: 2, n: 'Fino', free: true, emoji: '👃' },
  { id: 3, n: 'Arrebitado', free: true, emoji: '👃' },
];

export const MOUTH_TYPES: AvatarItem[] = [
  { id: 0, n: 'Sorriso', free: true, emoji: '😊' },
  { id: 1, n: 'Bigode', free: false, price: 100, gems: 10, emoji: '🥸' },
  { id: 2, n: 'Óculos+Bigode', free: false, price: 100, gems: 10, emoji: '🕶️' },
  { id: 3, n: 'Neutro', free: true, emoji: '😐' },
  { id: 4, n: 'Aberto', free: true, emoji: '😃' },
  { id: 5, n: 'Batom Roxo', free: false, price: 100, gems: 10, emoji: '💜' },
  { id: 6, n: 'Batom Vermelho', free: true, emoji: '💋' },
  { id: 7, n: 'Batom Rosa', free: true, emoji: '🩷' },
  { id: 8, n: 'Tímido', free: false, price: 100, gems: 10, emoji: '🫢' },
  { id: 9, n: 'Sorriso Largo', free: true, emoji: '😁' },
];

export const SHIRT_TYPES: AvatarItem[] = [
  { id: 0, n: 'Nenhuma', free: true, emoji: '🚫' },
  { id: 1, n: 'Camiseta Preta', free: false, price: 100, gems: 10, emoji: '🖤' },
  { id: 2, n: 'Camiseta Colorida', free: true, emoji: '🌈' },
  { id: 3, n: 'Camiseta Rosa', free: true, emoji: '🩷' },
  { id: 4, n: 'Camiseta Básica', free: true, emoji: '👕' },
  { id: 5, n: 'Estrela', free: false, price: 100, gems: 10, emoji: '⭐' },
  { id: 6, n: 'Camisa Laranja', free: false, price: 100, gems: 10, emoji: '🟠' },
  { id: 7, n: 'Jaleco', free: false, price: 100, gems: 10, emoji: '🥼' },
];

export const PANTS_TYPES: AvatarItem[] = [
  { id: 0, n: 'Nenhuma', free: false, price: 100, gems: 10, emoji: '🚫' },
  { id: 1, n: 'Bermuda Laranja', free: false, price: 100, gems: 10, emoji: '🟠' },
  { id: 2, n: 'Bermuda Vermelha', free: false, price: 100, gems: 10, emoji: '🔴' },
  { id: 3, n: 'Bermuda Azul', free: false, price: 100, gems: 10, emoji: '🔵' },
  { id: 4, n: 'Bermuda Preta', free: true, emoji: '🖤' },
  { id: 5, n: 'Calça Jeans', free: true, emoji: '👖' },
  { id: 6, n: 'Calça Preta', free: false, price: 100, gems: 10, emoji: '🖤' },
  { id: 7, n: 'Calça Azul', free: true, emoji: '💙' },
];

export const SHOE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Nenhum', free: true, emoji: '🚫' },
  { id: 1, n: 'Tênis Branco', free: false, price: 100, gems: 10, emoji: '👟' },
  { id: 2, n: 'Bota Marrom', free: false, price: 100, gems: 10, emoji: '🥾' },
  { id: 3, n: 'Sandália', free: false, price: 100, gems: 10, emoji: '🩴' },
  { id: 4, n: 'Sapato', free: true, emoji: '👞' },
  { id: 5, n: 'Tênis Vermelho', free: false, price: 100, gems: 10, emoji: '🔴' },
  { id: 6, n: 'Sapato Preto', free: true, emoji: '🖤' },
];

export const ACCESSORY_TYPES: AvatarItem[] = [
  { id: 0, n: 'Nenhum', free: true, emoji: '🚫' },
  { id: 1, n: 'Cordão Verde', free: true, emoji: '📿' },
  { id: 2, n: 'Cordão Colorido', free: true, emoji: '🌈' },
  { id: 3, n: 'Óculos Aviador', free: false, price: 100, gems: 10, emoji: '🕶️' },
  { id: 4, n: 'Óculos Redondo', free: true, emoji: '🤓' },
  { id: 5, n: 'Óculos Escuro', free: false, price: 100, gems: 10, emoji: '😎' },
];

export type AvatarCategory = 'corpo' | 'cabelo' | 'olhos' | 'nariz' | 'boca' | 'roupa' | 'calca' | 'calcado' | 'acessorios';

export const AVATAR_TABS: { key: AvatarCategory; label: string; emoji: string }[] = [
  { key: 'corpo', label: 'CORPO', emoji: '🧍' },
  { key: 'cabelo', label: 'CABELO', emoji: '💇' },
  { key: 'olhos', label: 'OLHOS', emoji: '👁️' },
  { key: 'nariz', label: 'NARIZ', emoji: '👃' },
  { key: 'boca', label: 'BOCA', emoji: '👄' },
  { key: 'roupa', label: 'ROUPA', emoji: '👕' },
  { key: 'calca', label: 'CALÇA', emoji: '👖' },
  { key: 'calcado', label: 'CALÇADO', emoji: '👟' },
  { key: 'acessorios', label: 'ACESSÓRIOS', emoji: '🎒' },
];

// ==================== GAME DATA ====================

export const QUIZ_UNLOCK = 5;
export const xpFor = (lv: number) => 80 + (lv - 1) * 45;
export const TITLES = ['Átomo','Elétron','Próton','Nêutron','Cientista','Doutor','Expert','Mestre','Lendário','Atômico'];

export const LEVELS = [
  { cols: 3, rows: 2, time: 60 },
  { cols: 4, rows: 3, time: 80 },
  { cols: 4, rows: 4, time: 90 },
  { cols: 5, rows: 4, time: 100 },
  { cols: 6, rows: 4, time: 110 },
  { cols: 6, rows: 5, time: 120 },
  { cols: 6, rows: 5, time: 110 },
  { cols: 6, rows: 6, time: 130 },
  { cols: 7, rows: 6, time: 140 },
  { cols: 8, rows: 6, time: 160 },
];

// Memory card subjects: element symbols
export const ELEMENT_CARDS = [
  { symbol: 'H', name: 'Hidrogênio', number: 1, color: '#EF4444' },
  { symbol: 'He', name: 'Hélio', number: 2, color: '#F97316' },
  { symbol: 'Li', name: 'Lítio', number: 3, color: '#EAB308' },
  { symbol: 'Be', name: 'Berílio', number: 4, color: '#22C55E' },
  { symbol: 'B', name: 'Boro', number: 5, color: '#14B8A6' },
  { symbol: 'C', name: 'Carbono', number: 6, color: '#3B82F6' },
  { symbol: 'N', name: 'Nitrogênio', number: 7, color: '#6366F1' },
  { symbol: 'O', name: 'Oxigênio', number: 8, color: '#8B5CF6' },
  { symbol: 'F', name: 'Flúor', number: 9, color: '#EC4899' },
  { symbol: 'Ne', name: 'Neônio', number: 10, color: '#F43F5E' },
  { symbol: 'Na', name: 'Sódio', number: 11, color: '#D97706' },
  { symbol: 'Mg', name: 'Magnésio', number: 12, color: '#059669' },
  { symbol: 'Al', name: 'Alumínio', number: 13, color: '#0891B2' },
  { symbol: 'Si', name: 'Silício', number: 14, color: '#7C3AED' },
  { symbol: 'P', name: 'Fósforo', number: 15, color: '#DC2626' },
  { symbol: 'S', name: 'Enxofre', number: 16, color: '#CA8A04' },
  { symbol: 'Cl', name: 'Cloro', number: 17, color: '#16A34A' },
  { symbol: 'Ar', name: 'Argônio', number: 18, color: '#2563EB' },
  { symbol: 'K', name: 'Potássio', number: 19, color: '#9333EA' },
  { symbol: 'Ca', name: 'Cálcio', number: 20, color: '#E11D48' },
  { symbol: 'Fe', name: 'Ferro', number: 26, color: '#78716C' },
  { symbol: 'Cu', name: 'Cobre', number: 29, color: '#B45309' },
  { symbol: 'Zn', name: 'Zinco', number: 30, color: '#6B7280' },
  { symbol: 'Au', name: 'Ouro', number: 79, color: '#D97706' },
];

export const QUESTIONS = [
  { t: 'Qual cientista propôs o modelo "pudim de passas"?', opts: ['J.J. Thomson','Rutherford','Bohr','Dalton'], ans: 0, f: 'Thomson (1897) imaginou elétrons dentro de uma esfera positiva!' },
  { t: 'No experimento de Rutherford, qual folha foi usada?', opts: ['Prata','Ouro','Cobre','Alumínio'], ans: 1, f: 'A folha de ouro era fina o suficiente para partículas alfa!' },
  { t: 'Segundo Bohr, os elétrons orbitam em:', opts: ['Trajetórias aleatórias','Camadas de energia fixas','Nuvens','Dentro do núcleo'], ans: 1, f: 'Bohr (1913) propôs camadas de energia quantizada!' },
  { t: 'Quem descobriu o elétron em 1897?', opts: ['Dalton','Rutherford','J.J. Thomson','Schrödinger'], ans: 2, f: 'Thomson usou tubos de raios catódicos para a descoberta!' },
  { t: 'O modelo quântico descreve elétrons como:', opts: ['Esferas sólidas','Órbitas circulares','Nuvens de probabilidade','Partículas fixas'], ans: 2, f: 'Schrödinger (1926) criou a equação de onda quântica!' },
  { t: 'Qual partícula NÃO fica no núcleo atômico?', opts: ['Próton','Nêutron','Elétron','Quark'], ans: 2, f: 'Elétrons orbitam ao redor do núcleo!' },
  { t: 'O número atômico (Z) representa o número de:', opts: ['Nêutrons','Prótons','Massa total','Elétrons+Prótons'], ans: 1, f: 'O número atômico define o elemento químico!' },
  { t: 'John Dalton descreveu os átomos como:', opts: ['Com núcleo central','Esferas sólidas indivisíveis','Nuvens de elétrons','Planetas em miniatura'], ans: 1, f: 'Em 1803, Dalton imaginou átomos como bolinhas maciças!' },
  { t: 'Qual foi o primeiro modelo a propor um núcleo central?', opts: ['Dalton','Thomson','Rutherford','Bohr'], ans: 2, f: 'O experimento de 1911 revelou o pequeno e denso núcleo!' },
  { t: 'A equação de Schrödinger calcula a _____ do elétron:', opts: ['Posição exata','Velocidade','Probabilidade de encontrá-lo','Massa'], ans: 2, f: 'Mecânica quântica: não há posição exata, apenas probabilidade!' },
  { t: 'Qual o símbolo do elemento Hélio?', opts: ['H','He','Hl','Hi'], ans: 1, f: 'Hélio (He) é o segundo elemento da tabela periódica!' },
  { t: 'Qual elemento tem número atômico 6?', opts: ['Nitrogênio','Oxigênio','Carbono','Boro'], ans: 2, f: 'Carbono (C) é a base da vida orgânica!' },
  { t: 'O ouro (Au) tem número atômico:', opts: ['47','79','29','82'], ans: 1, f: 'Ouro (Au) - número atômico 79, metal nobre!' },
  { t: 'Qual destes é um gás nobre?', opts: ['Oxigênio','Nitrogênio','Neônio','Cloro'], ans: 2, f: 'Gases nobres: He, Ne, Ar, Kr, Xe, Rn - muito estáveis!' },
  { t: 'O ferro (Fe) pertence a qual grupo?', opts: ['Gases nobres','Metais de transição','Alcalinos','Halogênios'], ans: 1, f: 'Ferro é um metal de transição, fundamental para a indústria!' },
];

export const ACHIEVEMENTS = [
  { k: 'first_game', ico: '🎮', n: 'Primeiro Jogo', d: 'Complete sua primeira fase' },
  { k: 'no_errors', ico: '🎯', n: 'Perfeição', d: 'Fase concluída sem erros' },
  { k: 'speed_demon', ico: '⚡', n: 'Relâmpago', d: 'Fase em menos de 30 segundos' },
  { k: 'combo_5', ico: '🔥', n: 'Combo x5', d: '5 acertos consecutivos' },
  { k: 'level_5', ico: '⭐', n: 'Cientista Jr.', d: 'Alcance o Nível 5' },
  { k: 'level_10', ico: '🏆', n: 'Mestre Atômico', d: 'Alcance o Nível 10' },
  { k: 'quiz_perfect', ico: '🧪', n: '100% no Quiz', d: 'Acerte todas as questões' },
  { k: 'rich', ico: '💰', n: 'Magnata', d: 'Acumule 500+ moedas' },
  { k: 'shopper', ico: '🛒', n: 'Comprador', d: 'Compre 3 itens na loja' },
  { k: 'collector', ico: '💎', n: 'Colecionador', d: 'Tenha 10+ itens' },
];

export const MISSIONS = [
  { k: 'play_3', l: 'Jogue 3 partidas', t: 3, c: 50, x: 30 },
  { k: 'match_20', l: 'Acerte 20 pares', t: 20, c: 80, x: 50 },
  { k: 'complete', l: 'Complete 1 fase', t: 1, c: 30, x: 20 },
  { k: 'no_err', l: 'Fase perfeita (sem erros)', t: 1, c: 100, x: 60 },
  { k: 'combo3', l: 'Faça combo de 3', t: 1, c: 60, x: 40 },
  { k: 'quiz', l: 'Termine o quiz', t: 1, c: 120, x: 80 },
  { k: 'match_10', l: '10 pares em 1 jogo', t: 10, c: 40, x: 25 },
];

export const FAKES = [
  { n: 'NeonAtom', s: 9800, lv: 12, skin: 2, hair: 3 },
  { n: 'QuantumX', s: 8750, lv: 10, skin: 1, hair: 5 },
  { n: 'ProtonPunk', s: 7600, lv: 9, skin: 3, hair: 4 },
  { n: 'ElektroZap', s: 6900, lv: 8, skin: 4, hair: 1 },
  { n: 'DarkQuasar', s: 6100, lv: 7, skin: 5, hair: 2 },
  { n: 'NucleoStar', s: 5400, lv: 6, skin: 0, hair: 6 },
  { n: 'PhotonRush', s: 4800, lv: 6, skin: 6, hair: 8 },
  { n: 'AtomoFire', s: 4100, lv: 5, skin: 2, hair: 9 },
  { n: 'CryptoNova', s: 3600, lv: 4, skin: 3, hair: 7 },
  { n: 'AlphaWave', s: 2900, lv: 4, skin: 1, hair: 10 },
];
