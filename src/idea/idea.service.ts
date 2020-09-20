import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Repository } from 'sequelize-typescript';
import { IdeaEntity } from './idea.entity';
// import { IDEA_REPOSITORY } from '../constants/index';
import { IdeaDTO } from './idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }
  async create(data: IdeaDTO) {
    const newIdea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(newIdea);
    return newIdea;
  }
  async update(id, data: IdeaDTO) {
    const idea = await this.ideaRepository.findOne({
      where: {
        id,
      },
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.update({ id }, data);
    return await this.ideaRepository.findOne({ id });
  }
  async read(id: number) {
    const idea = await this.ideaRepository.findOne({
      where: {
        id,
      },
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }
}
