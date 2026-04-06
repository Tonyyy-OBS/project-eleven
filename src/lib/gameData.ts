export const SKIN_TONES = ['#F6D9BE', '#E7BD97', '#CF9D78', '#AF7D5C', '#8D6248', '#694431', '#41261A'];

export const BODY_TYPES = [
  { id: 0, n: 'Clássico', free: true },
  { id: 1, n: 'Atlético', free: true },
  { id: 2, n: 'Robusto', free: true },
  { id: 3, n: 'Elegante', free: true },
  { id: 4, n: 'Compacto', free: true },
  { id: 5, n: 'Alto', free: true },
];

export interface AvatarItem {
  id: number;
  n: string;
  free: boolean;
  price?: number;
  gems?: number;
  emoji?: string;
  gender?: 'male' | 'female' | 'any';
}

export const HAIR_STYLES: AvatarItem[] = [
  { id: 0, n: 'Raspado', free: true },
  { id: 1, n: 'Curto', free: true },
  { id: 2, n: 'Lateral', free: true },
  { id: 3, n: 'Cacheado', free: false, price: 110 },
  { id: 4, n: 'Moicano', free: false, price: 120 },
  { id: 5, n: 'Longo', free: true },
  { id: 6, n: 'Franja', free: true },
  { id: 7, n: 'Coque', free: false, price: 130 },
  { id: 8, n: 'Rabo de Cavalo', free: false, price: 130 },
  { id: 9, n: 'Afro', free: false, price: 140 },
  { id: 10, n: 'Tranças', free: false, price: 150 },
  { id: 11, n: 'Buzz Cut', free: false, price: 100 },
];

export const HAIR_COLORS = ['#23180E', '#111111', '#6B4428', '#9A5C2F', '#C78C3A', '#C65F52', '#A7485A', '#6B59D3', '#2D7E66', '#C2C6CC'];

export const EYE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Natural', free: true },
  { id: 1, n: 'Azul', free: true },
  { id: 2, n: 'Sorridente', free: true },
  { id: 3, n: 'Focado', free: false, price: 90 },
  { id: 4, n: 'Verde', free: true },
  { id: 5, n: 'Compacto', free: true },
  { id: 6, n: 'Castanho', free: true },
  { id: 7, n: 'Cinza', free: false, price: 90 },
  { id: 8, n: 'Âmbar', free: false, price: 90 },
  { id: 9, n: 'Determinado', free: false, price: 100 },
];

export const NOSE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Reta', free: true },
  { id: 1, n: 'Marcante', free: true },
  { id: 2, n: 'Fina', free: true },
  { id: 3, n: 'Leve', free: true },
];

export const MOUTH_TYPES: AvatarItem[] = [
  { id: 0, n: 'Sorriso', free: true },
  { id: 1, n: 'Sério', free: true },
  { id: 2, n: 'Aberto', free: true },
  { id: 3, n: 'Confiante', free: true },
  { id: 4, n: 'Sutil', free: true },
  { id: 5, n: 'Largo', free: false, price: 90 },
  { id: 6, n: 'Determinado', free: false, price: 100 },
  { id: 7, n: 'Calmo', free: false, price: 100 },
  { id: 8, n: 'Bigode', free: false, price: 120 },
  { id: 9, n: 'Barba curta', free: false, price: 130 },
];

export const SHIRT_TYPES: AvatarItem[] = [
  { id: 0, n: 'Camiseta Grafite', free: true },
  { id: 1, n: 'Jaqueta Azul', free: true },
  { id: 2, n: 'Jaleco Atômico', free: false, price: 160 },
  { id: 3, n: 'Moletom Âmbar', free: false, price: 150 },
  { id: 4, n: 'Camisa Ciano', free: true },
  { id: 5, n: 'Blusa Rose', free: true },
  { id: 6, n: 'Jaqueta Neon', free: false, price: 170 },
  { id: 7, n: 'Blazer Noite', free: false, price: 180 },
];

export const PANTS_TYPES: AvatarItem[] = [
  { id: 0, n: 'Calça Slim', free: true },
  { id: 1, n: 'Jeans Escuro', free: true },
  { id: 2, n: 'Tática Preta', free: false, price: 130 },
  { id: 3, n: 'Areia', free: true },
  { id: 4, n: 'Azul Cobalto', free: true },
  { id: 5, n: 'Noite', free: false, price: 120 },
  { id: 6, n: 'Clara', free: false, price: 120 },
  { id: 7, n: 'Chumbo', free: true },
];

export const SHOE_TYPES: AvatarItem[] = [
  { id: 0, n: 'Tênis Branco', free: true },
  { id: 1, n: 'Tênis Escuro', free: true },
  { id: 2, n: 'Bota Marrom', free: false, price: 100 },
  { id: 3, n: 'Runner Ciano', free: false, price: 120 },
  { id: 4, n: 'Sapato Social', free: true },
  { id: 5, n: 'Tênis Rubi', free: false, price: 120 },
  { id: 6, n: 'Bota Tática', free: false, price: 130 },
];

export const ACCESSORY_TYPES: AvatarItem[] = [
  { id: 0, n: 'Sem acessório', free: true },
  { id: 1, n: 'Cordão', free: true },
  { id: 2, n: 'Crachá', free: true },
  { id: 3, n: 'Óculos Aviador', free: false, price: 140 },
  { id: 4, n: 'Óculos Redondo', free: true },
  { id: 5, n: 'Visor Tech', free: false, price: 150 },
];

export type AvatarCategory = 'corpo' | 'cabelo' | 'olhos' | 'nariz' | 'boca' | 'roupa' | 'calca' | 'calcado' | 'acessorios';

export const AVATAR_TABS: { key: AvatarCategory; label: string; emoji: string }[] = [
  { key: 'corpo', label: 'Corpo', emoji: '' },
  { key: 'cabelo', label: 'Cabelo', emoji: '' },
  { key: 'olhos', label: 'Olhos', emoji: '' },
  { key: 'nariz', label: 'Nariz', emoji: '' },
  { key: 'boca', label: 'Boca', emoji: '' },
  { key: 'roupa', label: 'Roupa', emoji: '' },
  { key: 'calca', label: 'Calça', emoji: '' },
  { key: 'calcado', label: 'Calçado', emoji: '' },
  { key: 'acessorios', label: 'Acessórios', emoji: '' },
];

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
  { t: 'Qual cientista propôs o modelo "pudim de passas"?', opts: ['J.J. Thomson','Rutherford','Bohr','Dalton'], ans: 0, f: 'Thomson imaginou elétrons distribuídos em uma esfera positiva.' },
  { t: 'No experimento de Rutherford, qual folha foi usada?', opts: ['Prata','Ouro','Cobre','Alumínio'], ans: 1, f: 'A folha de ouro era fina o bastante para observar o desvio das partículas alfa.' },
  { t: 'Segundo Bohr, os elétrons orbitam em:', opts: ['Trajetórias aleatórias','Camadas de energia fixas','Nuvens','Dentro do núcleo'], ans: 1, f: 'Bohr propôs níveis de energia quantizados.' },
  { t: 'Quem descobriu o elétron em 1897?', opts: ['Dalton','Rutherford','J.J. Thomson','Schrödinger'], ans: 2, f: 'A descoberta veio dos experimentos com raios catódicos.' },
  { t: 'O modelo quântico descreve elétrons como:', opts: ['Esferas sólidas','Órbitas circulares','Nuvens de probabilidade','Partículas fixas'], ans: 2, f: 'A mecânica quântica trabalha com probabilidade e não com órbitas fixas.' },
  { t: 'Qual partícula NÃO fica no núcleo atômico?', opts: ['Próton','Nêutron','Elétron','Quark'], ans: 2, f: 'Elétrons ocupam a eletrosfera ao redor do núcleo.' },
  { t: 'O número atômico (Z) representa o número de:', opts: ['Nêutrons','Prótons','Massa total','Elétrons + Prótons'], ans: 1, f: 'O número de prótons identifica o elemento químico.' },
  { t: 'John Dalton descreveu os átomos como:', opts: ['Com núcleo central','Esferas sólidas indivisíveis','Nuvens de elétrons','Planetas em miniatura'], ans: 1, f: 'Dalton comparava o átomo a uma esfera maciça.' },
  { t: 'Qual foi o primeiro modelo a propor um núcleo central?', opts: ['Dalton','Thomson','Rutherford','Bohr'], ans: 2, f: 'Rutherford identificou um núcleo pequeno e denso.' },
  { t: 'A equação de Schrödinger calcula a _____ do elétron:', opts: ['Posição exata','Velocidade','Probabilidade de encontrá-lo','Massa'], ans: 2, f: 'O modelo quântico calcula regiões prováveis de presença do elétron.' },
  { t: 'Qual o símbolo do elemento Hélio?', opts: ['H','He','Hl','Hi'], ans: 1, f: 'O símbolo correto é He.' },
  { t: 'Qual elemento tem número atômico 6?', opts: ['Nitrogênio','Oxigênio','Carbono','Boro'], ans: 2, f: 'O Carbono é o elemento de número atômico 6.' },
  { t: 'O ouro (Au) tem número atômico:', opts: ['47','79','29','82'], ans: 1, f: 'O ouro tem número atômico 79.' },
  { t: 'Qual destes é um gás nobre?', opts: ['Oxigênio','Nitrogênio','Neônio','Cloro'], ans: 2, f: 'Neônio é um gás nobre.' },
  { t: 'O ferro (Fe) pertence a qual grupo?', opts: ['Gases nobres','Metais de transição','Alcalinos','Halogênios'], ans: 1, f: 'O ferro é um metal de transição.' },
];

export const ACHIEVEMENTS = [
  { k: 'first_game', ico: 'JG', n: 'Primeiro Jogo', d: 'Complete sua primeira fase' },
  { k: 'no_errors', ico: 'PF', n: 'Perfeição', d: 'Fase concluída sem erros' },
  { k: 'speed_demon', ico: 'SP', n: 'Relâmpago', d: 'Fase em menos de 30 segundos' },
  { k: 'combo_5', ico: 'C5', n: 'Combo x5', d: '5 acertos consecutivos' },
  { k: 'level_5', ico: 'L5', n: 'Cientista Jr.', d: 'Alcance o Nível 5' },
  { k: 'level_10', ico: 'L10', n: 'Mestre Atômico', d: 'Alcance o Nível 10' },
  { k: 'quiz_perfect', ico: 'QZ', n: 'Quiz Perfeito', d: 'Acerte todas as questões' },
  { k: 'rich', ico: '500', n: 'Magnata', d: 'Acumule 500+ moedas' },
  { k: 'shopper', ico: '3X', n: 'Comprador', d: 'Compre 3 itens na loja' },
  { k: 'collector', ico: '10+', n: 'Colecionador', d: 'Tenha 10+ itens' },
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
