# Nitro PostgreSQL Backend

A well-documented backend application built with [Nitro](https://nitro.unjs.io/) and PostgreSQL with database migrations.

## Features

- 🚀 Fast and lightweight [Nitro](https://nitro.unjs.io/) server
- 🐘 PostgreSQL database integration
- 📊 Database migrations using [Drizzle ORM](https://orm.drizzle.team/)
- 🔒 Authentication and authorization
- 📝 API documentation with Swagger
- 🧪 Testing setup with Vitest
- 🔄 Environment configuration

## Project Structure

```
backend-nitro-postgres/
├── src/                    # Source code
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── config/             # Configuration files
│   └── migrations/         # Database migrations
├── docs/                   # Documentation
├── tests/                  # Test files
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── nitro.config.ts         # Nitro configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- pnpm (recommended) or npm

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend-nitro-postgres

# Install dependencies
pnpm install
```

### Environment Setup

Copy the example environment file and update it with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Database Setup

```bash
# Create the database
createdb database_name

# Run migrations
pnpm migrate
```

### Development

```bash
# Start the development server
pnpm dev
```

The server will be available at `http://localhost:3000`.

### Build for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Database Migrations

This project uses Drizzle ORM for database migrations.

### Creating a Migration

```bash
# Generate a new migration based on schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm migrate
```

### Rolling Back Migrations

```bash
# Roll back the last migration
pnpm migrate:down
```

## API Documentation

API documentation is available at `http://localhost:3000/api/docs` when the server is running.

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## License

MIT

