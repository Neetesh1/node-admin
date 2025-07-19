import { InputType, Field } from 'type-graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { Role } from './index';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  role?: Role;
}

@InputType()
export class CreateProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;
}

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @MinLength(1)
  title!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @Field()
  @IsString()
  slug!: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tagIds?: string[];
}

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  categoryIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tagIds?: string[];
}
