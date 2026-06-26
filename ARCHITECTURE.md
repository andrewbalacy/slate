# Slate Architecture

## Project Overview

Slate is a fatigue-aware execution operating system built with Next.js, React, TypeScript, and Tailwind CSS.

Slate is not a traditional productivity application. It does not optimize for streaks, guilt, or maximum output. Its purpose is to determine the minimum effective execution plan based on the user's current capacity.

Core philosophy:

Capacity
↓
Rules
↓
Execution

---

## Current Version

**Slate v0.3 — Command Center + Focus Mode**

---

## Core Product Model

Slate accepts daily state inputs:

- Date
- Day
- Energy
- Cognitive Load
- Work Today
- Training Today
- Constraint

From those inputs, Slate derives:

- Capacity
- Operating Mode
- Recovery Risk
- Recommendation
- Rule Explanation
- Generated Execution Plan

---

## Core Pages

### Home

The homepage functions as the Slate command center and should feel like an operating system dashboard rather than a traditional website landing page.

Current layout:

#### Left Column
- Slate Identity
- System Online Indicator
- Quick Actions
  - Daily Execution
  - Logs
  - Architecture
- Next Action Card

#### Right Column
- System State
- System Insights
- Energy Trend
- Recent Activity

---

### Daily Execution

**Route:** `/daily`

**Purpose:**
Configure current system state and generate an adaptive execution recommendation.

Current features:

- Auto-filled date and day
- Interactive energy selector
- Segmented controls
- Constraint input
- Live System State Preview
- Live Rule Explanation panel
- Dynamic Recommendation Protocol card
- Generate Plan button
- Save Log button
- Toast notifications

---

### Logs

**Route:** `/logs`

**Purpose:**
Execution memory.

Current features:

- Saved logs via localStorage
- Weekly Review panel
- Average energy
- Work day counts
- Training day counts
- Top constraints
- Energy Trend graph
- Generated plans
- Recent log cards

---

### Architecture

**Route:** `/architecture`

**Purpose:**
Explain how Slate's rule engine works.

Sections:

- Strict Floor
- Adaptive Ceiling
- Training Logic
- Financial Review
- Weekly Execution
- Memory Layer
- Recommendation Logic

---

## Global System Features

### Slate OS Shell

Global layout includes:

- Dark premium OS aesthetic
- Ambient radial background
- Thin borders
- Glass panels
- Global clock
- System online indicator
- Boot animation
- Cursor aura
- Command palette

---

### Command Palette

Open via:

- Cmd + K
- Ctrl + K

Commands:

- Home
- Daily Execution
- Logs
- Architecture

---

### Toast Notifications

Current events:

- Plan generated
- Log saved
- Execution memory updated
- Focus Mode entered
- Focus Mode exited

---

### Focus Mode

Launches from the Next Action card.

Purpose:

Provide a distraction-free execution environment.

Displays:

- Current objective
- Recommendation
- Estimated effort
- Target shutdown
- Live elapsed session timer
- Exit Focus Mode

---

## Data Storage

Current persistence layer:

localStorage
└── slate_logs

Important:

- Browser-local only
- No cross-device sync
- Not stored in Git or project files
- Future database layer should replace or supplement localStorage

---

## Proposed Logic Organization

lib/
├── slateEngine.ts
├── systemState.ts
├── recommendationProtocols.ts
├── insights.ts
├── logStorage.ts
└── focusMode.ts

---

## Recommended Component Structure

components/
├── home/
│   ├── CommandCenter.tsx
│   ├── QuickActions.tsx
│   ├── NextAction.tsx
│   ├── SystemState.tsx
│   ├── SystemInsights.tsx
│   ├── EnergyTrend.tsx
│   └── RecentActivity.tsx
│
├── daily/
│   ├── EnergySelector.tsx
│   ├── SegmentedControl.tsx
│   ├── SystemStatePreview.tsx
│   ├── RuleExplanation.tsx
│   └── RecommendationProtocol.tsx
│
├── shell/
│   ├── SlateShell.tsx
│   ├── CommandPalette.tsx
│   ├── CursorAura.tsx
│   └── ToastProvider.tsx

---

## Performance Considerations

Slate intentionally uses premium visual effects:

- Glass panels
- Backdrop blur
- Large shadows
- Cursor aura
- Animations
- Focus Mode timer
- Toast notifications

Performance should be audited for:

- Unnecessary rerenders
- Expensive backdrop filters
- Heavy shadows
- Frequent localStorage reads
- Timer rerender scope
- Cursor aura smoothing
- Large components that should be memoized or split