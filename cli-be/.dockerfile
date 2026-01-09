# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV="production"

# --------------------
# Build stage
# --------------------
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential node-gyp pkg-config python-is-python3

# Copy package files first (better caching)
COPY cli-be/package.json ./package.json
COPY cli-contracts ./cli-contracts

# Install dependencies (includes cli-contracts)
RUN npm install --include=dev

# Copy the rest of cli-be
COPY cli-be .

# Build application
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# --------------------
# Runtime stage
# --------------------
FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD ["npm", "run", "start"]
