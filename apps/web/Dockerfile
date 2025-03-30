# syntax=docker/dockerfile:1

### 1) Build Stage
FROM oven/bun:edge AS build
WORKDIR /app

# Copy entire monorepo to access shared packages (ui, types, etc.).
COPY . .

# Install dependencies at root
RUN bun install

# Build the Remix app (Tailwind, shadcn/ui, etc.)
WORKDIR /app/apps/web
RUN bun run build

### 2) Production Stage
FROM oven/bun:edge AS production
WORKDIR /app

# Copy the compiled Remix build output
COPY --from=build /app /app

# Expose port for Remix app
EXPOSE 3000

# Start the Remix server in production
CMD ["bun", "run", "start"]