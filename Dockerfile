# ==============================================================================
# Production Dockerfile for Sidharth OS Portfolio Backend
# Optimized for security, minimal image size, and unprivileged container execution
# ==============================================================================

# Lightweight Node.js 20 Alpine Base Image
FROM node:20-alpine AS base

# Install tini for proper init process & signal handling (SIGTERM / SIGINT)
RUN apk add --no-cache tini

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests first for optimal Layer Caching
COPY package*.json ./

# Install production-only dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Create required storage directories and set non-root user ownership
RUN mkdir -p /usr/src/app/data /usr/src/app/security && \
    chown -R node:node /usr/src/app

# Copy application source files with node user permissions
COPY --chown=node:node . .

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=3500

# Run container under unprivileged user 'node' for security
USER node

# Expose backend application port
EXPOSE 3500

# Healthcheck to monitor backend status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3500/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Use tini to manage process lifecycle and pass signals cleanly
ENTRYPOINT ["/sbin/tini", "--"]

# Start Express backend server
CMD ["node", "server.js"]
