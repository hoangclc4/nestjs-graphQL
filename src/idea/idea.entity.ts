import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IdeaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;
}
