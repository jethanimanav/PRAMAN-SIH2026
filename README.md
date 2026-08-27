# PRAMAN

Pilot Readiness Assessment, Matching And Navigation.

PRAMAN is a Smart India Hackathon 2026 prototype for SIH26136: Startup-Friendly Public Procurement Mechanism. It demonstrates how a Government of Maharashtra department can move from a problem statement to an evidence-ready procurement review handoff without pretending that simulated demo data is real.

## Architecture

Next.js App Router frontend -> FastAPI backend -> PostgreSQL 16 with pgvector.

The judge demo also includes a deterministic local fallback engine so the prototype works offline without OpenAI, Gemini, DPIIT, GeM, CPPP, government SSO, external vector services, or model downloads.

## Tech Stack

- Frontend: Next.js, TypeScript strict mode, Tailwind CSS, Lucide React, Recharts.
- Backend: Python, FastAPI, Pydantic, deterministic service modules.
- Database: PostgreSQL 16, pgvector, UUIDs, JSONB-oriented schema seed.
- Infra: Docker and Docker Compose.

## Folder Structure

```text
frontend/   Next.js app, components, features, types, API client
backend/    FastAPI app, services, tests
database/   SQL seed and migration notes
docker/     Reserved for deployment helpers
```

## Run Locally

```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:8000  
Swagger: http://localhost:8000/docs  
PostgreSQL: localhost:5432

## Demo Credentials

All accounts use password `demo123` and simulated MFA code `123456`.

- officer@praman.local
- evaluator@praman.local
- startup@praman.local
- admin@praman.local
- auditor@praman.local
- ciso@praman.local

## Judge Demo Guide

1. Login as `officer@praman.local`.
2. Click `Load Hero Scenario`.
3. Click `Structure with PRAMAN AI`.
4. Click `Approve Requirement`.
5. Click `Run Match`.
6. Confirm SkylineAI Solutions is ranked #1 at 93/100.
7. Click `Shortlist SkylineAI`.
8. Click `Fast-forward Pilot`.
9. Click `Calculate Readiness`.
10. Click the `91/100` trace value, then inspect the evidence drawer and graph.
11. Submit the human decision reason.
12. Generate the handoff pack.
13. Request consent for Mumbai, Nashik, or Nagpur in Scale & Reuse.

## Simulated Data

Every seeded record and demo result is `SIMULATED`. The UI displays persistent `DEMO MODE` and `SIMULATED DATA` badges. PRAMAN does not claim live DPIIT verification, GeM integration, CPPP integration, government SSO, real contracts, real procurement decisions, or real government savings.

## Offline Fallback

The backend exposes the same API contracts while using deterministic local engines for:

- eligibility checks
- BM25-like lexical ranking
- dense retrieval interface
- Reciprocal Rank Fusion
- TOPSIS-style score aggregation
- pilot success scoring
- procurement readiness
- handoff generation

The health endpoint reports `READY FOR DEMO` when the seeded hero scenario and local engines are available.

## Testing

From `backend/`:

```bash
pytest
```

Tests cover RRF, SkylineAI ranking, readiness, pilot score transparency, and the end-to-end hero workflow.

## Known Limitations

This is a locally runnable SIH prototype. Database persistence is scaffolded and seeded, while the demo lifecycle state is intentionally deterministic in the FastAPI layer for repeatable judging. Authentication and MFA are simulated. No procurement award is created; the handoff pack is decision-support material for authorized human review.
