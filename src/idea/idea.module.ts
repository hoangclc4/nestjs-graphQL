import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { ideasProviders } from './idea.providers';
import { Module } from '@nestjs/common';
// import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, ...ideasProviders],
})
export class IdeaModule {}
