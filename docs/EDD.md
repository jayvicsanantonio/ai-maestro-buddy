# MaestroBuddy Engineering Design Document

> [!NOTE]
> This document was a draft for the Gemini 3 Hackathon. Current implementation details may differ.

## Agentic Real-Time Music Teacher using Vertex AI Agent Engine / Agent Builder

**Document owner:** Team MaestroBuddy  
**Status:** Draft for Gemini 3 Hackathon implementation  
**Last updated:** 2025-12-20

---

## 1. Executive Summary

MaestroBuddy is implemented as a real-time web app with an agentic backend orchestrated via **Vertex AI Agent Engine / Agent Builder**. The system streams audio (and optional video) from the browser, runs an agent loop that uses tool calls and MCP calls to generate adaptive micro-exercises, and persists memory across sessions.

Key design goals:

- Low-latency coaching loop (teacher feels “live”).
- Transparent agent decisions (Developer HUD).
- No manual login for judges (auto guest identity).
- Clear demonstration of agentic orchestration, tool calls, external MCP, and memory.

---

## 2. Architecture Overview

### 2.1 High-level system diagram (Mermaid)

```mermaid
flowchart LR
  U[Browser: React App] -->|Audio/Video + Metrics| BFF[Cloud Run BFF API]
  BFF -->|Session + Tool Exec| AG[Vertex AI Agent Engine]
  AG -->|Model calls| G3[Gemini 3 Flash/Pro]
  AG -->|Realtime| LIVE[Gemini Live API]
  AG -->|MCP Tools| MCPGW[MCP Gateway: Cloud Run]
  MCPGW --> EXT[MCP Server(s): Content/Validator]
  BFF --> FS[(Firestore)]
  BFF --> REDIS[(Memorystore Redis)]
  BFF --> LOG[Cloud Logging/Monitoring]
```

### 2.2 Components

**Browser App**

- Captures microphone input via WebAudio.
- Captures webcam frames optionally at low FPS.
- Computes light metrics locally (tempo drift, basic pitch estimate, confidence), sends to backend for speed and stability.
- Renders feedback and quests.
- Developer HUD toggles tool call trace and state deltas.

**Cloud Run BFF (Backend For Frontend)**

- Owns authentication, session creation, and security boundaries.
- Maintains websocket connection to client for realtime updates.
- Forwards inputs to Agent Engine session.
- Executes local tools (metronome, UI patches), and calls persistence services.
- Enforces rate limits and demo caps.

**Vertex AI Agent Engine / Agent Builder**

- Hosts agent orchestration and tool calling.
- Implements multi-agent workflow or a single orchestrator agent with sub-agent tools.
- Calls Gemini 3 models for planning, evaluation, memory curation.
- Coordinates Live API interactions for realtime teacher persona.

**MCP Gateway**

- Cloud Run service that translates agent tool invocations into MCP calls.
- Supports multiple MCP servers and tool discovery (optional).
- Returns structured tool results to Agent Engine.

**Data Stores**

- Firestore: long-term memory (student model, session summaries).
- Memorystore Redis: working memory per active session (rolling window metrics, counters).
- Cloud Storage optional: short replay clips with TTL and explicit opt-in.

---

## 3. Agent System Design

### 3.1 Agent roles (logical)

You can implement these as:

- separate agents in Agent Builder, or
- one orchestrator agent with tool calls that emulate sub-agents

**A. Realtime Coach Agent**

- Runs inside Live session.
- Primary outputs are short voice/text coaching and timing cues.
- Triggers tool calls to:
  - analyze audio window
  - set metronome tempo
  - update UI feedback panel

**B. Lesson Planner Agent (Gemini 3 Flash)**

- Produces the next micro-exercise as strict JSON.
- Inputs: recent metrics, last exercise, student profile summary.
- Outputs: `next_exercise`, `difficulty_delta`, `success_metric`.

**C. Evaluator Agent (Gemini 3 Flash or Pro)**

- Verifies whether performance improved against `success_metric`.
- Produces a “confidence” score for the feedback decision.
- If confidence low, requests additional evidence or provides safer generic guidance.

**D. Memory Curator Agent (Gemini 3 Flash)**

- Writes compact memory updates:
  - new patterns
  - skill range updates
  - motivation notes
  - next-session goal
- Outputs patch-style JSON for Firestore.

**E. Safety Agent**

- Ensures kid-safe language and prevents inappropriate content.
- Redacts sensitive details before storage.

### 3.2 Agentic loop cadence

- Window size: 10–20 seconds of performance.
- Loop runs every window, or when the user stops playing.
- Each loop produces:
  - feedback message
  - updated quest state
  - next micro-exercise (optional if user is still playing)

### 3.3 Structured outputs

All agent outputs that drive state must conform to JSON Schema.
Example schemas:

- `CoachFeedback`
- `ExercisePlan`
- `EvaluationResult`
- `StudentProfilePatch`

---

## 4. Tool Calling Design

### 4.1 Tool registry

Tools are declared to Agent Engine with JSON Schemas.
Tools are executed by the BFF or MCP Gateway depending on type.

**Local tools (BFF executes)**

- `analyze_audio_window(metrics, snippet_uri?)`
- `set_metronome(bpm, pattern)`
- `update_ui(state_patch)`
- `reward_badge(type, reason)`
- `load_student_profile(uid)`
- `write_student_profile(uid, patch)`
- `append_session_event(session_id, event)`
- `rate_limit_check(uid, ip)`

**External tools (MCP via gateway)**

- `mcp.get_rhythm_exercises(level, style)`
- `mcp.get_solfege_drills(level)`
- `mcp.validate_note_sequence(expected, played_summary)`

### 4.2 MCP Gateway behavior

- Exposes a stable HTTPS interface for Agent Engine tool calls.
- Translates tool name and args into MCP protocol calls to external MCP servers.
- Normalizes responses into strict JSON outputs.
- Includes timeouts, retries, and circuit breakers.

### 4.3 Tool call tracing

Every tool call is logged with:

- session id
- tool name
- args hash (avoid raw sensitive content)
- result status and latency
- agent step identifier

This data feeds the Developer HUD and helps debugging.

---

## 5. Memory Strategy

### 5.1 Memory layers

**Short-term memory (seconds to minutes)**

- Live session conversation context.
- Rolling window buffer in Redis:
  - last N windows of metrics
  - last 3 exercises
  - last evaluation result

**Working memory (session)**

- Redis keyspace `session:{id}:*`
  - quest mode
  - current bpm
  - difficulty level
  - counters and rate limits

**Long-term memory (days to months)**

- Firestore `students/{uid}`
  - skill ranges
  - recurring error patterns
  - preferences (coach style)
  - summary of last session
- Firestore `sessions/{sessionId}`
  - window summaries, not raw streams
  - agent outputs for audit

### 5.2 Memory writeback policy

- Memory Curator Agent outputs a patch JSON.
- BFF applies patch with server-side validation.
- Raw audio/video not stored by default.
- Optional “replay” clip stored in Cloud Storage with TTL.

---

## 6. Authentication and Judge Experience

### 6.1 Requirement

Judges must not sign in.

### 6.2 Implementation

- Auto-create a “Guest” identity on first visit.
- Store identity in browser storage.
- Optionally back it with Firebase Anonymous Auth, or use a signed session cookie issued by BFF.
- The UID ties to Firestore profile and rate limits.

### 6.3 Security boundary

- Client never calls Gemini directly.
- All Gemini and Agent Engine interactions happen server-side through Cloud Run BFF.

---

## 7. API Design (BFF)

### 7.1 Endpoints

- `POST /api/session/start`
  - returns `sessionId`, initial quest state, and configuration
- `POST /api/session/input`
  - accepts audio window metrics and optional frame snapshot metadata
- `WS /api/session/stream`
  - real-time updates: feedback, UI state, audio responses
- `POST /api/session/end`
  - triggers recap generation and memory writeback
- `GET /api/session/debug`
  - returns tool call trace for Developer HUD (only in demo mode)

### 7.2 Rate limiting

- Per UID and per IP.
- Hard session cap for demo mode (3 minutes).
- Backoff messaging to client.

---

## 8. Data Model

### 8.1 Firestore: students/{uid}

```json
{
  "createdAt": "timestamp",
  "lastSeenAt": "timestamp",
  "skill": {
    "tempo_stability_bpm_min": 60,
    "tempo_stability_bpm_max": 92,
    "rhythm_error_patterns": ["late_on_beat_3"],
    "pitch_bias": "sharp",
    "confidence": 0.72
  },
  "preferences": {
    "coach_style": "calm",
    "difficulty": 2
  },
  "stats": {
    "sessionsCompleted": 3,
    "streakDays": 1
  },
  "lastSessionSummary": "Short text summary"
}
```

### 8.2 Firestore: sessions/{sessionId}

- `uid`
- `questType`
- `windowSummaries[]`
- `agentDecisions[]` (structured, compact)
- `recap`

---

## 9. Safety, Privacy, and Compliance

### 9.1 Safety controls

- Safety Agent filters coaching output.
- Avoid medical or health claims.
- Encourage and coach, never shame.

### 9.2 Privacy controls

- Do not store raw audio/video by default.
- Store derived metrics and summaries.
- Replay clips optional, short TTL, opt-in only.

---

## 10. Observability and Reliability

### 10.1 Logging

- Cloud Logging for all requests, tool calls, agent step transitions.
- Redact sensitive payloads.

### 10.2 Metrics

- Session start success rate
- Mean feedback latency per window
- Tool call error rate
- Rate limit triggers

### 10.3 Resilience

- Timeouts and retries for MCP calls.
- Fall back to generic coaching if analysis confidence is low.
- Degrade gracefully if video unavailable.

---

## 11. Implementation Plan (Hackathon)

### Day 1

- Frontend: Rhythm quest UI, mic capture, local metrics.
- BFF: session creation, websocket streaming, rate limiting.
- Agent Engine: orchestrator agent with tools declared.
- Tool calling: analyze window, set metronome, update UI.
- Developer HUD: show tool calls and state deltas.

### Day 2

- Memory: Redis session state + Firestore student profile.
- MCP Gateway + one external MCP server (content provider) and one real call path.
- Pitch quest optional.
- Demo polish and architecture diagram in README.
- Deploy to production link.

---

## Appendix A: Example JSON Schemas

### A.1 ExercisePlan

```json
{
  "type": "object",
  "required": [
    "quest",
    "bpm",
    "durationSec",
    "instructions",
    "successMetric"
  ],
  "properties": {
    "quest": { "type": "string", "enum": ["rhythm", "pitch"] },
    "bpm": { "type": "number" },
    "durationSec": { "type": "number" },
    "instructions": { "type": "string" },
    "successMetric": {
      "type": "object",
      "required": ["metric", "target", "tolerance"],
      "properties": {
        "metric": { "type": "string" },
        "target": { "type": "number" },
        "tolerance": { "type": "number" }
      }
    }
  }
}
```

### A.2 StudentProfilePatch

```json
{
  "type": "object",
  "properties": {
    "skill": {
      "type": "object",
      "properties": {
        "tempo_stability_bpm_min": { "type": "number" },
        "tempo_stability_bpm_max": { "type": "number" },
        "pitch_bias": { "type": "string" },
        "confidence": { "type": "number" }
      }
    },
    "preferences": {
      "type": "object",
      "properties": {
        "coach_style": { "type": "string" },
        "difficulty": { "type": "number" }
      }
    },
    "lastSessionSummary": { "type": "string" }
  }
}
```

---
