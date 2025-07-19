import { Resolver, Query, Mutation, Arg, Ctx, Authorized, FieldResolver, Root } from 'type-graphql';
import { User, Post, Category, Tag } from '../types';
import { CreatePostInput, UpdatePostInput } from '../types/inputs';
import { AuthenticatedUser } from '../../middleware/auth';

interface Context {
  prisma: any;
  user?: AuthenticatedUser;
}

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => User)
  async author(@Root() post: Post, @Ctx() ctx: Context): Promise<User> {
    return await ctx.prisma.post.findUnique({
      where: { id: post.id },
      include: { author: true },
    }).then((result: any) => result.author);
  }

  @FieldResolver(() => [Category])
  async categories(@Root() post: Post, @Ctx() ctx: Context): Promise<Category[]> {
    return await ctx.prisma.post.findUnique({
      where: { id: post.id },
      include: { categories: true },
    }).then((result: any) => result?.categories || []);
  }

  @FieldResolver(() => [Tag])
  async tags(@Root() post: Post, @Ctx() ctx: Context): Promise<Tag[]> {
    return await ctx.prisma.post.findUnique({
      where: { id: post.id },
      include: { tags: true },
    }).then((result: any) => result?.tags || []);
  }

  @Query(() => [Post])
  async posts(
    @Ctx() ctx: Context,
    @Arg('published', { nullable: true }) published?: boolean
  ): Promise<Post[]> {
    const where = published !== undefined ? { published } : {};
    
    return await ctx.prisma.post.findMany({
      where,
      include: {
        author: true,
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id') id: string, @Ctx() ctx: Context): Promise<Post | null> {
    // Increment view count
    await ctx.prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    }).catch(() => {}); // Ignore errors for view counting

    return await ctx.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  }

  @Query(() => Post, { nullable: true })
  async postBySlug(@Arg('slug') slug: string, @Ctx() ctx: Context): Promise<Post | null> {
    // Increment view count
    await ctx.prisma.post.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    }).catch(() => {}); // Ignore errors for view counting

    return await ctx.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  }

  @Query(() => [Post])
  @Authorized()
  async myPosts(@Ctx() ctx: Context): Promise<Post[]> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    return await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Mutation(() => Post)
  @Authorized()
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() ctx: Context
  ): Promise<Post> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    // Check if slug is unique
    const existingPost = await ctx.prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }

    // Prepare category and tag connections
    const categoryConnect = data.categoryIds?.map(id => ({ id })) || [];
    const tagConnect = data.tagIds?.map(id => ({ id })) || [];

    return await ctx.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published || false,
        slug: data.slug,
        authorId: ctx.user.id,
        categories: {
          connect: categoryConnect,
        },
        tags: {
          connect: tagConnect,
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  }

  @Mutation(() => Post)
  @Authorized()
  async updatePost(
    @Arg('id') id: string,
    @Arg('data') data: UpdatePostInput,
    @Ctx() ctx: Context
  ): Promise<Post> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    // Check if post exists and user owns it or is admin
    const existingPost = await ctx.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.authorId !== ctx.user.id && ctx.user.role !== 'ADMIN') {
      throw new Error('You can only update your own posts');
    }

    // Check slug uniqueness if updating
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await ctx.prisma.post.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new Error('A post with this slug already exists');
      }
    }

    // Prepare update data
    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.slug && { slug: data.slug }),
    };

    // Handle categories and tags
    if (data.categoryIds) {
      updateData.categories = {
        set: data.categoryIds.map(id => ({ id })),
      };
    }

    if (data.tagIds) {
      updateData.tags = {
        set: data.tagIds.map(id => ({ id })),
      };
    }

    return await ctx.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deletePost(@Arg('id') id: string, @Ctx() ctx: Context): Promise<boolean> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    // Check if post exists and user owns it or is admin
    const existingPost = await ctx.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.authorId !== ctx.user.id && ctx.user.role !== 'ADMIN') {
      throw new Error('You can only delete your own posts');
    }

    await ctx.prisma.post.delete({
      where: { id },
    });

    return true;
  }
}
