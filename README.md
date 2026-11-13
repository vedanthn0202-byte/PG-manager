# PG Connect

PG Connect is a responsive management app for Bengaluru paying guest accommodation owners. The current working slice includes owner registration and sign-in, a protected owner workspace, property and room setup, individual bed availability, tenant profiles, check-in, and checkout. Data is stored by the API and scoped to the signed-in owner.

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

Billing, online/offline payments, deposits, expenses, and financial reports are represented in the workspace navigation but are not implemented yet. The rent, pricing, payment methods, and tenant invitation decisions in the specification remain open, so those workflows are not hard-coded prematurely. Passwords use Python's memory-hard `scrypt` function; browser sessions use signed, HttpOnly cookies.

## Product decisions

Rent due date, rent pricing defaults, payment methods and tenant onboarding are still pending confirmation in the specification. Billing and payment behavior will be based on those decisions before implementation.
