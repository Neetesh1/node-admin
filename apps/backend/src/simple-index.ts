import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Initialize Prisma client
const prisma = new PrismaClient();

async function startServer() {
  try {
    const app = express();

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

    // Basic API endpoints
    app.get('/api/users', async (req, res) => {
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            createdAt: true,
          },
        });
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    });

    app.get('/api/posts', async (req, res) => {
      try {
        const posts = await prisma.post.findMany({
          include: {
            author: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            categories: true,
            tags: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
      }
    });

    // Get single post
    app.get('/api/posts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
          where: { id },
          include: {
            author: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            categories: true,
            tags: true,
          },
        });
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
      }
    });

    // Create new post
    app.post('/api/posts', async (req, res) => {
      try {
        const { title, content, published = false, authorId } = req.body;
        
        const post = await prisma.post.create({
          data: {
            title,
            content,
            published,
            authorId,
          },
          include: {
            author: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            categories: true,
            tags: true,
          },
        });
        
        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
      }
    });

    // Update post
    app.put('/api/posts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const { title, content, published } = req.body;
        
        const post = await prisma.post.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(content && { content }),
            ...(published !== undefined && { published }),
          },
          include: {
            author: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            categories: true,
            tags: true,
          },
        });
        
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
      }
    });

    // Delete post
    app.delete('/api/posts/:id', async (req, res) => {
      try {
        const { id } = req.params;
        
        await prisma.post.delete({
          where: { id },
        });
        
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
      }
    });

    // Create a user endpoint for post creation
    app.post('/api/users', async (req, res) => {
      try {
        const { email, username, password } = req.body;
        
        const user = await prisma.user.create({
          data: {
            email,
            username,
            password, // In production, hash this!
          },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            createdAt: true,
          },
        });
        
        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
      console.log(`❤️ Health check: http://localhost:${PORT}/health`);
    });
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
