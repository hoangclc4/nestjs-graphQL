import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/shared/auth.guard';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Resolver()
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}
  @Query()
  ideas() {
    return this.ideaService.showAll();
  }
  @Query()
  idea(@Args('id') id: string) {
    return this.ideaService.read(id);
  }

  @Mutation()
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  createIdea(
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user,
  ) {
    const data: IdeaDTO = { idea, description };
    return this.ideaService.create(data, user.id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  updateIdea(
    @Args('id') id: string,
    @Args('data') data: IdeaDTO,
    @Context('user') user,
  ) {
    return this.ideaService.update(id, data, user.id);
  }
}
