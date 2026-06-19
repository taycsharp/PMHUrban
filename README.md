# Phu My Hung Homes CRM

Production-style MVP for a focused Phu My Hung real-estate portal and internal broker CRM. The platform manages verified Phu My Hung rentals and sales, owners, customers, requirements, matching, viewings, deals, commissions, activity logs, users, and company settings.

## Architecture

- `backend`: FastAPI, SQLAlchemy 2, Pydantic, Alembic, JWT auth, role-based permissions, pytest.
- `frontend`: Next.js 14 App Router, React 18, TypeScript, MUI, React Query, Axios.
- `docker-compose.yml`: PostgreSQL, backend API on `8000`, frontend on `3000`.
- `.github/workflows/deploy.yml`: deploys the `dev` branch to a Linux server over SSH or a Tailscale private IP.

## Features

- Public website: home, rent, buy, property detail, project guide, about Phu My Hung living, contact.
- CRM dashboard: KPIs, properties, projects, owners, customers, requirements, matching, viewings, deals, commissions, users, settings.
- Roles: Admin, Manager, Broker/Staff, Viewer. Backend write operations reject Viewer users, and assigned-data visibility is enforced in protected CRM routes.
- Matching service: scores properties against customer requirements using budget, bedrooms, project, type, furniture, availability, and lifestyle preferences.
- Seed data: demo users, 16 Phu My Hung projects, 40 properties, owners, customers, requirements, viewings, deals, commissions, and activity logs.

## Local Setup

Copy the environment file:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Run the full stack:

```bash
docker compose up --build
```

Run migrations and seed data manually:

```bash
cd backend
alembic upgrade head
python -m app.seed
```

Run backend locally:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

Run frontend locally:

```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

- `admin@pmhhomes.local` / `password123`
- `manager@pmhhomes.local` / `password123`
- `broker1@pmhhomes.local` / `password123`
- `broker2@pmhhomes.local` / `password123`
- `viewer@pmhhomes.local` / `password123`

## API

- Health: `GET /health`
- Docs: `GET /docs`
- OpenAPI: `GET /api/v1/openapi.json`
- Route groups: `/api/v1/auth`, `/users`, `/properties`, `/projects`, `/owners`, `/customers`, `/requirements`, `/matching`, `/viewings`, `/deals`, `/commissions`, `/activities`, `/settings`, `/dashboard`, `/public/properties`, `/public/projects`.

## Deployment

The GitHub Actions workflow runs on pushes to `dev`. Configure these secrets:

- `LINUX_HOST`
- `LINUX_USER`
- `LINUX_SSH_KEY`
- `PROJECT_PATH`

Optional variable:

- `RUN_SEED=true` to run `python -m app.seed` during deployment.

The workflow fetches `origin/dev`, resets the server working tree, requires `.env`, rebuilds Docker services, runs Alembic migrations, performs backend/frontend health checks, and prints `docker compose ps`.

## Tests and Checks

Backend:

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

## Future Roadmap

- AI property description generator and AI matching explanation.
- Vietnamese, English, Korean, and Japanese listing translation.
- Zalo and WhatsApp integration.
- Google Maps integration.
- Image watermarking.
- Public SEO blog.
- Owner portal and customer saved properties.
- Contract PDF generation.
- Excel import/export.

