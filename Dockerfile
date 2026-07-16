# Use lightweight Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source files
COPY . .

# Expose server port
EXPOSE 3000

# Start Express backend
CMD ["npm", "start"]
