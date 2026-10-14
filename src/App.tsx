/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ChallengeGrid } from './components/ChallengeGrid.tsx';
import { ChallengeSetupModal } from './components/ChallengeSetupModal.tsx';
import { ActiveChallengeDashboard } from './components/ActiveChallengeDashboard.tsx';
import { CompletionToast } from './components/CompletionToast.tsx';
import { CelebrationModal } from './components/CelebrationModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ActiveChallenge, ChallengeDuration, CompletedChallengeRecord } from './types.ts';
import {
  generateChallengeDays,
  getTodayLocalDateString,
} from './utils/dateUtils.ts';
import { playSuccessSound } from './utils/audio.ts';

const STORAGE_KEY_CHALLENGE = 'life_change_taker_active_challenge';
const STORAGE_KEY_HISTORY = 'life_change_taker_history';
const STORAGE_KEY_THEME = 'life_change_taker_theme';
const STORAGE_KEY_SOUND = 'life_change_taker_sound';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sound state (muted by default)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved === 'true';
    }
    return false;
  });

  // Active Challenge state
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallenge | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CHALLENGE);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Failed to load challenge from localStorage', err);
      }
    }
    return null;
  });

  // Challenge history state
  const [history, setHistory] = useState<CompletedChallengeRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Failed to load history from localStorage', err);
      }
    }
    return [];
  });

  // Modal states
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupDuration, setSetupDuration] = useState<ChallengeDuration>(7);
  const [completedToastDay, setCompletedToastDay] = useState<number | null>(null);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  // Apply dark class to document and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Persist active challenge
  useEffect(() => {
    if (activeChallenge) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE, JSON.stringify(activeChallenge));
    } else {
      localStorage.removeItem(STORAGE_KEY_CHALLENGE);
    }
  }, [activeChallenge]);

  // Persist history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleOpenSetup = (duration: ChallengeDuration = 7) => {
    setSetupDuration(duration);
    setIsSetupModalOpen(true);
  };

  const handleStartChallenge = (params: {
    userName: string;
    goalId: string;
    goalTitle: string;
    isCustomGoal: boolean;
    customGoalName?: string;
    durationDays: ChallengeDuration;
    startDate: string;
    endDate: string;
  }) => {
    // If there is an existing finished challenge, archive it to history
    if (activeChallenge && activeChallenge.isFinished) {
      const historyRecord: CompletedChallengeRecord = {
        id: activeChallenge.id,
        userName: activeChallenge.userName,
        goalTitle: activeChallenge.goalTitle,
        durationDays: activeChallenge.durationDays,
        startDate: activeChallenge.startDate,
        endDate: activeChallenge.endDate,
        completedDays: activeChallenge.days.filter((d) => d.isCompleted).length,
        finishedAt: activeChallenge.finishedAt || new Date().toISOString(),
      };
      setHistory((prev) => [historyRecord, ...prev]);
    }

    const days = generateChallengeDays(params.startDate, params.durationDays);

    const newChallenge: ActiveChallenge = {
      id: `challenge-${Date.now()}`,
      userName: params.userName,
      goalId: params.goalId,
      goalTitle: params.goalTitle,
      isCustomGoal: params.isCustomGoal,
      customGoalName: params.customGoalName,
      durationDays: params.durationDays,
      startDate: params.startDate,
      endDate: params.endDate,
      createdAt: new Date().toISOString(),
      days,
      isFinished: false,
      isCelebrated: false,
    };

    setActiveChallenge(newChallenge);
    setIsSetupModalOpen(false);

    // Smooth scroll to active dashboard
    setTimeout(() => {
      scrollToSection('active-dashboard');
    }, 150);
  };

  const handleCompleteDay = (dayNumber: number, note?: string) => {
    if (!activeChallenge) return;

    const todayStr = getTodayLocalDateString();
    let isAllComplete = false;

    const updatedDays = activeChallenge.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        // Enforce date-based constraint: must be today
        if (day.scheduledDate !== todayStr && !day.isCompleted) {
          // Double safeguard: cannot complete future days
          if (day.scheduledDate > todayStr) return day;
        }

        return {
          ...day,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          reflectionNote: note || day.reflectionNote,
        };
      }
      return day;
    });

    // Check if every required day is completed
    const completedCount = updatedDays.filter((d) => d.isCompleted).length;
    if (completedCount === activeChallenge.durationDays) {
      isAllComplete = true;
    }

    const updatedChallenge: ActiveChallenge = {
      ...activeChallenge,
      days: updatedDays,
      isFinished: isAllComplete,
      finishedAt: isAllComplete ? new Date().toISOString() : activeChallenge.finishedAt,
      isCelebrated: isAllComplete ? true : activeChallenge.isCelebrated,
    };

    setActiveChallenge(updatedChallenge);
    playSuccessSound(soundEnabled);
    setCompletedToastDay(dayNumber);

    if (isAllComplete) {
      setTimeout(() => {
        setIsCelebrationModalOpen(true);
      }, 700);
    }
  };

  const handleSaveDayNote = (dayNumber: number, note: string) => {
    if (!activeChallenge) return;

    const updatedDays = activeChallenge.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          reflectionNote: note,
        };
      }
      return day;
    });

    setActiveChallenge({
      ...activeChallenge,
      days: updatedDays,
    });
  };

  const handleResetChallenge = () => {
    // If the reset challenge had any progress, keep a record in history before clearing if finished
    if (activeChallenge && activeChallenge.isFinished) {
      const historyRecord: CompletedChallengeRecord = {
        id: activeChallenge.id,
        userName: activeChallenge.userName,
        goalTitle: activeChallenge.goalTitle,
        durationDays: activeChallenge.durationDays,
        startDate: activeChallenge.startDate,
        endDate: activeChallenge.endDate,
        completedDays: activeChallenge.days.filter((d) => d.isCompleted).length,
        finishedAt: activeChallenge.finishedAt || new Date().toISOString(),
      };
      setHistory((prev) => [historyRecord, ...prev]);
    }
    setActiveChallenge(null);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          hasActiveChallenge={Boolean(activeChallenge)}
          onScrollToSection={scrollToSection}
        />

        <main>
          {/* Hero Section */}
          <HeroSection
            onStartChallenge={() => {
              if (activeChallenge) {
                scrollToSection('active-dashboard');
              } else {
                handleOpenSetup(7);
              }
            }}
            onExploreChallenges={() => scrollToSection('challenges')}
            soundEnabled={soundEnabled}
          />

          {/* Active Challenge Dashboard (Shown when active challenge exists) */}
          {activeChallenge && (
            <ActiveChallengeDashboard
              challenge={activeChallenge}
              onCompleteDay={handleCompleteDay}
              onSaveDayNote={handleSaveDayNote}
              onResetChallenge={handleResetChallenge}
              onStartNewChallenge={() => handleOpenSetup(activeChallenge.durationDays)}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Challenge Durations Selection Grid */}
          <ChallengeGrid
            selectedDuration={activeChallenge?.durationDays || null}
            onSelectDuration={(duration) => handleOpenSetup(duration)}
            soundEnabled={soundEnabled}
          />

       
        </main>
      </div>

      {/* Footer */}
      <Footer onScrollToSection={scrollToSection} soundEnabled={soundEnabled} />

      {/* Challenge Setup Modal */}
      <ChallengeSetupModal
        isOpen={isSetupModalOpen}
        initialDuration={setupDuration}
        onClose={() => setIsSetupModalOpen(false)}
        onStartChallenge={handleStartChallenge}
        soundEnabled={soundEnabled}
      />

      {/* Daily Completion Toast */}
      <CompletionToast
        dayNumber={completedToastDay}
        onClose={() => setCompletedToastDay(null)}
      />

      {/* Full Challenge Completion Modal */}
      {activeChallenge && (
        <CelebrationModal
          challenge={activeChallenge}
          isOpen={isCelebrationModalOpen}
          onClose={() => setIsCelebrationModalOpen(false)}
          onStartNewChallenge={() => {
            setIsCelebrationModalOpen(false);
            handleOpenSetup(activeChallenge.durationDays);
          }}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
}
