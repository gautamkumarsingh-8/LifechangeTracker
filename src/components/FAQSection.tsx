import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the date-based daily check-in work?",
    answer:
      "Life Change Tracker uses your local calendar dates (YYYY-MM-DD) rather than an arbitrary 24-hour timer. When you set your start date, Day 1 is available on that calendar day. Each scheduled day unlocks at midnight in your local timezone, keeping your journey honest and consistent.",
  },
  {
    question: "Can I set any custom personal goal without picking a category?",
    answer:
      "Yes! You can choose 'Write Your Personal Goal' and type any habit, study routine, coding goal, or fitness objective up to 160 characters. You are never forced into a predefined category.",
  },
  {
    question: "Is my challenge data stored securely and privately?",
    answer:
      "All challenge information, personal goals, notes, and completion records are saved strictly on your device using browser LocalStorage. No private data is transmitted to external tracking servers or third-party advertisers.",
  },
  {
    question: "What happens if I miss a day during my challenge?",
    answer:
      "Missed calendar days remain clearly marked as missed, keeping your historical schedule intact without silent auto-completion. You can log reflection notes on missed days to evaluate obstacles and maintain accountability.",
  },
  {
    question: "Why are future days locked until their scheduled date arrives?",
    answer:
      "A habit challenge is designed to build day-by-day neural pathways and discipline. Locking future days prevents rushing ahead or prematurely checking off future commitments.",
  },
  {
    question: "Can I complete multiple challenges or restart?",
    answer:
      "Yes. When you finish all scheduled days, you can celebrate your 100% completion, copy your achievement card, and archive it into your challenge history before beginning a new journey.",
  },
];

interface FAQSectionProps {
  soundEnabled: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ soundEnabled }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    playClickSound(soundEnabled);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-stone-200/60 dark:border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 mb-2">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Common Questions About Life Change Tracker
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Everything you need to know about setting goals, tracking daily consistency, and completing your challenge.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-2xl border border-stone-200/80 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-stone-100 dark:border-slate-800/80 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
