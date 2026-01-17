# Docker Expert Skill

## Purpose
Master Docker containerization for building secure, optimized, and production-ready applications with multi-stage builds, security hardening, and modern BuildKit features for 2025.

## When to Use
- Containerizing applications for consistency across environments
- Building CI/CD pipelines
- Microservices deployment
- Development environment standardization
- Cloud-native application deployment
- Kubernetes and orchestration platforms

## Key Capabilities

### Docker Core Concepts
- **Images**: Read-only templates for creating containers
- **Containers**: Runnable instances of images
- **Dockerfile**: Instructions for building images
- **Layers**: Cached build steps for efficiency
- **Volumes**: Persistent data storage
- **Networks**: Container communication

### Modern Features (2025)

#### BuildKit (Default since Docker 23.0)
- Parallel build stages
- Advanced caching
- Build secrets management
- SSH forwarding
- Multi-platform builds

#### Docker 25.x Features
- Improved compression
- Enhanced security scanning
- Better resource management
- BuildKit optimizations

### Multi-Stage Builds
- Separate build and runtime environments
- Dramatically reduce image sizes
- Exclude build tools from production
- Improve security posture

## Best Practices

### 1. Multi-Stage Builds for Optimization
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Security: Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 2. Optimize Layer Caching
```dockerfile
# Bad: Changes to code invalidate all layers
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm build

# Good: Dependencies cached separately
FROM node:20-alpine
WORKDIR /app

# Copy dependency files first (changes rarely)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code (changes frequently)
COPY . .
RUN npm run build
```

### 3. Use Specific Tags, Never :latest
```dockerfile
# Bad: Unpredictable, breaks reproducibility
FROM node:latest

# Good: Pinned to specific version
FROM node:20.11.0-alpine3.19

# Better: Use digest for immutability
FROM node:20-alpine@sha256:abc123...
```

### 4. Security Hardening
```dockerfile
FROM node:20-alpine

# Update packages
RUN apk update && apk upgrade

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

WORKDIR /app

# Copy files with correct ownership
COPY --chown=appuser:appuser . .

# Install dependencies
RUN npm ci --only=production

# Switch to non-root user
USER appuser

# Run container as read-only
# docker run --read-only ...

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js || exit 1

EXPOSE 3000
CMD ["node", "server.js"]
```

### 5. Minimize Image Size
```dockerfile
# Use Alpine-based images
FROM node:20-alpine  # ~40MB vs node:20 ~900MB

# Multi-stage build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

# Minimal runtime
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main /usr/local/bin/
CMD ["main"]
```

### 6. .dockerignore File
```dockerignore
# Prevent copying unnecessary files
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
*.md
.vscode
.idea
dist
coverage
.cache
*.test.js
*.spec.js
Dockerfile
docker-compose.yml
```

### 7. Handle Secrets Securely
```dockerfile
# Bad: Secrets in image layers
ARG API_KEY
RUN echo "API_KEY=${API_KEY}" > .env

# Good: Use BuildKit secrets
# docker build --secret id=api_key,src=.env .
FROM node:20-alpine
WORKDIR /app
RUN --mount=type=secret,id=api_key \
    API_KEY=$(cat /run/secrets/api_key) npm install

# Or use Docker Secrets at runtime
# docker service create --secret api_key myapp
```

### 8. Resource Limits
```dockerfile
# In Dockerfile
LABEL com.docker.resource.cpu="1"
LABEL com.docker.resource.memory="512M"

# Or at runtime
# docker run --cpus="1.5" --memory="512m" myapp
```

### 9. Health Checks
```dockerfile
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=5s \
            --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# For non-HTTP apps
HEALTHCHECK CMD pidof myapp || exit 1
```

### 10. BuildKit Advanced Features
```dockerfile
# syntax=docker/dockerfile:1.4

FROM node:20-alpine

# Cache mount for package managers
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Bind mount for build context
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --only=production

# SSH mount for private dependencies
RUN --mount=type=ssh \
    npm install private-package
```

## Docker Compose Best Practices

### Production-Ready Compose File
```yaml
version: '3.8'

services:
  app:
    image: myapp:1.0.0
    build:
      context: .
      dockerfile: Dockerfile
      target: production
      cache_from:
        - myapp:cache
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    env_file:
      - .env
    secrets:
      - db_password
    volumes:
      - app-data:/app/data
      - type: tmpfs
        target: /tmp
    networks:
      - frontend
      - backend
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend

secrets:
  db_password:
    file: ./db_password.txt

volumes:
  app-data:
  postgres-data:

networks:
  frontend:
  backend:
```

## Dockerfile Patterns

### Node.js Application
```dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package*.json ./

USER nodejs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1

CMD ["node", "dist/main.js"]
```

### Go Application
```dockerfile
# syntax=docker/dockerfile:1.4
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.* ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /app/main .

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 8080
HEALTHCHECK --interval=30s CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]
```

### Python Application
```dockerfile
# syntax=docker/dockerfile:1.4
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

FROM base AS builder

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --user -r requirements.txt

FROM base AS production

WORKDIR /app

# Copy Python dependencies
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

# Security: Non-root user
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s CMD python healthcheck.py || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

## Security Best Practices

### 1. Image Scanning
```bash
# Docker Scout (built-in)
docker scout cves myapp:latest
docker scout recommendations myapp:latest

# Trivy
trivy image myapp:latest

# Snyk
snyk container test myapp:latest
```

### 2. Rootless Docker
```bash
# Run Docker daemon as non-root user
dockerd-rootless-setuptool.sh install

# Run containers as non-root
docker run --user 1001:1001 myapp
```

### 3. Security Scanning in CI/CD
```yaml
# GitHub Actions example
- name: Build image
  run: docker build -t myapp:${{ github.sha }} .

- name: Run Trivy scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:${{ github.sha }}
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### 4. Read-Only Containers
```bash
# Mount filesystem as read-only
docker run --read-only \
  --tmpfs /tmp \
  --tmpfs /var/run \
  myapp

# In Docker Compose
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

### 5. Drop Capabilities
```bash
# Drop all capabilities, add only needed ones
docker run --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  myapp

# In Dockerfile
# docker run with --security-opt=no-new-privileges
```

## Performance Optimization

### 1. BuildKit Cache Mounts
```dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-alpine

# Cache npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Cache go modules
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
```

### 2. Parallel Builds
```dockerfile
# syntax=docker/dockerfile:1.4
FROM base AS deps-1
RUN install-deps-1

FROM base AS deps-2
RUN install-deps-2

FROM base AS final
COPY --from=deps-1 /output /
COPY --from=deps-2 /output /
```

### 3. Use COPY Instead of ADD
```dockerfile
# Bad: ADD has implicit behavior
ADD https://example.com/file.tar.gz .

# Good: Explicit and predictable
COPY package.json .
```

### 4. Combine RUN Commands
```dockerfile
# Bad: Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# Good: Single layer
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

## Networking

### Custom Networks
```bash
# Create custom bridge network
docker network create --driver bridge myapp-network

# Run containers on network
docker run --network myapp-network --name app myapp
docker run --network myapp-network --name db postgres

# Containers can communicate using service names
# app can reach db at: postgres://db:5432
```

### Docker Compose Networking
```yaml
services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

## Volumes & Data Persistence

### Named Volumes
```bash
# Create volume
docker volume create app-data

# Use volume
docker run -v app-data:/app/data myapp

# Backup volume
docker run --rm -v app-data:/source -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /source .
```

### Bind Mounts (Development)
```bash
# Mount local directory
docker run -v $(pwd)/src:/app/src myapp

# Read-only mount
docker run -v $(pwd)/config:/app/config:ro myapp
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: myapp:${{ github.sha }},myapp:latest
          cache-from: type=registry,ref=myapp:cache
          cache-to: type=registry,ref=myapp:cache,mode=max
```

## Pitfalls to Avoid

### 1. Don't Run as Root
```dockerfile
# Bad
FROM node:20
COPY . .
CMD ["node", "server.js"]  # Runs as root

# Good
FROM node:20
RUN useradd -m appuser
USER appuser
COPY --chown=appuser . .
CMD ["node", "server.js"]
```

### 2. Don't Use :latest in Production
```dockerfile
# Bad
FROM node:latest

# Good
FROM node:20.11.0-alpine3.19
```

### 3. Don't Embed Secrets
```dockerfile
# Bad
ENV API_KEY=secret123
ARG PASSWORD=password

# Good: Use runtime secrets
# docker run --env-file .env myapp
# Or BuildKit secrets
```

### 4. Don't Ignore .dockerignore
```dockerfile
# Without .dockerignore: Copies everything including node_modules
COPY . .

# With .dockerignore: Efficient, smaller context
COPY . .
```

### 5. Don't Skip Health Checks
```dockerfile
# Add health checks for reliability
HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1
```

## Tools & Ecosystem

- **Build**: BuildKit, docker buildx
- **Security**: Docker Scout, Trivy, Snyk, Clair
- **Registry**: Docker Hub, Amazon ECR, Google Container Registry, GitHub Container Registry
- **Orchestration**: Docker Swarm, Kubernetes
- **Monitoring**: Prometheus, Grafana, cAdvisor

## References

- [Docker Best Practices](https://docs.docker.com/build/building/best-practices/)
- [Multi-stage Builds Guide](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/)
- [Docker Best Practices 2025 Guide](https://docs.benchhub.co/docs/tutorials/docker/docker-best-practices-2025)
- [Better Stack: Docker Build Best Practices](https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/)
- [Optimize Dockerfiles for Speed, Size and Security](https://cloudnativenow.com/topics/cloudnativedevelopment/docker/smarter-containers-how-to-optimize-your-dockerfiles-for-speed-size-and-security/)
- [10 Docker Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)

---

**Last Updated**: December 2025
**Skill Level**: Expert
**Category**: DevOps / Containerization
