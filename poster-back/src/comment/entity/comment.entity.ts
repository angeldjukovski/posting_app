import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { PostLikeORMEntity } from 'src/post/entity/post-like.entity';
import { PostRepostORMEntity } from 'src/post/entity/repost.entity';
import { PostORMEntity } from 'src/post/entity/post.entity';

@Entity({ name: 'comment' })
export class CommentORMEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UserORMEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserORMEntity;
  @Column()
  title: string;
  @Column()
  content: string;
  @OneToMany(() => PostRepostORMEntity, (repost) => repost.comment)
  reposts: PostRepostORMEntity[];
  @OneToMany(() => PostLikeORMEntity, (like) => like.comment)
  likes: PostLikeORMEntity[];
  @ManyToOne(() => PostORMEntity, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostORMEntity;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
