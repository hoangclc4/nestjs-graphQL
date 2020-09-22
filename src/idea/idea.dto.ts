import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';

export class IdeaDTO {
  @IsString() readonly idea: string;

  @IsString() readonly description: string;
}
export class IdeaRO {
  idea: string;
  description: string;
  upvotes?: number;
  downvotes?: number;
  author: UserRO;
  created: Date;
  updated: Date;
}
