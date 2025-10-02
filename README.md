# Express.js TypeScript Server

Minimal Express.js app written in TypeScript with CommonJS modules. Features a single route `/` returning `Hello World`.

## Features
- TypeScript with strict type checking
- CommonJS module system
- Docker support
- Development and production builds

## Requirements
- Node.js >= 18

## Setup
```bash
npm install
```

## Development
```bash
# Run in development mode with hot reload
npm run dev

# Type checking without compilation
npm run type-check
```

## Production
```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

App will be available at `http://localhost:3000`.

## Configuration
- PORT: set a custom port via environment variable.

## Docker
```bash
# Build and run with Docker
docker-compose up --build
```
