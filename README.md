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

Requirements:

- Python 3.11+
- Node.js 20 LTS or newer compatible runtime
- Docker Desktop if using PostgreSQL through Compose

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

Open:

- Public site: `http://localhost:3000`
- CRM login: `http://localhost:3000/login`
- Backend docs: `http://localhost:8000/docs`

Run migrations and seed data manually:

```bash
cd backend
alembic upgrade head
python -m app.seed
```

Run backend locally with PostgreSQL:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
export DATABASE_URL=postgresql+psycopg://pmh:pmh@localhost:5432/pmh_homes
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

Run backend locally with a disposable SQLite database:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
rm -f dev.db
DATABASE_URL=sqlite:///./dev.db alembic upgrade head
DATABASE_URL=sqlite:///./dev.db python -m app.seed
DATABASE_URL=sqlite:///./dev.db uvicorn app.main:app --reload
```

Run frontend locally:

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## Demo Accounts

- `admin@pmhhomes.local` / `password123`
- `manager@pmhhomes.local` / `password123`
- `broker1@pmhhomes.local` / `password123`
- `broker2@pmhhomes.local` / `password123`
- `viewer@pmhhomes.local` / `password123`

Role behavior:

- Admin: full Phu My Hung CRM access.
- Manager: team-oriented visibility and assignment workflow.
- Broker: assigned Phu My Hung properties, customers, appointments, and deals.
- Viewer: read-only CRM UI; backend write APIs return `403`.

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
npm run lint
npm run build
```

Security audit:

```bash
cd frontend
npm audit
```

Current note: direct `axios` advisories were fixed by upgrading to `1.18.0`, the vulnerable `eslint-config-next` dependency was removed, and `postcss` is overridden to `8.5.15`. NPM still reports one advisory against Next 14 itself; npm's available fix is a major upgrade to Next 16, so this MVP remains on Next 14 until a planned framework upgrade is accepted. The unused Next image remote pattern config was removed to avoid exposing the Image Optimizer path in this app.

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
