FROM oven/bun:edge AS build
WORKDIR /app

# Copy monorepo source
COPY ../../packages ../../packages
COPY package.json bun.lockb ./
COPY apps/api apps/api

WORKDIR /app/apps/api

# Install dependencies
RUN bun install

# Build the project
RUN bun run build

# Production stage
FROM oven/bun:edge AS production
WORKDIR /app

# Copy built files only
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/bun.lockb ./bun.lockb

RUN bun install --production

EXPOSE 3001

CMD ["bun", "dist/server.js"]