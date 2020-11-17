import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Module } from '@nestjs/common';
// import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { IdeaResolver } from './idea.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver],
})
export class IdeaModule {}
