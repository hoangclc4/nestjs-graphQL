import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }
  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO) {
    return this.ideaService.create(data);
  }
  @Get(':id')
  readIdea(@Param('id') id: number) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id, @Body() data: IdeaDTO) {
    return this.ideaService.update(id, data);
  }

  // @Delete(':id')
  // detroyIdea(){}
}
