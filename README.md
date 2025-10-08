## GitHub Search App

Microservices-based NestJS application with an API Gateway, Auth service, and GitHub service. All HTTP routes are prefixed with `/api`, Swagger is at `/api/swagger`.

### Prerequisites

- Node.js 22 (LTS) and npm
- Docker and Docker Compose (for containerized runs)

### Quick start (test docker compose)

Runs everything with sensible defaults; no local env files required.

```bash
docker compose -f .\docker-compose-test.yml --env-file .env.docker.example up --build
```

Services:

- API Gateway: http://localhost:3000 (Swagger: http://localhost:3000/api/swagger)
- Auth Service (TCP): 3001
- GitHub Service (TCP): 3002
- Postgres: 5432 (internal to the compose network)

Stop:

```bash
docker compose -f docker-compose-test.yml down -v
```

### Run in development (no Docker)

Open three terminals and ensure `JWT_SECRET` is set in your environment for all.

```bash
# 1) API Gateway (HTTP :3000)
npm run start:dev api-gateway

# 2) Auth Service (TCP :3001)
npm run start:dev auth-api

# 3) GitHub Service (TCP :3002)
npm run start:dev githbu-api
```

Base URL: http://localhost:3000/api

Swagger: http://localhost:3000/api/swagger

### Run with Docker (production-like)

1. Create `.env.docker` at the project root (minimal):

```bash
JWT_SECRET=your-secret
JWT_EXPIRATION=1h
# Optional DB if you enable persistence
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=github_search
DATABASE_SYNCHRONIZE=false
DATABASE_SSL=false
```

2. Start all services:

```bash
docker compose up --build -d
```

Visit Swagger: http://localhost:3000/api/swagger

Stop:

```bash
docker compose down
```

### Useful scripts

```bash
npm run build     # build all apps
npm run lint      # lint and fix
npm run test      # unit tests
npm run test:e2e  # e2e tests for all services
```

### Documentation

View code documentation generated with Compodoc:

```bash
npm run docs:generate  # generate static docs
npm run docs:open      # open docs in browser
npm run docs:serve     # serve with live reload (optional)
```

### Project layout

```
apps/
  api-gateway/   # REST gateway (+ Swagger)
  auth-api/      # Auth microservice (TCP)
  github-api/    # GitHub microservice (TCP)
libs/
  config/        # Config module
  logger/        # Winston logger module
```
