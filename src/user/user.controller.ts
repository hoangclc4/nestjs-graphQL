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
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
  @Post('bookmark/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  bookmark(@Param('id') ideaId: string, @User('id') userId: string) {
    return this.userService.bookmark(ideaId, userId);
  }
  @Post('unbookmark/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  unbookmark(@Param('id') ideaId: string, @User('id') userId: string) {
    return this.userService.unbookmark(ideaId, userId);
  }
}
