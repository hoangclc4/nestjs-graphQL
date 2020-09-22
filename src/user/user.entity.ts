import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { IdeaEntity } from 'src/idea/idea.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @Column('text') username: string;

  @Column('text') password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  @OneToMany(
    type => IdeaEntity,
    idea => idea.author,
    { cascade: true },
  )
  ideas: IdeaEntity[];
  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable({
    name: 'bookmarks', // table name for the junction table of this relation
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'idea_id',
    },
  })
  bookmarks: IdeaEntity[];
  toResponseObject(showToken: boolean = true): UserRO {
    const { id, username, token, bookmarks } = this;
    const responseObject: UserRO = {
      id,
      username,
    };
    if (showToken) {
      responseObject.token = token;
    }
    if (bookmarks) responseObject.bookmarks = bookmarks;
    return responseObject;
  }
  private get token(): string {
    const { id, username } = this;

    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}
