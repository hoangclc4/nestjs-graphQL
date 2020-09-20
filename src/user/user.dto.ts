import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
export class UserRO {
  id: string;
  username: string;
  token?: string;
}
