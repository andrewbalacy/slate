# Slate Decisions

## Product Identity

Slate is an operating system, not a productivity application.

Slate should feel like a calm, premium personal operating system.

Avoid:

- To-do app aesthetics
- Gamified streaks
- Motivational fluff
- Busy dashboards
- Bright productivity colors

Prefer:

- OS shell
- Command center
- System state
- Execution memory
- Rule-based recommendations
- Calm dark premium aesthetic

---

## Core Philosophy

Slate is built around:

Capacity
↓
Rules
↓
Execution

The app should always begin with current capacity, apply rules, and return an executable plan.

---

## Recommendation Style

Recommendations should be analytical, not emotional.

Avoid:

- You got this.
- Keep grinding.
- Stay positive.

Prefer:

- Moderate capacity detected.
- Execute intentionally.
- Stop before fatigue compounds.

---

## Execution Philosophy

Slate should scale down before scaling up.

Low capacity does not mean failure. It should trigger Strict Floor.

---

## Strict Floor

Strict Floor represents minimum viable execution.

Used when:

- Energy is low
- Cognitive load is high
- Work day creates constraint
- Recovery risk is elevated

Purpose:

Protect consistency without forcing excessive output.

---

## Deep Work

Deep Work is only recommended when capacity is high enough.

Deep Work means:

- Single objective
- Protected focus
- No context switching
- 60-90 minute focus window
- High-value work only

---

## Standard Plan

Standard Plan is the default moderate-capacity recommendation.

It should include intentional execution without overextending.

---

## Recovery

Recovery is a valid recommendation, not a failure state.

Recovery means reducing load and preparing for tomorrow.

---

## Homepage Information Hierarchy

The homepage should answer:

- Where am I?
- What happened?
- What should I do next?

Current homepage structure:

Left = Action  
Right = Observability

Left column:

- Identity
- Quick Actions
- Next Action

Right column:

- System State
- System Insights
- Energy Trend
- Recent Activity

---

## Quick Actions

The large philosophy card was removed because it felt redundant and took up prime homepage space.

It was replaced with Quick Actions:

- Daily Execution
- Logs
- Architecture

---

## Next Action

Next Action belongs under Quick Actions, not the right sidebar.

Reason:

The right sidebar is observational. Next Action is action-oriented.

---

## Focus Mode Placement

Focus Mode should launch from the Next Action card.

Reason:

Focus Mode is an execution extension of the current recommendation.

---

## Toast Notifications

Toast notifications should be global, bottom-right, subtle, and OS-like.

Avoid loud alerts or intrusive modals.

---

## Energy Input

Energy should use an interactive dot/bar selector instead of a plain number input.

Reason:

It feels like configuring system state rather than filling out a form.

---

## Rule Explanation

Slate should explain why a recommendation was chosen.

Reason:

Slate is a rule engine. Showing the rule logic makes it feel trustworthy and intelligent.

---

## Recommendation Protocols

Each recommendation should include examples and execution rules.

Examples:

- Strict Floor
- Standard Plan
- Deep Work
- Recovery

Reason:

The app should not only say what mode the user is in. It should clarify what that mode means behaviorally.

---

## Persistence

Use localStorage for v0.2 memory.

Current key:

```txt
slate_logs