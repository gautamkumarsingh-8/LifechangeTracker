
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Compass,
  BookOpen,
  Dumbbell,
  Heart,
  Brain,
} from 'lucide-react';
import study from "../assets/images/study.jpg";
import running from "../assets/images/running.jpg";
import mastbations from "../assets/images/masterbation.jpg";
import smoking from "../assets/images/smoking.jpg";
import self from "../assets/images/self.jpg";
import { playClickSound } from '../utils/audio.ts';

interface HeroSectionProps {
  onStartChallenge: () => void;
  onExploreChallenges: () => void;
  soundEnabled: boolean;
}

const slides = [
  {
    category: 'STUDY CHALLENGE',
    eyebrow: 'FOCUS • LEARN • GROW',
    title: 'Your Dreams Deserve Discipline.',
    description:
      'Improve your focus, study consistently, and turn small daily efforts into meaningful progress.',
    image: study,
    icon: BookOpen,
    button: 'Start Studying',
  },
  {
    category: 'RUNNING CHALLENGE',
    eyebrow: 'MOVE • SWEAT • GROW',
    title: 'One Step Closer to a Stronger You.',
    description:
      'Start running, improve your fitness, and build a healthier lifestyle one day at a time.',
    image: running,
    icon: Dumbbell,
    button: 'Start Running',
  },
  {
    category: 'QUIT SMOKING CHALLENGE',
    eyebrow: 'HEALTH • PROGRESS • FREEDOM',
    title: 'Take a Step Toward a Smoke-Free Life.',
    description:
      'Track your progress and celebrate each step toward quitting smoking.',
    image: smoking,
    icon: Heart,
    button: 'Build Better Habits',
  },
  {
    category: 'SELF-CONTROL CHALLENGE',
    eyebrow: 'DISCIPLINE • CONTROL • GROWTH',
    title: 'Change Your Habits. Change Your Life.',
    description:
      'Reduce unwanted habits, manage distractions, and build routines that support your goals.',
    image: self,
    icon: Brain,
    button: 'Start My Challenge',
  },
  {
    category: 'MASTURBATION CONTROL CHALLENGE',
    eyebrow: 'SELF-AWARENESS • BALANCE • GROWTH',
    title: 'Take Control. Focus on Your Goals.',
    description:
      'Build awareness of your habits and develop a balanced routine that supports your personal goals.',
    image: mastbations,
    icon: Brain,
    button: 'Start My Challenge',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartChallenge,
  onExploreChallenges,
  soundEnabled,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];
  const CategoryIcon = slide.icon;

  // Automatically change slide every 4 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const handleStart = () => {
    playClickSound(soundEnabled);
    onStartChallenge();
  };

  const handleExplore = () => {
    playClickSound(soundEnabled);
    onExploreChallenges();
  };

  return (
    <section
      id="hero"
      aria-label="Life Change Taker challenges"
      className="px-3 py-3 sm:px-5 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate h-[490px] overflow-hidden rounded-2xl bg-slate-950 shadow-xl sm:h-[450px] sm:rounded-3xl lg:h-[440px]">

          {/* Local background image slider */}
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 -z-20"
            >
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/25" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/55 to-transparent" />

          {/* Hero content */}
          <div className="flex h-full items-center px-5 py-7 sm:px-9 md:px-12 lg:px-14">
            <div className="w-full max-w-3xl text-white">

              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Category badge */}
                  <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">
                    <CategoryIcon
                      size={17}
                      className="shrink-0 text-amber-400"
                    />

                    <span className="text-[10px] font-bold tracking-wider text-amber-200 sm:text-xs">
                      {slide.eyebrow}
                    </span>

                    <Sparkles
                      size={14}
                      className="shrink-0 text-amber-300"
                    />
                  </div>

                  {/* Main heading */}
                  <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[52px]">
                    {slide.title}
                  </h1>

                  {/* Supporting text */}
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:mt-4 sm:text-base sm:leading-7">
                    {slide.description}
                  </p>

                  {/* How the challenge works */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-white">
                    {[
                      'Choose a goal',
                      'Build a streak',
                      'Track progress',
                    ].map((item, index) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 backdrop-blur-sm sm:px-3"
                      >
                        <span className="mr-1 text-[#29fa61df]">
                          0{index + 1}
                        </span>
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Call-to-action buttons */}
                  <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row sm:mt-6">
                    <button
                      type="button"
                      onClick={handleStart}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-300 active:scale-[0.98]"
                    >
                      {slide.button}
                      <ArrowRight size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={handleExplore}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
                    >
                      <Compass
                        size={17}
                        className="text-green-400"
                      />
                      Explore Challenges
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Five-slide navigation */}
              <div className="mt-5 flex items-center gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${item.category}`}
                    aria-pressed={activeIndex === index}
                    className="flex h-6 items-center"
                  >
                    <span
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index
                        ? 'w-8 bg-green-500'
                        : 'w-4 bg-white/50 hover:bg-white'
                        }`}
                    />
                  </button>
                ))}

                <span className="ml-2 text-[11px] font-semibold text-white/80">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(slides.length).padStart(2, '0')}
                </span>

                <span className="ml-auto hidden text-xs text-white/70 sm:block">
                  Small steps. Real progress.
                </span>
              </div>
            </div>
          </div>

          {/* Four-second progress bar */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/15">
            <motion.div
              key={activeIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="h-full bg-amber-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
