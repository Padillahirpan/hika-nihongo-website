# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview


 is a Japanese language learning application built with Next.js 14, focusing on Hiragana and Katakana characters for JLPT N5 level. The app features interactive drilling with progressive unlock system, progress tracking, and speech synthesis.

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand with localStorage persistence
- **Context**: React Context for Theme and Language
- **Styling**: Tailwind CSS with custom Japanese design system
- **Language**: JavaScript/JSX (no TypeScript)

### Directory Structure
```
/
├── app/                    # Next.js App Router pages
│   ├── page.js           # Home page with character grid
│   ├── layout.js         # Root layout
│   ├── providers.jsx     # Theme and Language providers
│   ├── hiragana/         # Hiragana learning section
│   ├── katakana/         # Katakana learning section
│   ├── drilling/         # Interactive drilling practice
│   ├── kanji/            # Kanji section (in progress)
│   └── settings/         # Settings page
├── components/           # Reusable React components
├── contexts/            # React contexts (Theme, Language)
├── stores/              # Zustand stores (hiragana-store, katakana-store)
├── hooks/               # Custom React hooks
├── data/                # Static data (kana data, welcome text)
├── util/                # Utility functions
└── locales/             # Internationalization files
```

## State Management Architecture

### Zustand Stores
- **hiragana-store.js**: Manages Hiragana character progress and mastery
- **katakana-store.js**: Manages Katakana character progress and mastery
- Both stores use `zustand/persist` for localStorage persistence

### React Contexts
- **ThemeContext**: Dark/light theme switching
- **LanguageContext**: Multi-language support (Japanese, English, Indonesian)

### Legacy Migration
The project recently migrated from custom localStorage hooks to Zustand. Some legacy hooks may exist for backward compatibility.

## Key Features

### Progressive Learning System
- Characters are locked initially and unlocked through progression
- 80% mastery threshold required for unlocking new sections
- Sections: Gojuon, Sokuon, Dakuon, Youon

### Progress Tracking
- Individual character mastery levels
- Session history and scoring
- Visual progress indicators with color coding
- Persistent data via localStorage

### Speech Synthesis
- Custom `useSpeech` hook for character pronunciation
- Browser-specific error handling

## Styling System

### Tailwind Configuration
- Custom Japanese color palette
- Noto Sans JP font for Japanese characters
- Plus Jakarta Sans for Latin text
- Custom blob animations
- Dark mode support

### Design Patterns
- Responsive design for all screen sizes
- Component-based architecture
- Consistent spacing and typography
- Color-coded mastery levels (red → yellow → green)

## Development Workflow

### Pre-commit Hooks
- Husky and lint-staged configured
- Automatic Prettier formatting on commit
- Ensures code consistency

### Code Style
- Prettier configuration: semi-colons, single quotes, 80 char width, 2 tab width
- Functional components with hooks
- ES6+ JavaScript features

## Data Organization

### Static Data
- Kana characters organized by type (Gojuon, Sokuon, Dakuon, Youon)
- Welcome text and UI text in multiple languages
- Question generation algorithms for drilling

### Progress Data
- Stored in localStorage via Zustand persist
- Includes mastery levels, scores, and session history
- Persistent across browser sessions

## Browser Compatibility

The app includes error handling for:
- Speech synthesis API availability
- localStorage support
- Responsive design for various screen sizes

## Current Development Status

- **Hiragana**: ✅ Complete
- **Katakana**: ✅ Complete
- **Kanji**: ⏳ In progress
- **Vocabulary**: ⏳ Planned
- **PWA**: ⏳ Planned

## Special Patterns

### Question Generation
- Prioritization algorithm for drilling practice
- Weighted random selection based on mastery levels
- Adaptive difficulty progression

### Component Organization
- Section-based components for each kana type
- Reusable UI components (ProgressBar, Modal, etc.)
- Custom hooks for complex logic
