import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Repository } from 'sequelize-typescript';
import { IdeaEntity } from './idea.entity';
// import { IDEA_REPOSITORY } from '../constants/index';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  private ideaToResponseObject(idea: IdeaEntity) {
    const responseObject: any = {
      ...idea,
      author: idea.author ? idea.author.toResponseObject(false) : null,
    };
    if (idea.upvotes) {
      responseObject.upvotes = idea.upvotes.length;
    }
    if (idea.downvotes) {
      responseObject.downvotes = idea.downvotes.length;
    }
    return responseObject;
  }
  async showAll() {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes'],
    });
    return ideas.map(idea => this.ideaToResponseObject(idea));
  }
  async read(id: number) {
    const idea = await this.ideaRepository.findOne({
      relations: ['author'],
      where: { id },
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }
  async create(data: IdeaDTO, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const newIdea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(newIdea);
    return this.ideaToResponseObject(newIdea);
  }
  async update(id: string, data: IdeaDTO) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.update({ id }, data);
    let res = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return this.ideaToResponseObject(res);
  }
}
