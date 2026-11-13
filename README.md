# PG Connect

PG Connect is a responsive management app for Bengaluru paying guest accommodation owners. The first working slice includes owner registration and sign-in, a protected owner workspace, and property creation backed by the API.

## Project layout

- `frontend/` — React and TypeScript web application.
- `backend/` — FastAPI API foundation.
- `infrastructure/` — local service configuration.
- `docs/development-specification.md` — product and technical specification.

## Run locally

### Web app

```powershell
cd frontend
npm install
npm run dev
```

### API

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API uses SQLite locally by default. Its health endpoint is available at `http://localhost:8000/health`; interactive API documentation is at `http://localhost:8000/docs`. PostgreSQL configuration is provided in `backend/.env.example` for the Docker database service.

## Current scope

Rooms and beds, tenant records, billing, payments, expenses, and reports are represented in the workspace navigation but are not implemented yet. The rent, pricing, payments, and tenant onboarding decisions in the specification remain open, so those workflows are not hard-coded prematurely.

## Product decisions

Rent due date, rent pricing defaults, payment methods and tenant onboarding are still pending confirmation in the specification. Billing and payment behavior will be based on those decisions before implementation.
