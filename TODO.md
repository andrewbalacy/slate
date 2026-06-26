# Slate TODO

## Immediate Priority

### Performance Audit

Ask Claude Code to audit the app for performance issues.

Focus areas:

- Unnecessary rerenders
- Expensive CSS effects
- Large shadows
- Excessive backdrop blur usage
- Heavy animations
- Cursor aura performance
- Focus Mode timer rerenders
- Toast notification rerenders
- Frequent localStorage reads
- Large components that should be split
- Memoization opportunities

### Audit Prompt

```text
Audit my Next.js app for performance issues.

Look specifically for:
1. Unnecessary rerenders
2. Expensive CSS effects
3. Large shadows
4. Excessive backdrop-blur/backdrop-filter usage
5. Heavy animations
6. Cursor aura performance
7. Focus Mode timer rerenders
8. Toast notification rerenders
9. localStorage reads happening too often
10. Large components that should be split or memoized

Goals:
- Keep the premium Slate OS aesthetic intact.
- Do not remove major features.
- Suggest and implement safe performance improvements.
- Memoize components where useful.
- Move repeated calculations into helper functions.
- Avoid overengineering.
- Keep the app smooth on older MacBooks.
- Do not change visual design unless the effect is clearly too expensive.

After changes, summarize what was optimized.
```

Commit:

```bash
git add .
git commit -m "Audit and optimize Slate frontend performance"
```

---

## Refactor

### Homepage Components

Target structure:

```text
components/
└── home/
    ├── CommandCenterLayout.tsx
    ├── QuickActions.tsx
    ├── NextAction.tsx
    ├── SystemState.tsx
    ├── SystemInsights.tsx
    ├── EnergyTrend.tsx
    └── RecentActivity.tsx
```

### Daily Components

Target structure:

```text
components/
└── daily/
    ├── DailyExecutionForm.tsx
    ├── EnergySelector.tsx
    ├── SegmentedControl.tsx
    ├── SystemStatePreview.tsx
    ├── RuleExplanation.tsx
    └── RecommendationProtocol.tsx
```

### Shell Components

Target structure:

```text
components/
└── shell/
    ├── SlateShell.tsx
    ├── CommandPalette.tsx
    ├── CursorAura.tsx
    ├── ToastProvider.tsx
    ├── FocusMode.tsx
    └── SystemClock.tsx
```

---

## Logic Extraction

Move reusable logic into:

```text
lib/
├── slateEngine.ts
├── systemState.ts
├── recommendationProtocols.ts
├── insights.ts
├── logStorage.ts
└── nextAction.ts
```

---

## Shared Types

Create:

```text
types/
├── slate.ts
└── logs.ts
```

Suggested types:

- DailyInput
- SlateLog
- SystemState
- Recommendation
- RecommendationProtocol
- NextAction

---

## UX Improvements

### Homepage

- Align Quick Actions and Next Action perfectly
- Keep homepage within one desktop viewport
- Avoid unnecessary cards
- Keep left column action-oriented
- Keep right column observational

### Daily Execution

- Add keyboard support for energy selector
- Allow left and right arrow adjustments
- Add Enter key support for generating plans
- Add disabled state until required inputs are ready
- Improve date input styling if needed

### Logs

- Delete individual log
- Export logs
- Import logs
- Clear all logs confirmation
- Improve empty state

### Focus Mode

- Add completion button
- Save focus session duration
- Add session completion toast
- Store sessions in logs

---

# Roadmap

## v0.4 — Refactor & Stabilization

- Component cleanup
- Performance optimization
- Shared types
- Logic extraction
- Better data model

## v0.5 — Intelligence

- Pattern detection
- Recovery risk trends
- Workday fatigue patterns
- Recommendation accuracy improvements
- Execution health score

## v0.6 — Completion Tracking

- Did you execute the plan?
- Not yet / partial / complete
- Compare planned vs executed
- Track adherence without streak pressure

## v0.7 — Cloud Sync

- Supabase or Firebase
- User accounts
- Cross-device memory
- Execution log backups

## v0.8 — Domain Modules

Potential modules:

- School
- Training
- Finance
- Career
- Recovery

## v0.9 — Agent Layer

Only after the app has stable modules.

Potential agents:

- Execution Agent
- School Agent
- Training Agent
- Finance Agent
- Recovery Agent

---

## Demo Flow

1. Open Homepage
2. Show Command Center
3. Show System State
4. Show Next Action
5. Open Daily Execution
6. Change energy and state inputs
7. Show recommendation changes in real time
8. Generate a plan
9. Save a log
10. Show toast notifications
11. Open Logs
12. Demonstrate execution memory
13. Launch Focus Mode
14. Explain that the system was built in a single day