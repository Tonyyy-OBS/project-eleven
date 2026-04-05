## Plano: Reconstruir Universos Atômicos do Zero

### 1. Design System & Theme
- Gradient sky blue/cyan background (like reference images)
- Deep purple/indigo accent colors
- Clean, rounded UI with soft shadows
- Professional fonts (Nunito + Fredoka One)
- HSL-based design tokens

### 2. Core Pages & Flow
1. **AuthScreen** - Login/Register (nome + senha)
2. **CharacterScreen** - Full avatar customization with tabs (CORPO, CABELO, OLHOS, NARIZ, BOCA, ROUPA, CALÇA, CALÇADO, ACESSÓRIOS) - grid of items, some free, some purchasable
3. **HubScreen** - Main menu with access to game, quiz (locked until lvl 5), shop, ranking, profile
4. **GameScreen** - Memory card game with progressive difficulty (levels 1-5+)
5. **QuizScreen** - Atomic models quiz (unlocked at level 5), multiple choice, timed
6. **RankingScreen** - Top 3 podium with animations (Kahoot-style)
7. **ShopScreen** - Buy avatar items with coins
8. **ProfileScreen** - View stats and avatar

### 3. Avatar System (inspired by reference)
- Full-body SVG character (front-facing, like reference)
- Tab-based customization: Corpo (body type + skin tone), Cabelo, Olhos, Nariz, Boca, Roupa, Calça, Calçado, Acessórios
- Grid layout showing all options per category
- Items marked as "Grátis" or with coin/gem price
- Live preview on the left side

### 4. Game Mechanics
- Memory game: match element cards (atomic symbols/models)
- Levels 1-5: increasing card count and decreasing time
- Coins earned per level completion
- XP/level progression system
- Quiz unlocks at level 5

### 5. Data & State
- localStorage-based persistence
- GameContext for global state
- Structured game data (items, quiz questions, levels)

### 6. Files to create/rewrite
- `src/index.css` - Full design system
- `tailwind.config.ts` - Theme tokens
- `src/lib/gameData.ts` - All game data (avatar items, quiz, levels)
- `src/lib/gameStore.ts` - Storage layer
- `src/lib/sounds.ts` - Audio effects
- `src/contexts/GameContext.tsx` - State management
- `src/components/Avatar.tsx` - Full-body SVG avatar
- `src/components/AvatarCustomizer.tsx` - Tab-based customizer
- `src/components/MemoryCard.tsx` - Card component
- `src/components/Confetti.tsx` - Celebration effects
- `src/pages/*` - All pages rebuilt
- `src/App.tsx` - Router setup
