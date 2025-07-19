import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import http from 'http';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Initialize Prisma client
const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
  user?: any;
}

async function startServer() {
  try {
    const app = express();
    const httpServer = http.createServer(app);

    // Basic middleware
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
    }));
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });

    // Build GraphQL schema (simplified for now)
    const schema = await buildSchema({
      resolvers: [], // We'll add resolvers later
      validate: false,
    });

    // Create Apollo Server
    const server = new ApolloServer<Context>({
      schema,
    });

    await server.start();

    // Apply Apollo GraphQL middleware
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => ({
          prisma,
          user: null, // We'll add auth later
        }),
      })
    );

    // Start the server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, resolve);
    });

    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
