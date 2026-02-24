# Base
FROM node:20-slim AS base

WORKDIR /app

# Stage 1: Builder
FROM base AS builder

# Build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Build the application
RUN npm run build

# Stage 2: Runner (Production)
FROM base AS runner

# Install tini (runtime only)
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy necessary files from previous stages
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create data directory with correct permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

# Expose port
EXPOSE 3000

ENTRYPOINT ["tini", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/recommend || exit 1

# Start the application
CMD ["node", "server.js"]
