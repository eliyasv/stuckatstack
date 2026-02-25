# Stuckatstack- Recommendations for tech stack
---
A recommendation web application built with Next.js (App Router), TypeScript, and SQLite, designed with production-ready Docker architecture and a full CI/CD pipeline using GitHub Actions.

This project demonstrates end-to-end engineering practices including reproducible builds, containerisation, security scanning, and automated image publishing.

---

### App features

- Smart Recommendations — Tech stack suggestions based on your requirements
- Detailed Explanations — Know *why* each technology is recommended
- Source Citations — References to engineering books & blogs
- Scaling Roadmap — 3-stage growth plan with cost estimates
- Comparison View — See alternatives and why they weren't chosen

### DevOps Features

- SQLite persistence (better-sqlite3)
- Multi-stage Docker production build
- Dev vs production environments
- Non-Root container executions
- Persistent database via Docker volume
- GitHub Actions CI pipeline
- Container security scanning (Trivy)
- Automated image publishing to GHCR
- Ready for CD deployment workflow
- Multi-architecture Docker images

---

## Docker Quick Start

### Run with Docker  (Local Development)

```bash
# Build image
docker compose build --no-cache

# Run dev environment with hot reload (Dev container mounts source code for live reload)
docker compose up app

# Open
http://localhost:3000
```

### Production-like Local Run

```bash
# Build image

# Run optimised production build
docker compose up app-prod or docker compose --profile production up

# Open (change portbinding to 3001:3000 in docker-compose.yml if running both env to avoid conflicts)
http://localhost:3000
```

###  From GHCR

```bash
# Pull the image locally
docker pull ghcr.io/eliyasv/stuckatstack:latest

# Run the image
docker run -p 3000:3000 ghcr.io/eliyasv/stuckatstack:latest

# Open
http://localhost:3000
```
```bash
docker images | grep stuckatstack

# Production image
ghcr.io/eliyasv/stuckatstack:latest   5870d6870e0d        222MB             0B   U    
stuckatstack-app-prod:latest          4818e817e586        222MB             0B        

# Local Development image
stuckatstack-app:latest               3d83607d4a5d       1.23GB             0B   
```
---

## Project Structure

```
stuckatstack/
├── .github/workflows/
│   └── ci-cd.yml          # CI/CD pipeline
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/               # Core logic
│   └── types/             # TypeScript types
├── data/                  # SQLite database (mounted volume)
├── Dockerfile             # Multi-stage build
├── docker-compose.yml     # Local development
├── .dockerignore          # Build context exclusions
├── .gitignore             # Files Git should ignore
├── .eslintrc.json         # ESLint configuration
└── package.json           # Project metadata, scripts, deps
``` 

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Actions                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   Build  │→ │ Security │→ │ Docker Build &   │   │
│  │  & Test  │  │   Scan   │  │     Push         │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
                          |
                  ┌───────────────┐
                  │     ghcr      │
                  │  (Registry)   │
                  └───────────────┘
                          |
      if deploy (toggle true and add job steps)
        ┌─────────────────┴─────────────────┐
        |                                   |
┌───────────────┐                   ┌───────────────┐
│   Railway     │                   │  Your Server  │
│   (Cloud)     │                   │   (VPS)       │
└───────────────┘                   └───────────────┘
```

---

## Technology Stack

### Application

* Frontend - Next.js 14 (App Router) + TypeScript 
* Styling - TailwindCSS 
* Backend - Next.js API Routes 
* Database - SQLite (better-sqlite3) 
* Decision Engine - Rule-based system 

### DevOps

* Containerization - Docker (multi-stage) 
* CI/CD - GitHub Actions 
* Registry - GHCR
* Security - Trivy, npm audit 
* Monitoring - Docker health checks 

---

### Best Practices Applied

-  Non-root user in container
-  Multi-stage build (minimal attack surface)
-  Slim base image (Alpine had deps issue with better-sqlite3)
-  Automated vulnerability scanning
-  Health checks for monitoring

---

### Pipeline Jobs

#### CI Pipeline

- The GitHub Actions pipeline validates every change by:
- Installing dependencies (npm ci)
- Type checking (tsc)
- Linting (if present)
- Building the Next.js production build
- Running dependency security audit
- Running Trivy security scan

This ensures the repository is reproducible and safe.

#### Container Publishing (GHCR)

- On push to main, the pipeline:
- Builds the production Docker image
- Tags the image (latest + commit SHA)
- Publishes to GitHub Container Registry

Example image:
ghcr.io/<owner>/stuckatstack:latest

This enables immutable deployment workflows.

#### Security

- Security is integrated into CI via:
  * npm audit
  * Trivy filesystem scan

This models a DevSecOps-style pipeline.

#### CD Workflow (not impimented, but the pipeline supports if needed)

The pipeline is structured to support automated deployment:

- build -> scan -> publish -> deploy 
A deployment stage can pull the latest image and restart the service using Docker Compose.
---

### Engineering Decisions

Key decisions:

- Slim base image instead of Alpine (Alpine had deps issue with better-sqlite3)
- SQLite for simplicity and portability
- Multi-stage Dockerfile for reproducible builds
- Next standalone for smaller production images
- Non-root container runtime
- GitHub actions for CI 
- GHCR for registry integration with GitHub
- CI security scanning
- Lint included but initially non-blocking.

---

## Sources for decision engine

The decision engine incorporates principles from:

### Books
- **Designing Data-Intensive Applications** — Martin Kleppmann
- **Site Reliability Engineering** — Google
- **Building Microservices** — Sam Newman
- **Accelerate** — Nicole Forsgren et al.
- **The Lean Startup** — Eric Ries
- **Team Topologies** — Matthew Skelton & Manuel Pais

### Engineering Blogs
- Netflix Tech Blog, Uber Engineering, AWS Architecture Blog

---

## License

MIT

---
