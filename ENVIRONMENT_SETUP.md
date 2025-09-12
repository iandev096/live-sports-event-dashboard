# Environment Configuration Guide

This guide explains how environment variables work across different deployment scenarios.

## Environment Variables

### **Backend .env File:**

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sports_dashboard?schema=public"

# Server
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration
POSTGRES_DB=sports_dashboard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

## How Docker Compose Uses Environment Variables

### **Variable Substitution:**

Docker Compose uses `${VARIABLE_NAME:-default_value}` syntax:

- **`${PORT:-3001}`** - Uses `PORT` from .env, defaults to `3001`
- **`${POSTGRES_DB:-sports_dashboard}`** - Uses `POSTGRES_DB` from .env, defaults to `sports_dashboard`

### **Development (docker-compose.dev.yml):**

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-sports_dashboard}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"

  backend:
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=${PORT:-3001}
      - DATABASE_URL=${DATABASE_URL:-postgresql://postgres:password@postgres:5432/sports_dashboard?schema=public}
    ports:
      - "${PORT:-3001}:3001"
```

### **Production (docker-compose.yml):**

```yaml
services:
  backend:
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${PORT:-3001}
      - DATABASE_URL=${DATABASE_URL:-postgresql://postgres:password@postgres:5432/sports_dashboard?schema=public}
```

## Environment Variable Priority

### **1. Docker Compose Environment Variables (Highest)**

```bash
# Override .env values
POSTGRES_PASSWORD=secret123 docker-compose up
```

### **2. .env File (Medium)**

```bash
# apps/backend/.env
POSTGRES_PASSWORD=password
```

### **3. Default Values (Lowest)**

```yaml
# docker-compose.yml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
```

## Different Scenarios

### **Local Development (No Docker):**

- Uses `apps/backend/.env`
- DATABASE_URL points to `localhost:5432`

### **Docker Development:**

- Uses `apps/backend/.env` + Docker Compose
- DATABASE_URL points to `postgres:5432` (Docker service)

### **Production:**

- Uses production environment variables
- DATABASE_URL points to production database

## Customizing Environment

### **Change Database Password:**

```bash
# Update .env file
echo 'POSTGRES_PASSWORD=mynewpassword' >> apps/backend/.env

# Update DATABASE_URL
echo 'DATABASE_URL="postgresql://postgres:mynewpassword@localhost:5432/sports_dashboard?schema=public"' >> apps/backend/.env
```

### **Change Ports:**

```bash
# Update .env file
echo 'PORT=8080' >> apps/backend/.env
echo 'POSTGRES_PORT=5433' >> apps/backend/.env
```

### **Override for Single Run:**

```bash
# Override environment variables
PORT=8080 POSTGRES_PORT=5433 docker-compose up
```

## Security Best Practices

### **1. Never Commit .env Files:**

```bash
# .gitignore already includes .env
.env
.env.local
.env.production
```

### **2. Use Different Passwords:**

```bash
# Development
POSTGRES_PASSWORD=devpassword123

# Production (set in deployment platform)
POSTGRES_PASSWORD=super_secure_production_password
```

### **3. Environment-Specific Files:**

```bash
# Development
apps/backend/.env.development

# Production
apps/backend/.env.production
```

## Troubleshooting

### **Environment Variables Not Loading:**

```bash
# Check if .env file exists
ls -la apps/backend/.env

# Check Docker Compose variables
docker-compose config
```

### **Database Connection Issues:**

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
curl http://localhost:3001/api/db-test
```

### **Port Conflicts:**

```bash
# Check if ports are in use
lsof -i :3001
lsof -i :5432

# Use different ports
PORT=8080 POSTGRES_PORT=5433 docker-compose up
```

## Quick Commands

```bash
# Start with custom environment
PORT=8080 docker-compose up

# Override database password
POSTGRES_PASSWORD=secret123 docker-compose up

# Check environment variables
docker-compose config

# View current .env
cat apps/backend/.env
```

This setup provides maximum flexibility while maintaining security and consistency across different environments! 🔧
