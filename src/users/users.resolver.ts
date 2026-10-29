import { User } from './user.module.js';
import { CreateUserInput } from './dto/create-user.input.js';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input.js';

@Resolver(() => User)
export class UserResolver {
  private users: User[] = [];
  private nextId = 1;

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): User {
    const user: User = {
      id: String(this.nextId++),
      name: input.name,
      email: input.email,
    };

    this.users.push(user);

    return user;
  }

  @Query(() => [User])
  getUsers(): User[] {
    return this.users;
  }

  @Mutation(() => User, { nullable: true })
  updateUser(@Args('input') input: UpdateUserInput): User | null {
    const user = this.users.find((user) => user.id === input.id);
    if (!user) {
      return null;
    }

    if (input.name !== undefined) {
      user.name = input.name;
    }

    return user;
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);

    return true;
  }
}
