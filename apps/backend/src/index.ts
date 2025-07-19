import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import http from 'http';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';

import { prisma } from './config/database';
import { UserResolver } from './graphql/resolvers/UserResolver';
import { PostResolver } from './graphql/resolvers/PostResolver';
import { authMiddleware } from './middleware/auth';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

interface Context {
  prisma: typeof prisma;
  user?: any;
}

async function startServer() {
  try {
    const app = express();
    const httpServer = http.createServer(app);

    // Basic middleware
    app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    app.use(morgan('combined'));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // GraphQL Server
    const schema = await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
      authChecker: ({ context }: { context: Context }) => {
        return !!context.user;
      },
    });

    const apolloServer = new ApolloServer<Context>({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      introspection: process.env.NODE_ENV !== 'production',
    });

    await apolloServer.start();

    // Apply GraphQL middleware
    app.use('/graphql', 
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:4200',
        credentials: true,
      }),
      express.json(),
      authMiddleware,
      expressMiddleware(apolloServer, {
        context: async ({ req }: { req: any }): Promise<Context> => ({
          prisma,
          user: req.user,
        }),
      })
    );

    // AdminJS Setup (simplified)
    const admin = new AdminJS({
      resources: [],
      rootPath: '/admin',
    });
    
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    // Start server
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, resolve);
    });

    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`);
    console.log(`🎯 GraphQL endpoint available at http://localhost:${PORT}/graphql`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
