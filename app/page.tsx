'use client';

import { useGame } from '@/hooks/useGame';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { NameEntryScreen } from '@/components/screens/NameEntryScreen';
import { CategoriesScreen } from '@/components/screens/CategoriesScreen';
import { QuestionScreen } from '@/components/screens/QuestionScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';
import { PauseModal } from '@/components/modals/PauseModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConfettiCanvas } from '@/components/ConfettiCanvas';

export default function Home() {
  const game = useGame();

  return (
    <>
      {/* Splash screen */}
      <div id="screen-splash" className={`screen ${game.screen === 'splash' ? 'active' : ''}`}>
        <SplashScreen
          onStart={() => game.setScreen('welcome')}
          onViewScores={() => game.setScreen('results')}
        />
      </div>

      {/* Name entry screen */}
      <div id="screen-welcome" className={`screen ${game.screen === 'welcome' ? 'active' : ''}`}>
        <NameEntryScreen
          onStart={(name) => {
            game.setPlayerName(name);
            game.setScreen('categories');
          }}
        />
      </div>

      {/* Categories screen */}
      <div id="screen-categories" className={`screen ${game.screen === 'categories' ? 'active' : ''}`}>
        <CategoriesScreen onSelect={game.startGame} />
      </div>

      {/* Question screen */}
      {game.screen === 'question' && game.questions.length > 0 && (
        <div id="screen-question" className="screen active">
          <QuestionScreen
            question={game.questions[game.currentIndex]}
            questionNumber={game.currentIndex + 1}
            totalQuestions={game.questions.length}
            score={game.score}
            category={game.category!}
            answered={game.answered}
            selectedIndex={game.selectedIndex}
            isCorrect={game.isCorrect}
            showWrongEffect={game.showWrongEffect}
            onAnswer={game.handleAnswer}
            onNext={game.nextQuestion}
            onBack={() => game.setConfirmQuit(true)}
            onPause={() => game.setPaused(true)}
          />
        </div>
      )}

      {/* Results screen */}
      {game.screen === 'results' && (
        <div id="screen-results" className="screen active">
          <ResultsScreen
            playerName={game.playerName}
            score={game.score}
            totalQuestions={game.questions.length || 10}
            category={game.category || 'bath-shower'}
            onPlayAgain={() => game.setScreen('categories')}
            onChangeCategory={() => game.setScreen('categories')}
          />
        </div>
      )}

      {/* Modals */}
      <PauseModal
        isOpen={game.paused}
        onResume={() => game.setPaused(false)}
        onQuit={() => {
          game.setPaused(false);
          game.setScreen('categories');
        }}
      />
      <ConfirmModal
        isOpen={game.confirmQuit}
        onLeave={() => {
          game.setConfirmQuit(false);
          game.setScreen('categories');
        }}
        onStay={() => game.setConfirmQuit(false)}
      />

      {/* Global overlays */}
      <ConfettiCanvas trigger={game.triggerConfetti} />
      <div id="wrong-overlay" className={game.showWrongEffect ? 'active' : ''} />
      <ThemeToggle />
    </>
  );
}
