import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostORMEntity } from './entity/post.entity';
import { PostLikeORMEntity } from './entity/post-like.entity';
import { PostRepostORMEntity } from './entity/repost.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostORMEntity,
      PostLikeORMEntity,
      PostRepostORMEntity,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
