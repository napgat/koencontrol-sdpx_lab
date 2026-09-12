# Use a pinned lightweight Node.js base image for reproducible builds.
FROM node:24-alpine AS deps

# Set the working directory inside the image.
WORKDIR /app

# Copy dependency manifests first to maximize layer-cache reuse.
COPY package.json package-lock.json ./

# Install the exact locked dependency versions.
RUN npm ci

# Start the build stage with the dependencies already installed.
FROM node:24-alpine AS build

# Set the working directory inside the build image.
WORKDIR /app

# Reuse dependencies from the dependency stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code after dependencies for layer caching.
COPY . .

# Build the optimized Next.js application.
RUN npm run build

# Start the test stage with development dependencies available.
FROM node:24-alpine AS test

# Set the working directory inside the test image.
WORKDIR /app

# Reuse all dependencies needed by the test suite.
COPY --from=deps /app/node_modules ./node_modules

# Copy source and test files into the test image.
COPY . .

# Run the unit test suite by default in this stage.
CMD ["npm", "test"]

# Start a minimal production runtime stage.
FROM node:24-alpine AS runtime

# Set the working directory inside the runtime image.
WORKDIR /app

# Run Next.js in production mode.
ENV NODE_ENV=production

# Copy dependency manifests for a production-only install.
COPY package.json package-lock.json ./

# Install only production dependencies.
RUN npm ci --omit=dev

# Copy the compiled Next.js output from the build stage.
COPY --from=build /app/.next ./.next

# Copy public static assets from the build stage.
COPY --from=build /app/public ./public

# Copy the Next.js configuration required at runtime.
COPY --from=build /app/next.config.ts ./next.config.ts

# Create an unprivileged application user.
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Give the application user ownership of runtime files.
RUN chown -R nextjs:nextjs /app

# Run the container as the non-root application user.
USER nextjs

# Document that the application listens on port 3000.
EXPOSE 3000

# Check that the application can answer an HTTP health request.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://localhost:3000/api/health || exit 1

# Start the production Next.js server.
CMD ["npm", "start"]