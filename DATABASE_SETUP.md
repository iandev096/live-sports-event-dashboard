# Database Setup Guide

This guide explains how to set up and use PostgreSQL with Prisma for the sports dashboard.

## Quick Start

### 1. Set up the database:

```bash
# Start PostgreSQL and create schema
pnpm db:setup
```

### 2. Start development with database:

```bash
# Start frontend + backend + database
pnpm dev:docker
```

## Database Schema

### Models:

- **Match**: Sports matches with teams, scores, status
- **Poll**: Interactive polls for matches
- **PollOption**: Options for each poll
- **Vote**: User votes on poll options
- **Commentary**: Live commentary for matches

### Key Features:

- **Cascade deletes** - deleting a match removes related polls/votes
- **Unique constraints** - prevents duplicate votes from same user
- **Timestamps** - automatic created/updated tracking
- **Enums** - type-safe match status

## Available Scripts

### Database Operations:

```bash
# Set up database (start PostgreSQL + create schema + seed data)
pnpm db:setup

# Reset database (delete everything + recreate)
pnpm db:reset

# Generate Prisma client
pnpm --filter backend db:generate

# Push schema to database
pnpm --filter backend db:push

# Run migrations
pnpm --filter backend db:migrate

# Open Prisma Studio (database GUI)
pnpm --filter backend db:studio

# Seed database with sample data
pnpm --filter backend db:seed
```

### Docker Operations:

```bash
# Start everything (frontend + backend + database)
pnpm dev:docker

# Start only database
docker-compose -f docker-compose.dev.yml up postgres

# View database logs
docker-compose -f docker-compose.dev.yml logs -f postgres
```

## Environment Variables

### Development (.env):

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/sports_dashboard?schema=public"
PORT=3001
NODE_ENV=development
```

### Docker:

- Database URL automatically set in containers
- Uses `postgres` as hostname (Docker internal networking)

## Database Connection

### Test Connection:

```bash
# Check if database is working
curl http://localhost:3001/api/db-test
```

### Expected Response:

```json
{
  "status": "connected",
  "matchCount": 1,
  "message": "Database connection successful"
}
```

## Prisma Studio

Access the database GUI:

```bash
pnpm --filter backend db:studio
```

Opens at: http://localhost:5555

## Troubleshooting

### Database won't start:

```bash
# Check if port 5432 is available
lsof -i :5432

# Reset everything
pnpm db:reset
```

### Connection errors:

```bash
# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```

### Schema changes:

```bash
# After modifying schema.prisma
pnpm --filter backend db:push
pnpm --filter backend db:generate
```

## Production Notes

- **Persistent data** stored in Docker volume `postgres_data`
- **Environment variables** should be set in production
- **Database backups** should be configured
- **Connection pooling** recommended for high traffic

## Next Steps

1. **Run migrations** to create tables
2. **Seed database** with sample data
3. **Test API endpoints** with database
4. **Build frontend** to connect to backend
5. **Add real-time features** with Socket.IO
