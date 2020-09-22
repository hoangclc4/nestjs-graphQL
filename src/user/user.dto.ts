import { IsNotEmpty, IsString } from 'class-validator';
import { IdeaEntity } from 'src/idea/idea.entity';

export class UserDTO {
  @IsNotEmpty() @IsString() username: string;

  @IsNotEmpty() @IsString() password: string;
}
export class UserRO {
  id: string;
  username: string;
  token?: string;
  bookmarks?: IdeaEntity[];
}
