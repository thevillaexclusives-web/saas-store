# AGENTS.md

## Purpose

This project should be built in a way that is:

- clean
- modular
- easy to extend
- consistent in UI and UX
- safe to refactor
- aligned with a simple design system
- production-minded, even when moving fast

This file defines how all contributors and coding agents should work inside this codebase.

---

# Core Principles

## 1. Prefer clarity over cleverness

Write code that is easy to read, easy to review, and easy to replace.

Rules:

- use explicit names
- avoid deeply nested logic
- avoid “magic” helper abstractions too early
- keep functions focused on one job
- do not compress logic just to make files shorter

Bad:

- one hook that fetches, transforms, validates, and submits everything

Good:

- separate fetch logic, state logic, and UI rendering

---

## 2. Build small, composable modules

Every feature should be split into reusable layers.

Use this mental model:

- UI layer
- feature/business layer
- data layer
- shared system layer

Do not let page files become the place where everything happens.

---

## 3. Consistency beats personal preference

If there are multiple valid ways to do something, choose the one already used in the project.

Agents should:

- follow existing patterns first
- only introduce a new pattern when it clearly improves maintainability
- refactor duplicated patterns when repetition becomes harmful

---

## 4. Design before decoration

UI should feel intentional, not random.

Always prioritize:

- spacing
- hierarchy
- readability
- states
- consistency

Before adding visual flair, make sure:

- layout is balanced
- typography is predictable
- colors are semantically assigned
- components feel related

---

## 5. Keep business logic out of presentational components

Components that render UI should not carry heavy decision-making.

Prefer:

- `lib/` or feature-specific helpers for transformations
- hooks for stateful orchestration
- server actions/services for backend interaction
- UI components that mostly receive prepared props

---

## 6. Default to scalable structure, not overengineering

This is a simple stack:

- Next.js
- Tailwind
- Supabase

Keep it lean.

Do not add:

- unnecessary global state
- excessive class abstractions
- large architecture patterns that the app does not need yet

Add complexity only when repetition or growth demands it.

---

# Tech Expectations

## Stack

- Next.js
- Tailwind CSS
- Supabase

## General standards

- use TypeScript everywhere
- prefer server-first patterns when appropriate
- keep client components minimal
- validate inputs at boundaries
- handle loading, empty, and error states
- avoid any usage unless absolutely necessary

---

# Project Structure

Use a feature-oriented structure with shared primitives.

Example:

```txt
src/
  app/
    (marketing)/
    (dashboard)/
    api/

  components/
    ui/
    layout/
    feedback/

  features/
    auth/
      components/
      hooks/
      services/
      queries/
      types/
      utils/
    profile/
    dashboard/

  lib/
    supabase/
    utils/
    validations/
    constants/

  styles/
    globals.css
    tokens.ts

  types/
```

# Agent Execution Rules

When implementing tasks, always:

- read nearby files before changing patterns
- match existing conventions before inventing new ones
- make the smallest clean change that solves the problem
- extract only when reuse or clarity justifies it
- avoid touching unrelated files
- keep diffs focused
- preserve backward compatibility unless the task requires change
- update or create shared components when repetition appears
- prefer explicitness over hidden abstractions

For UI work:

- reuse existing primitives first
- maintain spacing and typography consistency
- avoid one-off styles when a shared token or variant should exist
- include hover, focus, disabled, loading, empty, and error states where relevant

For data work:

- keep Supabase access centralized
- type responses clearly
- validate inputs at boundaries
- do not mix data fetching, transformation, and rendering in one file

For refactors:

- improve structure without changing behavior unless required
- avoid large rewrites unless explicitly asked
- keep the project easier to maintain after every change
