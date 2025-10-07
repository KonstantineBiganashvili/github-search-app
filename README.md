<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## GitHub Search App

Microservices-based NestJS application that lets users sign up/sign in and search GitHub repositories via a secure API Gateway.

### Quick start (zero config)

Run everything with a single command using the provided test compose file. No changes or local env files are required.

```bash
docker compose -f docker-compose-test.yml up --build -d
```

What you get out of the box:

- API Gateway: http://localhost:3000 (Swagger at `/api`)
- Auth Service (TCP): 3001; GitHub Service (TCP): 3002
- Postgres: 5432 with seeded defaults from `docker-compose-test.yml`
- Uses `.env.docker.example` automatically for service envs (e.g. `JWT_SECRET=changeme`)

Stop all:

```bash
docker compose -f docker-compose-test.yml down -v
```

### Architecture

- **API Gateway (`apps/api-gateway`)**: HTTP entrypoint. Exposes REST endpoints, validates input, enforces JWT auth, hosts Swagger docs at `/api`.
- **Auth Service (`apps/auth-app`)**: TCP microservice handling user creation, credential verification, and JWT issuance/validation.
- **GitHub Service (`apps/github-app`)**: TCP microservice that calls the GitHub REST API, applies optional sorting and filtering, and returns normalized results.
- **Shared libs (`libs/*`)**: Configuration and structured logging via Winston.

### Tech stack

- NestJS 11, TypeScript 5
- Microservices over TCP
- JWT auth (`@nestjs/jwt`, `passport-jwt`)
- Axios for outbound HTTP
- Winston with daily rotate logs

---

## Getting started

```bash
$ npm install
```

### Environment variables

The system reads configuration from process env. For Docker, variables are provided via `.env.docker` referenced in `docker-compose.yml`.

Required/important variables:

- `API_GATEWAY_PORT` (default: `3000`)
- `AUTH_SERVICE_HOST` (default: `0.0.0.0` in service containers)
- `AUTH_SERVICE_PORT` (default: `3001`)
- `GITHUB_SERVICE_HOST` (default: `0.0.0.0` in service containers)
- `GITHUB_SERVICE_PORT` (default: `3002`)
- `JWT_SECRET` (required)
- `JWT_EXPIRATION` (default: `1h`)
- `GITHUB_API_URL` (default: `https://api.github.com`)
- `GITHUB_API_TOKEN` (optional, increases GitHub rate limits)

If you plan to enable persistent users storage later, Postgres envs are already wired in `docker-compose.yml` (`DATABASE_*`), but the current sample users repo is in-memory in the Auth service code.

---

## Run with Docker (recommended)

1. Create a `.env.docker` at the project root (example):

```bash
JWT_SECRET=your-local-secret
JWT_EXPIRATION=1h
GITHUB_API_TOKEN=
# Optional database envs if you wire a DB
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

Services and ports:

- API Gateway: http://localhost:3000
- Auth Service (TCP): 3001
- GitHub Service (TCP): 3002

Swagger UI: http://localhost:3000/api

Stop:

```bash
docker compose down
```

---

## Run locally without Docker

In separate terminals:

1. Auth Service (TCP microservice on 3001)

```bash
npx nest start apps/auth-app -w
```

2. GitHub Service (TCP microservice on 3002)

```bash
npx nest start apps/github-app -w
```

3. API Gateway (HTTP on 3000)

```bash
npx nest start apps/api-gateway -w
```

Ensure you export at least `JWT_SECRET` in your shell for all three processes, or create a `.env` loader of your choice.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API

Base URL (gateway): `http://localhost:3000`

Swagger docs: `GET /api`

### Auth

#### POST /auth/signup

Request body:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

Response (201):

```json
{
  "user": { "id": "u1", "email": "user@example.com" },
  "accessToken": "<jwt>"
}
```

#### POST /auth/signin

Request body:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

Response (200): same shape as signup.

### GitHub

Secured with Bearer JWT.

#### GET /github/search

Query params:

- `query` (string, required): search term forwarded to GitHub Search API.
- `sort` (enum: `asc` | `desc`, optional): client-side sort by repository name.
- `ignore` (string, optional): filters out repos whose names contain this substring (case-insensitive).

Example:

```http
GET /github/search?query=nestjs&sort=asc&ignore=demo HTTP/1.1
Host: localhost:3000
Authorization: Bearer <jwt>
```

Response (200):

```json
[
  {
    "id": 123,
    "name": "nest",
    "fullName": "nestjs/nest",
    "description": "...",
    "htmlUrl": "https://github.com/nestjs/nest",
    "stars": 65000,
    "language": "TypeScript",
    "owner": {
      "login": "nestjs",
      "avatarUrl": "https://avatars.githubusercontent.com/u/28507035?v=4"
    }
  }
]
```

Error cases:

- 400: Upstream GitHub error or invalid query.
- 401: Missing/invalid JWT.

---

## Development

### Scripts

```bash
# build all apps
npm run build

# lint
npm run lint

# e2e tests
npm run test:e2e

# e2e per service
npm run test:e2e:api-gateway
npm run test:e2e:auth-app
npm run test:e2e:github-app
```

### Logging

Winston logger is configured with console output and daily rotating file logs under `logs/app-YYYY-MM-DD.log`. Adjust `LOG_LEVEL`/`FILE_LOG_LEVEL` via env.

### Project layout

```
apps/
  api-gateway/      # REST gateway + Swagger
  auth-app/         # Auth microservice (TCP)
  github-app/       # GitHub microservice (TCP)
libs/
  config/           # Config module (placeholder for future expansion)
  logger/           # Winston logger module
```

---

## Security

- All GitHub search endpoints require a valid JWT (Bearer token).
- JWT secret and expiration are configurable via env.

## Notes

- The GitHub service optionally uses `GITHUB_API_TOKEN` for higher rate limits.
- The Auth service currently demonstrates the flow with hashing and JWT. Wire a real database by implementing the `users` repository with TypeORM and enabling the provided Postgres envs.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

This repository is provided as part of a coding exercise. No license granted.
