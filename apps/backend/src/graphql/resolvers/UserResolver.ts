import { Resolver, Query, Mutation, Arg, Ctx, Authorized, FieldResolver, Root } from 'type-graphql';
import { IsEmail } from 'class-validator';
import bcrypt from 'bcryptjs';
import { User, AuthPayload, Profile, Post } from '../types';
import { RegisterInput, LoginInput, UpdateUserInput, CreateProfileInput, UpdateProfileInput } from '../types/inputs';
import { AuthenticatedUser } from '../../middleware/auth';
import { generateToken } from '../../utils/jwt';

interface Context {
  prisma: any;
  user?: AuthenticatedUser;
}

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => Profile, { nullable: true })
  async profile(@Root() user: User, @Ctx() ctx: Context): Promise<Profile | null> {
    return await ctx.prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    }).then((result: any) => result?.profile || null);
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User, @Ctx() ctx: Context): Promise<Post[]> {
    return await ctx.prisma.user.findUnique({
      where: { id: user.id },
      include: { posts: true },
    }).then((result: any) => result?.posts || []);
  }

  @Query(() => [User])
  @Authorized(['ADMIN', 'MODERATOR'])
  async users(@Ctx() ctx: Context): Promise<User[]> {
    return await ctx.prisma.user.findMany({
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() ctx: Context): Promise<User | null> {
    if (!ctx.user) return null;
    
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string, @Ctx() ctx: Context): Promise<User | null> {
    return await ctx.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  @Mutation(() => AuthPayload)
  async register(@Arg('data') data: RegisterInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    // Check if user already exists
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check username uniqueness if provided
    if (data.username) {
      const existingUsername = await ctx.prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUsername) {
        throw new Error('Username already taken');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await ctx.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: 'USER',
      },
      include: {
        profile: true,
        posts: true,
      },
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    return { token, user };
  }

  @Mutation(() => AuthPayload)
  async login(@Arg('data') data: LoginInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    // Find user by email
    const user = await ctx.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        profile: true,
        posts: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    return { token, user };
  }

  @Mutation(() => User)
  @Authorized()
  async updateUser(
    @Arg('data') data: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    // Check if trying to update email and it's already taken
    if (data.email) {
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: ctx.user.id },
        },
      });

      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Check if trying to update username and it's already taken
    if (data.username) {
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: ctx.user.id },
        },
      });

      if (existingUser) {
        throw new Error('Username already taken');
      }
    }

    return await ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data,
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  @Mutation(() => Profile)
  @Authorized()
  async createProfile(
    @Arg('data') data: CreateProfileInput,
    @Ctx() ctx: Context
  ): Promise<Profile> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    // Check if profile already exists
    const existingProfile = await ctx.prisma.profile.findUnique({
      where: { userId: ctx.user.id },
    });

    if (existingProfile) {
      throw new Error('Profile already exists');
    }

    return await ctx.prisma.profile.create({
      data: {
        ...data,
        userId: ctx.user.id,
      },
      include: {
        user: true,
      },
    });
  }

  @Mutation(() => Profile)
  @Authorized()
  async updateProfile(
    @Arg('data') data: UpdateProfileInput,
    @Ctx() ctx: Context
  ): Promise<Profile> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    return await ctx.prisma.profile.upsert({
      where: { userId: ctx.user.id },
      update: data,
      create: {
        ...data,
        userId: ctx.user.id,
      },
      include: {
        user: true,
      },
    });
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteUser(@Ctx() ctx: Context): Promise<boolean> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    await ctx.prisma.user.delete({
      where: { id: ctx.user.id },
    });

    return true;
  }
}
