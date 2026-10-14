# Life Change Taker — Habit Tracker & Daily Challenges

Life Change Taker is a production-quality, responsive habit-tracking and daily challenge application designed to help individuals build consistency, improve discipline, and achieve long-term personal goals across 7 to 300-day journeys.

## User Review & Critical Decisions

> [!IMPORTANT]
> The questions regarding missed day handling, sound behavior, and companion tools were reviewed. To provide a seamless, non-punitive, yet disciplined experience matching the prompt's specifications, the following defaults are adopted:
>
> 1. **Missed Day Progression**: Missed calendar days remain clearly marked as missed, keeping the scheduled challenge timeline strictly intact without silent auto-completion. Users can review previous days and log catch-up reflections.
> 2. **Audio Feedback**: Subtle Web Audio feedback (soft click, day completion chime, challenge completion fanfare) will start muted by default to respect user environments, with an accessible one-click sound toggle in the navigation bar.
> 3. **Daily Reflection & Milestones**: Each completed day records an optional reflection note and unlocks milestone badges (e.g. Day 1 First Step, 25% Quarter Mark, 50% Halfway, 100% Champion).

---

## 1. Overview & Core Concept

- **What It Does**: Enables users to commit to a structured duration (7, 14, 21, 30, 60, 90, 100, 200, or 300 days) across 16 categorized personal goals (or custom goals), compute inclusive calendar start and end dates, complete eligible days in their local timezone, track completion percentages, and celebrate milestones.
- **Target Audience**: Students, professionals, fitness enthusiasts, and individuals pursuing habit change, digital detox, language acquisition, or personal discipline.
- **Key Value**: Low friction, instant client-side LocalStorage privacy (no sign-up wall), authentic calendar-date progression that prevents premature day completion, and a serene, uplifting visual aesthetic.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Discovery & Duration Selection**: User lands on the sunrise hero section, scrolls to the curated pastel duration grid (7 to 300 days), and clicks their target timeframe.
2. **Setup Modal**: Opens a focused modal requesting Name, Goal selection (from 16 respectful predefined goals or custom input), Start Date (defaults to today in local timezone), and displays the auto-calculated inclusive End Date.
3. **Active Challenge Dashboard**: The view updates to show a personalized greeting ("Keep going, [Name]!"), countdown statistics, animated progress bar, and an interactive Day Card calendar grid.
4. **Daily Check-In**: On the scheduled day, the user clicks "Complete Day [N]". A micro-celebration triggers (confetti particles, optional chime), updates progress, and locks until the next calendar day.
5. **Completion Ceremony**: Upon completing the final scheduled day, a celebration modal opens with celebratory statistics, motivational congratulations, and options to celebrate or start a new challenge.

### Visual Identity & Theme
- **Aesthetic Direction**: Minimal, serene, uplifting, and modern. Inspired by dawn sunlight and mountain horizons.
- **Color Palette & Theme Tokens**:
  - *Light Mode*: Dominant warm-white canvas (`#fafaf9`), soft pastel card tints (Sky `#e0f2fe`, Mint `#dcfce7`, Lavender `#f3e8ff`, Peach `#ffedd5`, Rose `#ffe4e6`, Cream `#fef9c3`), slate typography (`#0f172a`), emerald success accents (`#059669`).
  - *Dark Mode*: Deep charcoal canvas (`#090d16` / `#0f172a`), elevated slate surfaces (`#1e293b`), muted pastel borders with gentle glowing accents, high contrast legibility.
- **Typography & Hierarchy**:
  - *Display*: Plus Jakarta Sans / Outfit for crisp, warm modern headers.
  - *Body*: Inter / Manrope for readable, balanced prose.
  - *Metrics & Dates*: Tabular figures (`tabular-nums font-mono`) for precision counters and calendar alignment.
- **Micro-Interactions & Audio**:
  - Web Audio synthesizer generating pure, organic harmonic sine-waves for soft clicks, cheerful major triad completion chimes, and victorious milestone fanfare.
  - Framer Motion page reveals, button press spring scales, and celebratory canvas confetti.

---

## 3. Key Product Decisions & Trade-Offs

- **Date-Based Progression Engine vs. Millisecond Interval**:
  - *Chosen Approach*: Pure local calendar date calculations (`YYYY-MM-DD` string comparisons in user's local timezone).
  - *Why*: Prevents timezone drift and Daylight Saving shifts. A day starts at midnight in the user's physical timezone rather than arbitrary 86,400,000ms rolling windows.
- **Privacy-First Local Storage**:
  - *Chosen Approach*: Persist state in `localStorage` under `life_change_taker_state` with schema versioning.
  - *Why*: Zero friction, zero tracking, instant offline reliability. Includes a clear privacy notice informing users that data is stored locally in their current browser.
- **Predefined Goals Respect & Tone**:
  - *Chosen Approach*: All 16 goals (from Academic Focus and English Speaking to Screen Time Reduction and Habit Management) formatted with dignified, encouraging language.
- **SEO & Social Sharing Architecture**:
  - *Chosen Approach*: Complete metadata in `index.html`, dynamic canonical URLs, Open Graph card preview, JSON-LD `WebApplication` structured data, `/public/robots.txt`, and `/public/sitemap.xml`.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                      Life Change Taker                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐      ┌─────────────────┐     ┌─────────────────┐
│ Navbar       │      │ Hero Section    │     │ Challenge Grid  │
│ - Brand Logo │      │ - Sunrise Photo │     │ - 7 to 300 Days │
│ - Theme Sw.  │      │ - Dual CTAs     │     │ - Pastel Cards  │
│ - Sound Sw.  │      │ - Eyebrow Prose │     │ - Duration Badg.│
└──────────────┘      └─────────────────┘     └────────┬────────┘
                                                       │
                               ┌───────────────────────┘
                               ▼
               ┌───────────────────────────────┐
               │ Challenge Setup Modal         │
               │ - Name & Goal Selection       │
               │ - Start Date & End Date Calc  │
               └───────────────┬───────────────┘
                               ▼
               ┌───────────────────────────────┐
               │ Active Challenge Dashboard    │
               │ - Personalized Greeting       │
               │ - Progress Bar & Stats        │
               │ - Day Cards Grid (1 to N)     │
               │ - Eligibility & Check-In      │
               │ - Reset & Switch Actions      │
               └───────────────┬───────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐              ┌─────────────────┐
│ Completion Celebrations      │              │ Footer & Guide  │
│ - Daily Toast & Mini-Confetti│              │ - How It Works  │
│ - Final Milestone Modal      │              │ - 3 Benefits    │
│ - Web Audio Sound Engine     │              │ - Clean Links   │
└──────────────────────────────┘              └─────────────────┘
```

### Data Schema (`ChallengeState`)
```typescript
interface DayRecord {
  dayNumber: number;
  scheduledDate: string; // ISO date 'YYYY-MM-DD'
  isCompleted: boolean;
  completedAt?: string;  // ISO timestamp
  reflectionNote?: string;
}

interface ActiveChallenge {
  id: string;
  userName: string;
  goalId: string;
  goalTitle: string;
  durationDays: number;
  startDate: string;     // 'YYYY-MM-DD'
  endDate: string;       // 'YYYY-MM-DD'
  createdAt: string;
  days: DayRecord[];
  isFinished: boolean;
  finishedAt?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
}
```

### Component Hierarchy
- `App.tsx`: Top-level state coordinator, theme manager, sound engine integration, and modal controller.
- `Navbar.tsx`: Responsive navigation, brand emblem, sound toggle, theme switch, mobile menu.
- `HeroSection.tsx`: Sunrise backdrop, motivational typography, quick scroll CTAs.
- `ChallengeGrid.tsx`: 9 duration cards (7, 14, 21, 30, 60, 90, 100, 200, 300 days) with responsive pastel styling.
- `ChallengeSetupModal.tsx`: Accessible dialog for user name, 16 goals + custom, date pickers with validation.
- `ActiveChallengeDashboard.tsx`: Live streak counter, percentage progress bar, calendar grid with day cards.
- `DayCard.tsx`: Individual day status indicator (Completed, Current/Eligible, Missed, Locked).
- `CelebrationModal.tsx`: Confetti canvas and milestone achievement summary.
- `HowItWorks.tsx` & `BenefitsSection.tsx`: Editorial step-by-step guidance and mindset principles.
- `Footer.tsx`: Subtle copyright, links, and privacy declaration.
- `audio.ts`: Web Audio API synthesizer for clean, zero-dependency sound effects.
