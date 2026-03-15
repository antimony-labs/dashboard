# AGENTS - AI Developer Instructions

This repository (antimony-labs/dashboard) is the project tracking interface for the antimony-labs ecosystem.
All AI agents MUST read this file before modifying the codebase.

## Architectural Rules
1. **The Face (Dashboard)**:
   - This is a Next.js App Router application.
   - It is designed to be deployed to **Cloudflare Pages**. Do not use features that require a persistent Node.js server (e.g., avoid heavy Next.js SSR that crashes on Edge).
   - Use static generation or edge runtime where applicable.

2. **The Backend Engine (`core`)**:
   - The Next.js frontend MUST NOT communicate with local IPs or directly with database servers.
   - It communicates with the backend via public Cloudflare mapped routes (e.g., `api.too.foo`).
   - The backend `core` API architecture handles all business logic.

## Workflow Rules
- Keep tasks small and well-scoped.
- You MUST strictly follow the design system outlined in `UI_STANDARDS.md`.
- No inline CSS. Use global classes or modular Vanilla CSS.
- "LLM Slop" is strictly forbidden. Refactor aggressively. Keep the Next.js components small.
