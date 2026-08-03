# Lightweight Node.js 20 Alpine Base Image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production-only dependencies
RUN npm ci --only=production

# Ensure data directory exists with non-root ownership
RUN mkdir -p /usr/src/app/data && chown -R node:node /usr/src/app

# Copy application source files with node user permissions
COPY --chown=node:node . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3500

# Run container under unprivileged user 'node' for security
USER node

# Expose backend application port
EXPOSE 3500

# Start Express backend server
CMD ["npm", "start"]
