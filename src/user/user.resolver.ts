import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
const pubSub = new PubSub();

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  users() {
    return this.userService.findAllUser();
  }
  @Query()
  @UseGuards(new AuthGuard())
  user(@Context('user') user) {
    console.log(user);
    return this.userService.findUser(user.username);
  }
  @Mutation()
  login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const data: UserDTO = { username, password };
    return this.userService.login(data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  bookmark(@Args('ideaId') ideaId: string, @Context('user') user) {
    return this.userService.bookmark(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  unbookmark(@Args('ideaId') ideaId: string, @Context('user') user) {
    return this.userService.unbookmark(ideaId, user.id);
  }

  @Mutation()
  register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const data: UserDTO = { username, password };
    const newUser = this.userService.register(data);
    pubSub.publish('userAdded', { userAdded: newUser });
    return newUser;
  }

  @Query()
  memberInformation(@Args('memberId') memberId: number
  )
  {
    return  this.userService.handleMemberInformation(
      memberId
    );
  }
  @Subscription('userAdded')
  userAdded() {
    console.log('object');
    return {
      subscribe: () => pubSub.asyncIterator('userAdded'),
    };
  }
}
