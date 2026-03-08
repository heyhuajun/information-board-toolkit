FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add build timestamp to force rebuild
ARG BUILD_DATE
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_DATE=${BUILD_DATE}
ENV NODE_ENV=production

# Clean all caches
RUN rm -rf .next .turbo node_modules/.cache /tmp/* ~/.npm ~/.cache

# Build
RUN echo "Building at ${BUILD_DATE}" && npm run build

# Create user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create data directory
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

# Set permissions
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
