import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') idea: string;

  @Column('text') description: string;
  @ManyToOne(
    type => UserEntity,
    author => author.ideas,
  )
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable({
    name: 'upvotes', // table name for the junction table of this relation
    joinColumn: {
      name: 'idea_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  upvotes: UserEntity[];
  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable({
    name: 'downvotes', // table name for the junction table of this relation
    joinColumn: {
      name: 'idea_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  downvotes: UserEntity[];
}
