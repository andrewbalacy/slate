# Slate TODO

## Completed — v0.4 Refactor & Stabilization

- Consolidated Slate engine into lib/slateEngine.ts
- Added shared types under types/
- Formalized storage layer in lib/slateStorage.ts
- Audited and optimized frontend performance
- Extracted homepage components into components/home/
- Extracted Daily Execution components into components/daily/
- Organized shell components into components/shell/

---

## Next — v0.5 Intelligence

Focus areas:

- Pattern detection
- Recovery risk trends
- Workday fatigue patterns
- Recommendation accuracy improvements
- Execution health score

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

## v0.4 — Refactor & Stabilization ✓

- Component cleanup
- Performance optimization
- Shared types
- Logic extraction
- Better data model

## v0.5 — Intelligence ✓

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
