# PG Connect

PG Connect is a responsive management app for Bengaluru paying guest accommodation owners. This repository starts with the owner workspace and property inventory foundation described in the development specification.

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
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API health endpoint is available at `http://localhost:8000/health`; interactive API documentation is at `http://localhost:8000/docs`.

## Product decisions

Rent due date, rent pricing defaults, payment methods and tenant onboarding are still pending confirmation in the specification. Billing and payment behavior will be based on those decisions before implementation.
