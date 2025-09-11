# Use Node.js 22 Alpine for security and performance improvements
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /live-sports-event-dashboard

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/.eslintrc.js ./apps/backend/.eslintrc.js
COPY packages/eslint-config ./packages/eslint-config
COPY tsconfig.base.json ./

# Build the application
WORKDIR /live-sports-event-dashboard/apps/backend
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /live-sports-event-dashboard

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /live-sports-event-dashboard/apps/backend/dist ./apps/backend/dist
# COPY --from=base /live-sports-event-dashboard/packages/eslint-config ./packages/eslint-config
# COPY --from=base /live-sports-event-dashboard/tsconfig.base.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
RUN adduser backend nodejs

# Change ownership of the app directory
RUN chown -R backend:nodejs /live-sports-event-dashboard
USER backend

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
WORKDIR /live-sports-event-dashboard/apps/backend
CMD ["node", "dist/index.js"]
