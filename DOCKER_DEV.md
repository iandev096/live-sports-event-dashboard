# Docker Development Guide

This guide explains how to use Docker for backend development in the live sports event dashboard.

## Quick Start

### Option 1: Docker Backend + Local Frontend (Recommended)

```bash
# Start frontend locally and backend in Docker
pnpm dev:docker
```

### Option 2: Everything in Docker

```bash
# Start backend in Docker
pnpm docker:backend:dev

# In another terminal, start frontend locally
pnpm dev:frontend
```

## Available Scripts

### Development Scripts

- `pnpm dev:docker` - Start frontend locally + backend in Docker
- `pnpm docker:backend:dev` - Start only backend in Docker
- `pnpm docker:backend:stop` - Stop Docker backend
- `pnpm docker:backend:restart` - Restart Docker backend

### Build Scripts

- `pnpm docker:backend:build` - Build production Docker image
- `pnpm docker:backend:build:dev` - Build development Docker image

### Debugging Scripts

- `pnpm docker:backend:logs` - View backend logs
- `pnpm docker:backend:shell` - Open shell in backend container

## Development vs Production Docker

### Development Docker (`Dockerfile.dev`)

- **Hot reloading** with nodemon
- **All dependencies** (including dev dependencies)
- **Faster rebuilds** for development
- **Source code mounted** for live updates

### Production Docker (`Dockerfile`)

- **Optimized build** with multi-stage
- **Only production dependencies**
- **Security hardened** with non-root user
- **Health checks** enabled

## File Structure

```
apps/backend/
├── Dockerfile          # Production Docker image
├── Dockerfile.dev      # Development Docker image
└── src/
    └── index.ts        # Your backend code

docker-compose.yml      # Production compose
docker-compose.dev.yml  # Development compose
```

## Development Workflow

1. **Start development environment:**

   ```bash
   pnpm dev:docker
   ```

2. **Make changes to backend code:**

   - Edit files in `apps/backend/src/`
   - Changes are automatically reloaded

3. **View logs:**

   ```bash
   pnpm docker:backend:logs
   ```

4. **Debug issues:**

   ```bash
   pnpm docker:backend:shell
   # Inside container:
   ls -la
   cat package.json
   ```

5. **Stop when done:**
   ```bash
   pnpm docker:backend:stop
   ```

## Troubleshooting

### Backend won't start

```bash
# Check logs
pnpm docker:backend:logs

# Rebuild development image
pnpm docker:backend:build:dev
pnpm docker:backend:dev
```

### Port already in use

```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process or change port in docker-compose.dev.yml
```

### Container permissions issues

```bash
# Rebuild with fresh permissions
docker-compose -f docker-compose.dev.yml down
docker system prune -f
pnpm docker:backend:build:dev
pnpm docker:backend:dev
```

## Benefits of Docker Development

1. **Consistent environment** - Same as production
2. **Isolated dependencies** - No local Node.js version conflicts
3. **Easy debugging** - Container logs and shell access
4. **Team consistency** - Everyone uses the same setup
5. **Production parity** - Catches Docker-specific issues early
