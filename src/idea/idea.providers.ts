import { IdeaEntity } from './idea.entity';
import { IDEA_REPOSITORY } from '../constants/index';

export const ideasProviders = [
  {
    provide: IDEA_REPOSITORY,
    useValue: IdeaEntity,
  },
];
