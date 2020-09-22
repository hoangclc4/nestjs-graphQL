import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }
  @Get(':id')
  readIdea(@Param('id') id: number) {
    return this.ideaService.read(id);
  }
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  createIdea(@Body() data: IdeaDTO, @User('id') userId) {
    return this.ideaService.create(data, userId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: IdeaDTO) {
    return this.ideaService.update(id, data);
  }

  // @Delete(':id')
  // detroyIdea(){}
}
