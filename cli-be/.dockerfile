# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential node-gyp pkg-config python-is-python3

# Copy contracts first
COPY ../cli-contracts /cli-contracts
WORKDIR /cli-contracts
RUN npm ci && npm run build && npm pack

# Back to cli-be
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Install packed contracts
RUN npm install /cli-contracts/cli-contracts-*.tgz

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM base
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "run", "start"]
