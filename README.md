# Node Admin - Full-Stack Blog Platform

A comprehensive full-stack monorepo application built with Turborepo, featuring a Node.js GraphQL backend, Angular frontend, and PostgreSQL database.

## 🚀 Features

- **Backend**: Node.js with Express, GraphQL (Apollo Server 4), Prisma ORM
- **Frontend**: Angular 20 with Apollo GraphQL client
- **Database**: PostgreSQL with Prisma schema
- **Authentication**: JWT-based with role-based access control
- **Admin Interface**: AdminJS for database management
- **Monorepo**: Turborepo for efficient workspace management
- **Docker**: Complete containerization support

## 📁 Project Structure

```
node-admin/
├── apps/
│   ├── backend/          # Node.js GraphQL API server
│   │   ├── src/
│   │   │   ├── resolvers/    # GraphQL resolvers
│   │   │   ├── middleware/   # Authentication middleware
│   │   │   └── server.ts     # Express server setup
│   │   └── package.json
│   └── frontend/         # Angular SPA
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/   # Angular components
│       │   │   ├── services/     # GraphQL services
│       │   │   └── app.ts        # Main app component
│       │   └── main.ts
│       └── package.json
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── docker-compose.yml    # Docker services
├── turbo.json           # Turborepo configuration
└── package.json         # Root workspace
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server 4** - GraphQL server
- **Prisma** - Database ORM and migrations
- **AdminJS** - Admin interface
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **Angular 20** - Frontend framework
- **Apollo Angular** - GraphQL client
- **Reactive Forms** - Form handling
- **SCSS** - Styling
- **TypeScript** - Type safety

### Database
- **PostgreSQL** - Primary database
- **Prisma Client** - Type-safe database access

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Docker)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/node_admin"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=4000
   ```

4. **Setup database**
   ```bash
   # Start PostgreSQL (if using Docker)
   docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=node_admin -p 5432:5432 -d postgres:15

   # Generate Prisma client and run migrations
   npx prisma generate
   npx prisma db push

   # Seed the database
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev

   # Or start individually
   npm run dev:backend   # Starts on http://localhost:4000
   npm run dev:frontend  # Starts on http://localhost:4200
   ```

### Using Docker

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the applications**
   - Frontend: http://localhost:4200
   - Backend GraphQL: http://localhost:4000/graphql
   - AdminJS: http://localhost:4000/admin

## 📝 API Documentation

### GraphQL Schema

#### User Management
```graphql
type User {
  id: ID!
  email: String!
  username: String
  role: Role!
  posts: [Post!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type AuthPayload {
  user: User!
  token: String!
}

# Mutations
login(email: String!, password: String!): AuthPayload
register(email: String!, password: String!, username: String): AuthPayload
```

#### Posts Management
```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!
  categories: [Category!]!
  tags: [Tag!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Queries
posts: [Post!]!
post(id: ID!): Post

# Mutations
createPost(input: CreatePostInput!): Post!
updatePost(id: ID!, input: UpdatePostInput!): Post!
deletePost(id: ID!): Post!
```

### REST Endpoints

- **AdminJS Interface**: `GET /admin` - Database administration
- **GraphQL Playground**: `GET /graphql` - Interactive GraphQL explorer
- **Health Check**: `GET /health` - Server health status

## 🔐 Authentication

The application uses JWT-based authentication with the following roles:

- **USER** - Can create and manage their own posts
- **MODERATOR** - Can moderate posts and users
- **ADMIN** - Full access to all features

### Default Users (after seeding)

- **Admin**: admin@example.com / password123
- **User**: user@example.com / password123

## 🏗️ Development

### Available Scripts

```bash
# Root workspace
npm run dev          # Start all applications
npm run build        # Build all applications
npm run lint         # Lint all code
npm run test         # Run all tests

# Backend specific
npm run dev:backend     # Start backend only
npm run build:backend   # Build backend
npm run test:backend    # Test backend

# Frontend specific
npm run dev:frontend    # Start frontend only
npm run build:frontend  # Build frontend
npm run test:frontend   # Test frontend

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT token signing | Required |
| `PORT` | Backend server port | 4000 |
| `NODE_ENV` | Environment mode | development |

## 🚀 Deployment

### Production Build

```bash
# Build all applications
npm run build

# Start production server
npm run start
```

### Docker Production

```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Coding! 🎉**
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
