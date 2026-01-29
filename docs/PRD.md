# MaestroBuddy PRD

> [!NOTE]
> This document was a draft for the Gemini 3 Hackathon. Current implementation details may differ.

## Real-Time Music Teacher for Kids using Gemini 3, Gemini Live API, and Vertex AI Agent Engine

**Document owner:** Team MaestroBuddy  
**Status:** Draft for Gemini 3 Hackathon submission  
**Target users:** Kids ages 6–12, parents/guardians, educators  
**Last updated:** 2025-12-20

---

## 1. Overview

### 1.1 One-liner

MaestroBuddy is a browser-based music teacher for kids that listens and watches in real time, then gives immediate, kind, specific coaching and generates the next micro-exercise adaptively using an agentic system built on **Vertex AI Agent Engine / Agent Builder**, powered by **Gemini 3** and the **Gemini Live API**.

### 1.2 Problem

Kids often practice music without timely, correct feedback. This creates a predictable failure loop:

- They repeat mistakes and reinforce bad habits.
- They get frustrated or bored.
- Parents cannot reliably coach, even if supportive.
- Traditional lessons are expensive and do not provide minute-by-minute feedback during practice.

The core problem is not “lack of content.” It is **lack of real-time feedback and adaptive next steps**.

### 1.3 Solution

MaestroBuddy provides a tight learning loop:

1. Kid chooses a “Quest” (Rhythm, Pitch, Beginner Instrument).
2. Kid performs for 10–20 seconds (clap, sing, play).
3. System delivers instant feedback:
   - one praise (motivation)
   - one correction (biggest lever)
   - one action (next micro-exercise)
4. Difficulty and content adapt every 20–40 seconds using a persistent student model.
5. End of session produces a simple “5-minute next practice plan” for parents.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Deliver real-time coaching that feels like a patient teacher, not a grading app.
- Demonstrate an **agentic orchestration system** with tool calls, external MCP calls, and layered memory.
- Provide a frictionless judge experience with **no manual sign-in**.
- Be stable enough to demo publicly from a production link.
- Clearly show how Gemini 3 and Live API are used beyond a prompt wrapper.

### 2.2 Non-Goals (MVP)

- Perfect pitch detection for all instruments and noisy environments.
- Advanced finger tracking for complex instruments (piano fingering, violin bowing).
- Full curriculum for all music levels and instruments.
- Storing raw audio/video by default.

---

## 3. Target Users and Use Cases

### 3.1 Personas

**Kid learner (primary)**

- Age 6–12, short attention span, needs encouragement and immediate wins.
- Uses a laptop or tablet with mic and webcam.

**Parent/guardian (secondary)**

- Wants a structured practice plan without needing music expertise.
- Wants safety, privacy, and a simple progress snapshot.

**Educator / after-school program (secondary)**

- Wants a reliable “practice station” with minimal setup and clear feedback.

### 3.2 Core use cases

- “I want to practice rhythm for 5 minutes and feel like I improved.”
- “I want to practice singing pitch and get corrections right away.”
- “I want a recap I can show my parent.”
- “I want to return tomorrow and not start from zero.”

---

## 4. Potential Impact (Judging Criteria Alignment)

### 4.1 Real-world impact size

High potential impact because the product targets a universal bottleneck in learning: **feedback timing**. Many learners quit because practice is confusing and demotivating when mistakes are repeated without correction.

### 4.2 Breadth of usefulness

Broad because the MVP is instrument-light:

- Rhythm quests (clapping) work for everyone.
- Pitch quests (singing) work for everyone.
- Beginner instrument quests can start with one accessible instrument (optional).

The system can later expand into multiple instruments and classroom stations.

### 4.3 Significance of the problem and efficiency of solution

The problem is significant (habit formation, dropout). MaestroBuddy solves efficiently by:

- using short performance windows
- giving one actionable correction at a time
- adapting difficulty automatically
- reducing friction via guest access

---

## 5. Novelty and Innovation (Judging Criteria Alignment)

### 5.1 What makes it novel

- **Real-time multimodal coaching** (audio and optional video) instead of post-hoc scoring.
- **Agentic orchestration** that plans, uses tools, evaluates, and writes memory.
- **External MCP integration** so new educational tools and content sources can be added without changing the core agent logic.
- **Structured outputs** for exercise plans and memory writes, making decisions auditable, testable, and demo-friendly.

### 5.2 Why it is not “just a chatbot”

- The system operates on a repeating plan-act-evaluate loop.
- It calls tools and MCP servers to fetch exercises, validate feedback, and update state.
- It persists memory across sessions and adjusts behavior based on history.

---

## 6. Product Requirements

### 6.1 User experience requirements

- **No manual login** for judges. Auto guest session on first visit.
- “Start in under 5 seconds” target for first quest screen on reasonable connections.
- Feedback must be short, friendly, and actionable:
  - Praise: 1 sentence
  - Correction: 1 sentence
  - Next action: 1–2 sentences
- “Developer HUD” toggle to show agent tool calls and state changes during demo.

### 6.2 Functional requirements (MVP)

**Quests**

- Rhythm Quest (required)
  - Detect timing drift and consistency
  - Auto adjust tempo
  - Provide micro-exercises (clap patterns, slower tempo, repeat focus beat)
- Pitch Quest (recommended)
  - Detect pitch bias (sharp/flat) and stability
  - Provide micro-exercises (hold note, stepwise intervals, call-and-response)

**Real-time interaction**

- Live teacher voice and/or text responses with interrupt capability.
- Continuous session management for 3 minutes (demo cap) and up to 10 minutes (dev mode).

**Agent system**

- Multi-agent orchestration built with Vertex AI Agent Engine / Agent Builder:
  - Realtime Coach Agent
  - Lesson Planner Agent
  - Evaluator Agent
  - Memory Curator Agent
  - Safety Agent
- Tool calls from agents for analysis, UI updates, metronome control, and memory I/O.
- External MCP calls to at least one MCP server (content or validator).

**Memory**

- Short-term memory: rolling buffer for last N windows of metrics.
- Working memory: per-session state for fast reads.
- Long-term memory: student profile, patterns, and session summaries.

**Persistence**

- Store student model and session summaries.
- Do not store raw audio/video by default.

### 6.3 Non-functional requirements

- **Latency:** feedback cycle within 1.5 seconds for rhythm quest windows when possible.
- **Reliability:** demo should survive intermittent packet loss with graceful degradation.
- **Safety:** kid-safe language, no personally identifying outputs requested from kids.
- **Cost control:** rate limiting, demo caps, server-side Gemini calls only.

---

## 7. MVP Scope

### 7.1 Must ship (hackathon)

- Rhythm Quest end-to-end
- Live teacher responses
- Agentic tool calling loop
- Auto guest session
- Session memory and long-term memory writeback
- Developer HUD for demo credibility

### 7.2 Should ship (if time)

- Pitch Quest
- Parent recap screen (end of session)
- Basic posture hints (low FPS) with safe, general cues

### 7.3 Could ship (stretch)

- Badge system and rewards
- Class mode (multiple kids) using device IDs + profiles
- Additional MCP servers for richer exercises

---

## 8. Success Metrics

### 8.1 Demo success metrics

- Time to first quest start: < 10 seconds from page load
- Time to first feedback: < 30 seconds from start
- Tool call visibility in HUD: 100 percent of agent decisions shown
- Zero hard failures in a 3-minute run

### 8.2 Product success metrics (post-hackathon)

- Practice retention: sessions completed per user per week
- Improvement signals: reduction in drift, improved consistency over sessions
- Parent satisfaction: “I understand what to practice next” rating

---

## 9. Security, Privacy, and Safety

### 9.1 Authentication model for judges

- Default experience is a “Guest” account, created automatically.
- Users can optionally upgrade later to a full account (not required for hackathon).

### 9.2 Data handling

- Store metrics and summaries, not raw audio/video.
- If “Replay” is enabled, store short clips with explicit consent and short TTL.

### 9.3 Abuse prevention

- All Gemini calls server-side.
- Rate limits per guest identity and IP.
- Demo caps (3 minutes) and backoff messaging.

### 9.4 Safety behavior

- Encourage and coach, never shame.
- Avoid sensitive topics.
- Provide generic safety guidance for posture and breathing, avoid medical claims.

---

## 10. Demo and Presentation Plan (Judging Criteria Alignment)

### 10.1 3-minute demo script

1. Problem statement: practice without feedback.
2. Rhythm quest live: show drift meter and immediate coaching.
3. Agent HUD: show tool call and next exercise JSON.
4. Second attempt: improved timing with adapted tempo.
5. End screen: short recap and next plan.

### 10.2 Submission checklist

- Clear explanation of Gemini 3 usage (planning, evaluation, memory)
- Clear explanation of Live API usage (real-time coaching)
- Architecture diagram included
- Tool and MCP calls shown in HUD
- Link to deployed app and repo

---

## 11. Open Questions and Risks

### 11.1 Risks

- Latency spikes can break the “teacher” feeling.
- Pitch detection quality varies by microphone and environment.
- Tool calling must be robust to partial data.

### 11.2 Mitigations

- Keep rhythm MVP strong, pitch as optional.
- Use confidence scoring and safe fallbacks.
- Short windows and deterministic UI flows.

---

## Appendix A: Glossary

- **Quest:** a mini lesson mode (Rhythm, Pitch, Instrument).
- **Micro-exercise:** a short next step, 10–30 seconds, targeted at one error.
- **Agentic loop:** perceive → plan → act via tools → evaluate → write memory.
- **MCP:** Model Context Protocol, used to call external tool servers through a standard interface.
