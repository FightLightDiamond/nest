import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth_tokens')
export class AuthTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The auth token unique identifier',
  })
  id: number;

  @Column({
    type: 'bigint',
  })
  userId: number;

  @Column({
    type: 'varchar',
  })
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
