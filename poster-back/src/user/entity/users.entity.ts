import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { PostORMEntity } from 'src/post/entity/post.entity';

@Entity({ name: 'user' })
export class UserORMEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Poster })
  role: UserRole;
  @OneToMany(() => PostORMEntity, (post) => post.user)
  posts: PostORMEntity[];
  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  refreshToken: string[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
