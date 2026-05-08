import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { PostORMEntity } from './post.entity';
import { CommentORMEntity } from 'src/comment/entity/comment.entity';

@Entity('post-likes')
export class PostLikeORMEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserORMEntity, { onDelete: 'CASCADE' })
  user: UserORMEntity;

  @ManyToOne(() => PostORMEntity, (post) => post.likes, { onDelete: 'CASCADE' })
  post: PostORMEntity;

  @ManyToOne(() => CommentORMEntity, (comment) => comment.reposts, {
    onDelete: 'CASCADE',
  })
  comment: CommentORMEntity;

  @CreateDateColumn()
  createdAt: Date;
}
