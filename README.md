# Live Sports Event Dashboard

A real-time, interactive sports dashboard built with modern web technologies. This project demonstrates advanced frontend and backend development skills with real-time WebSocket communication, live match simulation, and interactive polling features.

## 🏆 Features

### Real-time Sports Dashboard

- **Live Match Simulation** - Automated game clock with realistic event timeline
- **Real-time Updates** - WebSocket-powered live score updates and commentary
- **Interactive Polling** - User voting system with live results
- **Live Commentary Feed** - Scrolling commentary updates during matches
- **Match Statistics** - Real-time stats including cards, possession, etc.

### Technical Highlights

- **Monorepo Architecture** - Organized with pnpm workspaces
- **TypeScript** - End-to-end type safety
- **Real-time Communication** - Socket.IO for live updates
- **Modern Database** - PostgreSQL with Prisma ORM
- **Docker Support** - Containerized development and deployment
- **Responsive Design** - Mobile-first, fully responsive UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd live-sports-event-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/backend/env.example apps/backend/.env
   # Edit .env with your database configuration
   ```

4. **Start with Docker (Recommended)**

   ```bash
   # Start database, backend, and frontend
   pnpm dev:docker
   ```

   Or start individually:

   ```bash
   # Database setup
   pnpm db:setup

   # Start backend
   pnpm --filter backend dev

   # Start frontend (in another terminal)
   pnpm --filter frontend dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/v1
   - API Documentation: http://localhost:3001/api/v1

## 🏗️ Architecture

### Monorepo Structure

```
live-sports-event-dashboard/
├── apps/
│   ├── frontend/          # React application
│   └── backend/           # Node.js API server
├── packages/
│   ├── ui/               # Shared UI components
│   └── eslint-config/    # Shared ESLint configuration
├── docker-compose.yml    # Production containers
├── docker-compose.dev.yml # Development containers
└── package.json          # Root package configuration
```

### Technology Stack

**Frontend:**

- React 18 with TypeScript
- Vite for build tooling
- Real-time WebSocket integration
- Responsive CSS with modern layout techniques

**Backend:**

- Node.js with Express.js
- TypeScript for type safety
- Socket.IO for real-time communication
- PostgreSQL with Prisma ORM
- Docker containerization

**Database:**

- PostgreSQL for data persistence
- Prisma ORM for type-safe database access
- Comprehensive schema for matches, polls, votes, and commentary

## 📡 API Endpoints

### Base URL: `/api/v1`

**Matches:**

- `GET /matches` - List all matches
- `GET /matches/live` - Get live matches
- `GET /matches/:id` - Get specific match
- `POST /matches` - Create match
- `PUT /matches/:id` - Update match
- `DELETE /matches/:id` - Delete match

**Polls:**

- `GET /polls` - List polls
- `GET /polls/:id` - Get specific poll
- `GET /polls/:id/results` - Get poll results
- `POST /polls` - Create poll
- `POST /polls/:id/vote` - Vote on poll
- `PUT /polls/:id` - Update poll
- `DELETE /polls/:id` - Delete poll

**Commentary:**

- `GET /commentary` - List commentary
- `GET /commentary/:id` - Get specific commentary
- `GET /commentary/match/:matchId` - Get match commentary
- `POST /commentary` - Create commentary
- `PUT /commentary/:id` - Update commentary
- `DELETE /commentary/:id` - Delete commentary

**System:**

- `GET /health` - Health check
- `GET /db-test` - Database connection test

## 🔌 WebSocket Events

**Client → Server:**

- `join-match` - Join match room for live updates
- `leave-match` - Leave match room

**Server → Client:**

- `match-start` - Match simulation begins
- `time-update` - Game clock updates
- `score-update` - Score changes
- `new-commentary` - New commentary line
- `new-poll` - New poll available
- `poll-results` - Updated poll results

## 🛠️ Development

### Available Scripts

**Root level:**

```bash
pnpm dev:docker     # Start all services with Docker
pnpm db:setup       # Set up database
pnpm db:reset       # Reset database
```

**Backend:**

```bash
pnpm --filter backend dev          # Start development server
pnpm --filter backend db:generate  # Generate Prisma client
pnpm --filter backend db:push      # Push schema to database
pnpm --filter backend db:studio    # Open Prisma Studio
pnpm --filter backend db:seed      # Seed database
```

**Frontend:**

```bash
pnpm --filter frontend dev         # Start development server
pnpm --filter frontend build       # Build for production
pnpm --filter frontend preview     # Preview production build
```

### Database Management

```bash
# Set up database (first time)
pnpm db:setup

# Reset database (clean slate)
pnpm db:reset

# View database in browser
pnpm --filter backend db:studio

# Seed with sample data
pnpm --filter backend db:seed
```

## 🐳 Docker

### Development

```bash
# Start all services
pnpm dev:docker

# Start only database
docker-compose -f docker-compose.dev.yml up postgres

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production

```bash
# Build and start production containers
docker-compose up --build
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Backend tests
pnpm --filter backend test

# Frontend tests
pnpm --filter frontend test

# E2E tests
pnpm --filter frontend test:e2e
```

## 📦 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend: `pnpm --filter frontend build`
2. Deploy the `dist` folder to your static hosting service
3. Set environment variables for API URL

### Backend (Render/Fly.io)

1. Build Docker image: `docker build -f apps/backend/Dockerfile .`
2. Deploy to your container platform
3. Set up PostgreSQL database
4. Configure environment variables

## 🔧 Environment Variables

### Backend (.env)

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sports_dashboard"
PORT=3001
NODE_ENV=development
API_BASE_URL=/api/v1
FRONTEND_URL=http://localhost:5173
```

## 📚 Documentation

- [Database Setup Guide](./DATABASE_SETUP.md)
- [Docker Development Guide](./DOCKER_DEV.md)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Project Requirements](./REQUIREMENTS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Goals

This project serves as a portfolio piece demonstrating:

- Advanced React development with real-time features
- Node.js backend with WebSocket communication
- Database design and ORM usage
- Docker containerization
- Monorepo architecture
- TypeScript best practices
- Modern development workflows

Perfect for showcasing skills to potential employers in the sports and entertainment technology sector.
