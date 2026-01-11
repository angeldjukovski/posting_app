import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { PostLikeORMEntity } from './post-like.entity';
import { PostRepostORMEntity } from './repost.entity';

@Entity({ name: 'posts' })
export class PostORMEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserORMEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserORMEntity;
  @Column()
  title: string;
  @Column({ type: 'text' })
  content: string;
  @OneToMany(() => PostLikeORMEntity, (like) => like.post)
  likes: PostLikeORMEntity[];
  @OneToMany(() => PostRepostORMEntity, (repost) => repost.post)
  reposts: PostLikeORMEntity[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
