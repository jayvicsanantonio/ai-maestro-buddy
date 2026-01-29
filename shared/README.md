# MaestroBuddy Shared

A shared package containing common TypeScript types and utilities used by both the `client` and `server`.

## Contents

- **Types**:
  - `StudentProfile`: Data structure for persistent student information.
  - `CharacterSettings`: Configurations for the musical hero (color, accessories, etc.).
  - `QuestState`: Represents the current active session and difficulty.
  - `ToolLog`: Schema for tracking agent decisions in the Developer HUD.

## Usage

This package is a workspace dependency in the monorepo.

```json
"dependencies": {
  "@ai-maestro-buddy/shared": "workspace:*"
}
```
