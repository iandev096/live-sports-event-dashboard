Project Requirements Document: Live Sports Event Dashboard
Version: 1.0

Date: September 10, 2025

Author: Gemini AI

1. Introduction
   1.1. Project Vision
   To create a high-fidelity, real-time, and interactive web application that simulates a live sports event dashboard. The project will serve as a portfolio piece to showcase senior-level frontend and backend development skills, specifically targeting roles in the sports and entertainment technology sector.

1.2. Target Audience
The primary audience for this project is technical recruiters and hiring managers at companies like Monterosa. The goal is to demonstrate proficiency in the specific technologies and architectural patterns outlined in their job descriptions.

1.3. Core Technologies
Language: TypeScript

Architecture: Monorepo (e.g., using pnpm workspaces or Turborepo)

Frontend: React

Backend: Node.js

Real-time Communication: WebSockets (Socket.IO)

API: Express.js or Fastify

Database: PostgreSQL with Prisma ORM

Testing: Jest, React Testing Library, Cypress

2. System Architecture
   2.1. Monorepo Structure
   The project will be housed in a single monorepo to streamline development and dependency management between the frontend and backend.

/live-dashboard
|-- /apps
| |-- /frontend # The React application
| |-- /backend # The Node.js application
|-- /packages
| |-- /ui # (Optional) Shared React components
| |-- /eslint-config # Shared ESLint configuration
|-- package.json
|-- tsconfig.base.json

2.2. High-Level System Diagram
The system will consist of a backend server responsible for data simulation and real-time event broadcasting, and a frontend client that consumes and displays this data.

Data Flow:

Initial Load: The frontend client makes a REST API call to the backend for the initial match state.

Real-time Connection: The frontend establishes a persistent WebSocket connection to the backend.

Live Updates: The backend's Simulation Engine generates events (goals, commentary) and pushes them to all connected clients via WebSockets.

User Interaction: The frontend sends user actions (e.g., voting in a poll) to the backend via a REST API call.

3. Backend Functional Requirements (apps/backend)
   The backend will be a Node.js application responsible for all business logic, data management, and real-time communication.

3.1. API Server (REST)
Framework: Express.js or Fastify.

Endpoints:

GET /api/match/:id: Retrieves the complete initial state of a specified match (teams, players, score, etc.) before the simulation begins.

POST /api/poll/:pollId/vote: Allows a user to submit a vote for a poll.

Request Body: { "optionId": string }

Response: 200 OK on success, 400 for invalid input.

3.2. Real-Time Server (WebSockets)
Library: Socket.IO.

The server must broadcast game events to all connected clients.

Emitted Events:

match-start: Signals the beginning of the simulation.

time-update: Emits the current game time periodically (e.g., every minute).

Payload: { "time": number }

score-update: Sent when a goal is scored.

Payload: { "teamA": number, "teamB": number }

new-commentary: Sent for each new commentary line.

Payload: { "text": string }

new-poll: Informs the client a new poll is available.

Payload: { "pollId": string, "question": string, "options": [...] }

poll-results: Broadcasts updated vote counts for a poll.

Payload: { "pollId": string, "results": { "optionId": count, ... } }

3.3. Live Match Simulation Engine
The engine must manage a game clock using setInterval.

It will read from a predefined JSON "event timeline" file for a given match.

As the game clock progresses, the engine will:

Identify events from the timeline corresponding to the current time.

Update the in-memory game state.

Trigger the WebSocket server to emit the relevant event to clients.

3.4. Database & Persistence
Database: PostgreSQL.

ORM: Prisma.

Schema: The database must store data for interactive elements.

Poll model: id, question, options.

Vote model: id, pollId, selectedOption.

The system must be able to create polls and record user votes persistently.

4. Frontend Functional Requirements (apps/frontend)
   The frontend will be a single-page application built with React that provides a rich, responsive user interface.

4.1. Live Dashboard View
The main view will display all relevant live match information:

Team names and logos.

Current score.

Live game clock.

A scrolling feed for live commentary.

A dedicated section for displaying statistics (e.g., yellow cards).

4.2. Real-time Updates
The UI must connect to the backend WebSocket server upon loading.

All components must update dynamically in real-time without a page refresh as new events are received from the server.

The score must update instantly.

The commentary feed must automatically scroll as new entries appear.

4.3. Interactive Polling
When a new-poll event is received, a poll widget must appear on the UI.

Users must be able to select an option and click a "Vote" button.

After voting, the poll widget should transition to show the live results, which update in real-time as poll-results events are received.

4.4. Responsive Design
The application must be fully responsive and provide an optimal user experience on mobile, tablet, and desktop screens.

CSS Flexbox and/or Grid should be used for layout. A framework like Tailwind CSS is recommended.

5. Non-Functional Requirements
   5.1. Performance
   The frontend application must remain performant and responsive, even with frequent WebSocket events.

Employ React performance optimization techniques (React.memo, useCallback) to prevent unnecessary re-renders.

Implement code-splitting (React.lazy) for different sections of the dashboard if needed.

5.2. Code Quality & Maintainability
The entire codebase must be written in TypeScript with strict type-checking enabled.

The code should be formatted using Prettier and linted using ESLint to ensure consistency.

State management on the frontend should be handled with a modern library like Zustand or React Query.

5.3. Testing
Backend: Unit tests should be written with Jest for the API logic and simulation engine.

Frontend:

Unit/Integration tests for critical React components (e.g., the Poll widget) using Jest and React Testing Library.

At least one end-to-end test using Cypress to simulate a full user flow.

5.4. Deployment
The frontend application should be deployable as a static site on services like Vercel or Netlify.

The backend application should be containerized using Docker and ready for deployment on a service like Render or Fly.io.

A CI/CD pipeline (e.g., GitHub Actions) should be set up to automate testing and deployments.
