# MaestroBuddy MCP Gateway

The Model Context Protocol (MCP) gateway for MaestroBuddy, serving as a content and knowledge provider.

## Role

The gateway translates generic tool requests from the AI Coach into specific musical educational content. This allows the AI to stay updated with new exercises and theory lessons without changing the core agent logic.

## Tools Provided

- `get_rhythm_exercises`: Returns a list of curated rhythm patterns based on level and style.
- `get_music_fact`: Provides fun musical trivia for student engagement.
- `get_theory_lesson`: Delivers short, targeted theory explanations (e.g., rhythm, tempo, dynamics).

## Tech Stack

- **Runtime**: Node.js (Express)
- **Protocol**: Custom MCP-compatible over HTTP

## Getting Started

From the root directory:

```bash
pnpm --filter mcp-gateway dev
```

Or from this directory:

```bash
pnpm dev
```
