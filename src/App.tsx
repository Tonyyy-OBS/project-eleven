import { useState, useCallback } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { GameProvider, useGame } from '@/contexts/GameContext';
import GameModals from '@/components/GameModals';
import LoadingScreen from '@/pages/LoadingScreen';
import AuthScreen from '@/pages/AuthScreen';
import CharacterScreen from '@/pages/CharacterScreen';
import HubScreen from '@/pages/HubScreen';
import GameScreen from '@/pages/GameScreen';
import QuizScreen from '@/pages/QuizScreen';
import RankingScreen from '@/pages/RankingScreen';
import ShopScreen from '@/pages/ShopScreen';
import ProfileScreen from '@/pages/ProfileScreen';
import CreditsScreen from '@/pages/CreditsScreen';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useGame();
  const [splashDone, setSplashDone] = useState(false);
  const onSplashComplete = useCallback(() => setSplashDone(true), []);

  if (!splashDone) return <LoadingScreen onComplete={onSplashComplete} />;
  if (loading) return <LoadingScreen onComplete={() => {}} />;
  if (!user) return <AuthScreen />;
  if (!user.charCreated) return <CharacterScreen />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hub" replace />} />
      <Route path="/hub" element={<HubScreen />} />
      <Route path="/game" element={<GameScreen />} />
      <Route path="/quiz" element={<QuizScreen />} />
      <Route path="/ranking" element={<RankingScreen />} />
      <Route path="/shop" element={<ShopScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/avatar" element={<CharacterScreen />} />
      <Route path="/credits" element={<CreditsScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Toaster position="top-right" richColors />
        <GameModals />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GameProvider>
    </QueryClientProvider>
  );
}
