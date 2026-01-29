# MaestroBuddy Server

The Backend For Frontend (BFF) for MaestroBuddy, providing AI orchestration and real-time coaching.

## Features

- **Gemini Orchestration**: Manages chat sessions with Gemini (2.5/3 Flash) to provide musical feedback.
- **WebSocket Gateway**: Handles real-time communication for performance metrics and coach responses.
- **Text-to-Speech**: Integrates with Google Cloud TTS to give Maestro a "kind and patient" voice.
- **Tool Execution**: Implements local tools for UI updates, metronome control, and character badges.
- **External Integration**: Connects to the MCP Gateway for educational content.

## Tech Stack

- **Runtime**: Node.js (Express 5)
- **AI**: `@google-cloud/vertexai`
- **Voice**: `@google-cloud/text-to-speech`
- **Real-time**: `express-ws` / `ws`

## Configuration

Requires a `.env` file in this directory or the root:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GEMINI_MODEL=gemini-2.5-flash # or gemini-3-flash
PORT=3001
MCP_GATEWAY_URL=http://localhost:3002/mcp/execute
```

## Getting Started

From the root directory:

```bash
pnpm --filter server dev
```

Or from this directory:

```bash
pnpm install
pnpm dev
```
