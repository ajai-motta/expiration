# Expiration Service

A microservice responsible for handling order expiration in a ticket booking system. It listens for new orders and publishes expiration events when orders expire.

## Overview

The Expiration Service is a core component of the microservices architecture that manages order lifecycles. It ensures orders are automatically expired after a specified duration, triggering downstream processes to handle expired reservations.

## How It Works

1. **Listens for OrderCreated Events**: Subscribes to `OrderCreated` events from the NATS streaming server
2. **Queues Expiration Job**: Adds a delayed job to the Bull queue (Redis-backed) with the order's expiration delay
3. **Publishes Expiration**: When the delay expires, publishes an `ExpirationComplete` event back to NATS
4. **Graceful Shutdown**: Handles SIGINT and SIGTERM signals for clean shutdown

## Architecture

```
NATS Streaming
     ↓
[OrderCreated Listener]
     ↓
[Bull Queue (Redis)]
     ↓
[Job Processor]
     ↓
NATS Streaming
[ExpirationComplete Publisher]
```

### Components

- **nats-class-wrapper.ts**: Wraps the NATS Streaming client for connection management
- **order-created.ts**: Event listener that consumes `OrderCreated` events
- **expiration-queue.ts**: Bull queue setup and job processor
- **expiration-complete.ts**: Publisher for `ExpirationComplete` events

## Prerequisites

- Node.js 18+
- NATS Streaming Server running
- Redis Server running
- Environment variables configured

## Installation

```bash
npm install
```

## Environment Variables

```env
# NATS Configuration
NATS_CLUSTER_ID=ticketing        # NATS cluster identifier
NATS_CLIENT_ID=expiration        # Unique client ID for this service
NATS_URL=http://nats-srv:4222    # NATS server URL

# Redis Configuration
REDIS_HOST=redis-srv             # Redis server hostname
```

## Running

### Development

Watch mode with automatic restart on file changes:

```bash
npm run dev
```

### Production

Build and run:

```bash
npm run build
npm start
```

### Testing

Run Jest test suite with watch mode:

```bash
npm test
```

## Docker

Build and run the service in Docker:

```bash
docker build -t expiration-service .
docker run --env-file .env expiration-service
```

See `k8s/` directory for Kubernetes deployment manifests.

## Events

### Subscribed Events

- **OrderCreated**
  - `id`: Order ID
  - `expiresAt`: Expiration timestamp

### Published Events

- **ExpirationComplete**
  - `orderId`: ID of the expired order
  - `version`: Event version

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Event Bus**: NATS Streaming
- **Job Queue**: Bull (Redis-backed)
- **Testing**: Jest with ts-jest
- **Development**: Nodemon, ts-node

## Project Structure

```
expiration/
├── src/
│   ├── index.ts                    # Entry point and startup
│   ├── nats-class-wrapper.ts       # NATS client wrapper
│   ├── events/
│   │   ├── listeners/
│   │   │   ├── order-created.ts    # OrderCreated event listener
│   │   │   └── que-group.ts        # Queue group configuration
│   │   └── publishers/
│   │       └── expiration-complete.ts  # ExpirationComplete publisher
│   └── queues/
│       └── expiration-queue.ts     # Bull queue setup & processing
├── k8s/                            # Kubernetes manifests
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Key Features

- **Delayed Job Processing**: Uses Bull queues for reliable delayed job execution
- **Event-Driven**: Fully asynchronous, event-driven architecture
- **Resilient**: Handles graceful shutdown with SIGINT/SIGTERM
- **Distributed**: Integrates with NATS for service-to-service communication
- **Reliable Queue**: Redis-backed Bull queue ensures no job loss

## Error Handling

- Missing NATS environment variables will throw an error during startup
- Connection failures are logged to console
- Graceful shutdown is triggered on NATS connection close

## Development Notes

- The current delay is hardcoded to 50,000ms (50 seconds) for testing
- In production, the delay should be calculated: `new Date(data.expiresAt).getTime() - new Date().getTime()`
- Queue jobs are acknowledged (ack) only after being successfully queued

## Contributing

Follow the existing code patterns and ensure all tests pass before committing.

## License

ISC
