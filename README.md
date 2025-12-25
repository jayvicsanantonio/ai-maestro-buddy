# MaestroBuddy

**AI-Powered Real-Time Music Teacher for Kids**

MaestroBuddy is an interactive learning platform designed to help children (ages 6-12) master rhythm and music through real-time AI coaching. Built with Gemini 1.5 Flash and Vertex AI, it provides a "kind and patient" tutor that reacts instantly to student performance.

## Features

- **Real-Time Rhythm Detection**: Captures microphone input and analyzes clap/tap precision against a metronome.
- **Agentic Coaching**: An AI "Coach" (powered by Gemini) that provides encouraging feedback and adapts lesson difficulty on the fly.
- **Dynamic Exercise Library**: Fetches drills from an MCP Gateway based on student skill levels.
- **Developer HUD**: A live trace window to see the "brain" of the agent in action.
- **Premium Design**: Dark-mode aesthetic with fluid animations (Framer Motion).

## Architecture

MaestroBuddy uses a monorepo structure:

- **/client**: React frontend (Vite, TypeScript, Web Audio API).
- **/server**: BFF (Node.js, Express, WebSocket, Vertex AI SDK).
- **/mcp-gateway**: Content library (MCP-compatible API for rhythm drills).

## Quick Start

### 1. Prerequisites

- Node.js (v18+)
- Google Cloud Project with Vertex AI enabled.
- Service Account Credentials (or `gcloud auth application-default login`).

### 2. Environment Setup

Create a `.env` file in `/server` based on `.env.example`:

```bash
GOOGLE_CLOUD_PROJECT=your-project-id
PORT=3001
MCP_GATEWAY_URL=http://localhost:3002/mcp/execute
```

### 3. Usage

```bash
# Install dependencies for all packages
pnpm install

# Start all components in development mode
pnpm dev
```

## Tech Stack

- **Frontend**: React, Framer Motion, Lucide icons, Vite.
- **Backend**: Express, WebSocket (`express-ws`), uuid.
- **AI**: Gemini 1.5 Flash (Vertex AI), Function Calling (Tools).
- **Communication**: Real-time metrics via WebSockets.

## License

MIT
