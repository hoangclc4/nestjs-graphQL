import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from 'src/idea/idea.dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  async login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(await user.comparePassword(password));
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }
  async register(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne(username);
    if (user)
      throw new HttpException(
        'Username is already exist',
        HttpStatus.BAD_REQUEST,
      );
    let newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return newUser.toResponseObject();
  }
  async bookmark(ideaId: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (await user.bookmarks.find(bookmark => bookmark.id == ideaId)) {
      throw new HttpException(
        'Idea has already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.bookmarks.push(idea);
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }
  async unbookmark(ideaId: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (!(await user.bookmarks.find(bookmark => bookmark.id == ideaId))) {
      throw new HttpException(
        'Idea was not exist to bookmark',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.bookmarks = await user.bookmarks.filter(
      bookmark => bookmark.id !== ideaId,
    );
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }
}
