import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'System administrator',
        },
      },
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'user',
      password: userPassword,
      role: 'USER',
      profile: {
        create: {
          firstName: 'Regular',
          lastName: 'User',
          bio: 'A regular user of the system',
        },
      },
    },
  });

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Posts about technology and programming',
    },
  });

  const newsCategory = await prisma.category.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      name: 'News',
      slug: 'news',
      description: 'Latest news and updates',
    },
  });

  // Create tags
  const nodeTag = await prisma.tag.upsert({
    where: { slug: 'nodejs' },
    update: {},
    create: {
      name: 'Node.js',
      slug: 'nodejs',
    },
  });

  const reactTag = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
    },
  });

  const graphqlTag = await prisma.tag.upsert({
    where: { slug: 'graphql' },
    update: {},
    create: {
      name: 'GraphQL',
      slug: 'graphql',
    },
  });

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { slug: 'welcome-to-our-blog' },
    update: {},
    create: {
      title: 'Welcome to Our Blog',
      content: 'This is the first post on our new blog platform built with Node.js, GraphQL, and Angular.',
      excerpt: 'A welcome message introducing our new blog platform.',
      published: true,
      slug: 'welcome-to-our-blog',
      authorId: admin.id,
      categories: {
        connect: [{ id: newsCategory.id }],
      },
      tags: {
        connect: [{ id: nodeTag.id }],
      },
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-graphql' },
    update: {},
    create: {
      title: 'Getting Started with GraphQL',
      content: 'GraphQL is a powerful query language for APIs that provides a complete and understandable description of the data in your API.',
      excerpt: 'Learn the basics of GraphQL and how to implement it in your projects.',
      published: true,
      slug: 'getting-started-with-graphql',
      authorId: user.id,
      categories: {
        connect: [{ id: techCategory.id }],
      },
      tags: {
        connect: [{ id: graphqlTag.id }, { id: nodeTag.id }],
      },
    },
  });

  const post3 = await prisma.post.upsert({
    where: { slug: 'building-modern-web-apps' },
    update: {},
    create: {
      title: 'Building Modern Web Applications',
      content: 'Modern web applications require a solid foundation. Learn about the technologies and patterns that make development efficient and scalable.',
      excerpt: 'A guide to building scalable modern web applications.',
      published: false,
      slug: 'building-modern-web-apps',
      authorId: admin.id,
      categories: {
        connect: [{ id: techCategory.id }],
      },
      tags: {
        connect: [{ id: reactTag.id }, { id: nodeTag.id }],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created admin user: ${admin.email}`);
  console.log(`Created regular user: ${user.email}`);
  console.log(`Created ${await prisma.post.count()} posts`);
  console.log(`Created ${await prisma.category.count()} categories`);
  console.log(`Created ${await prisma.tag.count()} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
