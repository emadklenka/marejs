FROM node:22-slim

# Install required dependencies and cleanup
RUN apt-get update && apt-get install -y && rm -rf /var/lib/apt/lists/*

# Install pnpm globally  
RUN npm install -g pnpm

# Create non-root user
RUN groupadd -r nodeuser && useradd -r -g nodeuser -m nodeuser

# Set working directory and ownership
WORKDIR /app
RUN chown nodeuser:nodeuser /app

# Switch to non-root user
USER nodeuser

# Copy package files
COPY --chown=nodeuser:nodeuser package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code  
COPY --chown=nodeuser:nodeuser . .

# Build React app
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod

# Expose port
EXPOSE 8080

# Start like Google Cloud Run (direct command)
CMD ["pnpm", "start"]
