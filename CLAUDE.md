# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cloud 9 is a voice-based therapeutic companion app for users with intellectual disabilities. It uses real-time voice AI via LiveKit for warm, patient conversational therapy.

**Monorepo structure:**
- `pm-fe/` — Next.js 16 + React 19 + TypeScript frontend
- `pm-be/` — Python 3.12+ FastAPI backend with LiveKit voice agents

## Development Commands

### Frontend (`pm-fe/`)
```bash
cd pm-fe
npm run dev        # Dev server on http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

### Backend (`pm-be/`)
```bash
cd pm-be
uv run uvicorn server:app --reload --port 8000   # FastAPI token server
uv run python agents/agent.py dev                 # Run voice agent in dev mode
```

Backend uses `uv` as package manager with `pyproject.toml` and `uv.lock`.

## Architecture

### Voice Pipeline
Frontend connects to LiveKit via WebRTC. The backend agent processes audio through:
**Deepgram STT (nova-3)** → **Google Gemini 2.5 Flash (LLM)** → **Cartesia TTS (sonic-3)**

With Silero VAD for voice activity detection and BVC noise cancellation.

### Frontend
- Next.js App Router with two routes: `/` (main therapy UI) and `/agent-test` (voice agent testing)
- Tailwind CSS v4 for styling, inline CSS-in-JS for animations
- LiveKit React components (`@livekit/components-react`) for WebRTC integration
- State is local React hooks only (no global state library)
- Token fetched from backend `POST http://localhost:8000/token`
- Path alias: `@/*` maps to project root

### Backend
- `server.py` — FastAPI app with single `POST /token` endpoint generating LiveKit access tokens. CORS configured for localhost:3000.
- `agents/agent.py` — LiveKit `AgentServer` using `rtc_session` decorator. Configures the full voice pipeline (STT/LLM/TTS/VAD) and loads system prompt.
- `prompts/CLOUD_9_SYSTEM_PROMPT.md` — Therapeutic system prompt emphasizing simple language (under 20 words per sentence), no jargon, no "why" questions, validation-focused responses.

### Frontend UI Flow
Home screen → Mood picker (5 faces) → Confirmation → Voice session (animated waveform) → Menu (Memory Games, Reflection, Vacation)

## Environment Variables

Both frontend and backend need LiveKit credentials (`LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`).

Backend additionally needs: `DEEPGRAM_API_KEY`, `GOOGLE_API_KEY`, `CARTESIA_API_KEY`.

Frontend vars go in `pm-fe/.env.local`, backend vars in `pm-be/.env`.
