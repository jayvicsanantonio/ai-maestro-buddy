# MaestroBuddy Client

The frontend for MaestroBuddy, an AI-powered real-time music teacher for kids.

## Features

- **Real-Time Peak Detection**: Uses `AudioWorklet` for low-latency detection of claps and taps.
- **Rhythm Game Engine**: Interactive rhythm quest with visual feedback.
- **AI Coach UI**: Integrated feedback from "Maestro," powered by Gemini.
- **Responsive Design**: Modern, dark-mode UI built with React and Framer Motion.
- **Story-Driven Narrative**: RPG-style progression and character customization.

## Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API (AudioWorklet)

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) installed.

### Run Development Server

From the root directory:

```bash
pnpm --filter client dev
```

Or from this directory:

```bash
pnpm dev
```

## Structure

- `/src/audio`: AudioWorklet processors (e.g., `peak-processor.js`).
- `/src/components`: UI components including `RhythmQuest`, `CharacterCreator`, etc.
- `/src/hooks`: Custom hooks like `useAudioAnalyzer` and `useRhythmGame`.
- `/src/utils`: Utilities like `AudioManager`.
