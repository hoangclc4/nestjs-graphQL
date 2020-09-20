import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column('text')
  password: string;

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean): UserRO {
    const { id, username, token } = this;
    const responseObject: UserRO = {
      id,
      username,
    };

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
