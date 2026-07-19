# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

Open `index.html` directly in Chrome (double-click), or serve locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Chrome is required for speech recognition. TTS works anywhere with a `pl-PL` voice installed.

## Architecture

Pure vanilla JS, no build step, no dependencies. Scripts are loaded in dependency order in `index.html` — each module is an IIFE that exposes a single global (`window.State`, `window.UI`, etc.).

**Data flow**: `data/lessons.js` and `data/badges.js` declare globals → JS modules consume them → `app.js` is the top-level controller.

**Module responsibilities:**
- `js/state.js` — all user progression, persisted to `localStorage` under key `polski-zubr-v1`
- `js/srs.js` — Leitner spaced-repetition scheduling (box 0–5, due dates)
- `js/speech.js` — Web Speech API wrappers (TTS + recognition)
- `js/gamification.js` — XP, levels, streak, daily goal (30 min), badge checks
- `js/exercises.js` — exercise generation and answer checking for all types (MCQ, listen, type, word-bank, fill-in, pronunciation)
- `js/session.js` — builds a session array mixing new items + due SRS reviews
- `js/ui.js` — DOM helpers, mascotte, toasts, confetti, sounds
- `js/app.js` — screen navigation, exercise loop, DOMContentLoaded boot

## Content editing

All pedagogical content lives in `data/lessons.js`. To add or fix vocabulary/grammar, edit only that file. Item `id` values (e.g. `v-11-...`) must remain stable — they are the SRS keys in localStorage.

Badges are defined in `data/badges.js` (emoji, title, description, unlock condition).
