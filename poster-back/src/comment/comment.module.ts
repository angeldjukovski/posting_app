import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentORMEntity } from './entity/comment.entity';
import { PostLikeORMEntity } from 'src/post/entity/post-like.entity';
import { PostRepostORMEntity } from 'src/post/entity/repost.entity';
import { PostORMEntity } from 'src/post/entity/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentORMEntity,
      PostLikeORMEntity,
      PostRepostORMEntity,
      PostORMEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
