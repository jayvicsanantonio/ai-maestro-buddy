# MaestroBuddy

**AI-Powered Real-Time Music Teacher for Kids**

MaestroBuddy is an interactive learning platform designed to help children (ages 6-12) master rhythm and music through real-time AI coaching. Built with Gemini 1.5 Flash and Vertex AI, it provides a "kind and patient" tutor that reacts instantly to student performance.

## Features

- **Story-Driven Onboarding**: A personalized journey where Maestro guides kids through their first musical discoveries.
- **RPG Mechanics**: Character customization, leveling up, and earning "Treasure Chest" rewards for consistent practice.
- **Real-Time Rhythm Detection**: Captures microphone input and analyzes clap/tap precision against a metronome.
- **Agentic Coaching & Voice**: An AI Coach (powered by Gemini) that provides encouraging audio feedback via Google Cloud TTS.
- **Interactive Visuals**: Real-time feedback effects like "Note Bloom," "Combo Pulse," and "Sparkle Bursts" to keep learning engaging.
- **Developer HUD**: A live trace window to see the "brain" of the agent in action.
- **Premium Design**: Dark-mode aesthetic with fluid animations (Framer Motion).

## Architecture

MaestroBuddy uses a monorepo structure:

- **/client**: React frontend (Vite, TypeScript, Web Audio API, Framer Motion).
- **/server**: BFF (Node.js, Express, WebSocket, Vertex AI SDK, Google Cloud TTS).
- **/mcp-gateway**: Content library (MCP-compatible API for rhythm drills).
- **/shared**: Common types and utilities shared across the monorepo.

## Quick Start

### 1. Prerequisites

- Node.js (v18+)
- Google Cloud Project with **Vertex AI** and **Text-to-Speech** APIs enabled.
- Service Account Credentials (or `gcloud auth application-default login`).

### 2. Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```bash
GOOGLE_CLOUD_LOCATION=us-central1
PORT=3001
MCP_PORT=3002
# Optional: Defaults to gemini-2.5-flash in dev, gemini-3-flash in production
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Usage

```bash
# Install dependencies for all packages
pnpm install

# Start all components in development mode (Client, Server, and MCP Gateway)
pnpm dev
```

## Tech Stack

- **Frontend**: React, Framer Motion, Lucide icons, Vite, **AudioWorklet** (Low-latency).
- **Backend**: Express, WebSocket (`express-ws`), uuid, **Multimodal Live Bridge**.
- **AI**: Gemini 2.5/3 Flash (Custom naming), **Multimodal Live API (Real-time Audio)**, Function Calling (Tools).
- **Communication**: Real-time metrics and audio feedback via WebSockets.
- **Persistence**: File-based storage (with @google-cloud/firestore dependency included).

## License

MIT
