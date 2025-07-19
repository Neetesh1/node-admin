import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role enum',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsString()
  username?: string;

  // Password is not exposed in GraphQL
  password!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => [Post])
  posts!: Post[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Profile {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  avatar?: string;

  @Field(() => User)
  user!: User;

  @Field()
  userId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Post {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsString()
  excerpt?: string;

  @Field()
  published!: boolean;

  @Field()
  @IsString()
  slug!: string;

  @Field()
  views!: number;

  @Field(() => User)
  author!: User;

  @Field()
  authorId!: string;

  @Field(() => [Category])
  categories!: Category[];

  @Field(() => [Tag])
  tags!: Tag[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsString()
  @MinLength(1)
  name!: string;

  @Field()
  @IsString()
  slug!: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => [Post])
  posts!: Post[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Tag {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsString()
  @MinLength(1)
  name!: string;

  @Field()
  @IsString()
  slug!: string;

  @Field(() => [Post])
  posts!: Post[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}
