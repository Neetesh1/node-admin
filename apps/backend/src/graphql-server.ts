import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();

// GraphQL Schema
const typeDefs = `
  type User {
    id: ID!
    email: String!
    username: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    author: User!
    categories: [Category!]!
    tags: [Tag!]!
  }

  type Category {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Tag {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Post!
  }

  input CreatePostInput {
    title: String!
    content: String!
    published: Boolean = false
    authorId: ID!
  }

  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    posts: async () => {
      return await prisma.post.findMany({
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      });
    },
    post: async (_: any, { id }: { id: string }) => {
      return await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      });
    },
    users: async () => {
      return await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
    },
    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
        },
      });
    },
  },
  Mutation: {
    createPost: async (_: any, { input }: { input: any }) => {
      return await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          published: input.published || false,
          authorId: input.authorId,
        },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      });
    },
    updatePost: async (_: any, { id, input }: { id: string; input: any }) => {
      return await prisma.post.update({
        where: { id },
        data: input,
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      });
    },
    deletePost: async (_: any, { id }: { id: string }) => {
      return await prisma.post.delete({
        where: { id },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      });
    },
  },
  Post: {
    categories: async (parent: any) => {
      return await prisma.category.findMany({
        where: {
          posts: {
            some: {
              id: parent.id,
            },
          },
        },
      });
    },
    tags: async (parent: any) => {
      return await prisma.tag.findMany({
        where: {
          posts: {
            some: {
              id: parent.id,
            },
          },
        },
      });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startServer() {
  const app = express();
  
  // CORS middleware
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
  }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'GraphQL Server is running' });
  });

  // Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      prisma,
      user: req.user, // Add authentication context if needed
    }),
    introspection: true,
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
