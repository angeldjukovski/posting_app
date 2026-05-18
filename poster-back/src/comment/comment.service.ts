import { Injectable } from '@nestjs/common';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { CommentORMEntity } from './entity/comment.entity';
import { PostRepostORMEntity } from 'src/post/entity/repost.entity';
import { PostLikeORMEntity } from 'src/post/entity/post-like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CommentDTO } from './dto/comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PostORMEntity } from 'src/post/entity/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentORMEntity)
    private readonly commentRepository: Repository<CommentORMEntity>,
    @InjectRepository(PostORMEntity)
    private readonly postRepository: Repository<PostORMEntity>,
    @InjectRepository(PostRepostORMEntity)
    private readonly repostRepository: Repository<PostRepostORMEntity>,
    @InjectRepository(PostLikeORMEntity)
    private readonly likeRepostiory: Repository<PostLikeORMEntity>,
  ) {}

  async createComment(
    postId: number,
    createCommentDTO: CreateCommentDTO,
    user: UserORMEntity,
  ): Promise<CommentDTO> {
    try {
      const post = await this.postRepository.findOneBy({ id: postId });

      if (!post) {
        throw new NotFoundException('Page not found');
      }

      const comment = this.commentRepository.create({
        ...createCommentDTO,
        user,
        post,
      });
      const saveComment = await this.commentRepository.save(comment);
      const displayData = {
        ...saveComment,
        likesCount: 0,
        repostsCOunt: 0,
        isLiked: false,
        isReposted: false,
      };
      return plainToInstance(CommentDTO, displayData, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error during comment creation');
    }
  }

  async updateComment(
    commentID: number,
    updateCommentDTO: UpdateCommentDTO,
    user: UserORMEntity,
  ) {
    const update = await this.commentRepository.findOne({
      where: { id: commentID },
      relations: ['user'],
    });
    if (!update) {
      throw new BadRequestException(
        `This comment with ${commentID} was not found`,
      );
    }
    if (update.user.id !== user.id) {
      throw new ForbiddenException('You cannot edit this comment');
    }
    Object.assign(update, updateCommentDTO);
    return this.commentRepository.save(update);
  }

  async deleteComment(commentID: number, user: UserORMEntity): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentID },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Post not found');
    }
    if (!comment.user || comment.user.id !== user.id) {
      throw new ForbiddenException('You cannot delete this post');
    }
    await this.commentRepository.remove(comment);
  }

  async findALL(postId: number, userId?: number) {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.post = :postId', { postId })
      .leftJoinAndSelect('comment.user', 'user')
      .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
      .loadRelationCountAndMap('comment.repostsCount', 'comment.reposts');
    if (userId) {
      query
        .leftJoin(
          'comment.likes',
          'myLike',
          'myLike.userId = :userId AND myLike.commentID = comment.id',
          { userId },
        )
        .leftJoin(
          'comment.reposts',
          'myReposts',
          'myReposts.userId = :userId AND myReposts.commentID = comment.id',
          { userId },
        )
        .addSelect(
          'CASE WHEN myLike.id IS NOT NULL THEN true ELSE false END',
          'isLiked',
        )
        .addSelect(
          'CASE WHEN myReposts.id IS NOT NULL THEN true ELSE false END',
          'isReposted',
        );
    }
    const { entities, raw } = await query.getRawAndEntities();
    return entities.map((comment) => {
      const rawItems = raw.find((r) => r.comment_id === comment.id);

      return {
        ...comment,
        isLiked: userId
          ? rawItems?.isLiked === true || rawItems?.isLiked === 'true'
          : false,
        isReposted: userId
          ? rawItems?.isReposted === true || rawItems?.isReposted === 'true'
          : false,
      };
    });
  }

  async findByTitle(title: string): Promise<CommentORMEntity | null> {
    const comment = await this.commentRepository.findOneBy({ title });
    return comment;
  }

  async findByID(commentID: number): Promise<CommentORMEntity> {
    const comment = await this.commentRepository.findOneBy({ id: commentID });
    if (!comment) {
      throw new NotFoundException(
        `This comment with the id: ${commentID} was not found`,
      );
    }
    return comment;
  }
  async findByUser(postId: number, userId: number) {
    return this.commentRepository.find({
      where: { user: { id: userId }, post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
  async findRepostCommentByUser(userId: number) {
    const repost = await this.repostRepository.find({
      where: { user: { id: userId }, comment: { id: Not(IsNull()) } },
      relations: ['user', 'comment.user'],
    });
    return repost.map((repost) => repost.comment);
  }

  async toggleLike(commentID: number, user: UserORMEntity) {
    const comment = await this.commentRepository.findOneBy({ id: commentID });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.likeRepostiory.findOne({
      where: { user: { id: user.id }, comment: { id: commentID } },
      relations: ['user', 'comment'],
    });
    if (existing) {
      await this.likeRepostiory.remove(existing);
      return { isLiked: false };
    }
    const like = this.likeRepostiory.create({ user, comment });
    await this.likeRepostiory.save(like);
    return { isLiked: true };
  }

  async toggleRepost(commentID: number, user: UserORMEntity) {
    const comment = await this.commentRepository.findOneBy({ id: commentID });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.repostRepository.findOne({
      where: { user: { id: user.id }, comment: { id: commentID } },
      relations: ['user', 'comment'],
    });
    if (existing) {
      await this.repostRepository.remove(existing);
      return { isReposted: false };
    }
    const repost = this.repostRepository.create({ user, comment });
    await this.repostRepository.save(repost);
    return { isReposted: true };
  }
  async deleteLike(commentID: number, user: UserORMEntity) {
    const like = await this.likeRepostiory.findOne({
      where: { user: { id: user.id }, comment: { id: commentID } },
      relations: ['user', 'comment'],
    });
    if (!like) {
      throw new NotFoundException('No comment was found');
    }
    if (like.user.id !== like.id) {
      throw new ForbiddenException('You cannot remove this like');
    }
    await this.likeRepostiory.remove(like);
  }

  async deleteRepost(commentID: number, user: UserORMEntity) {
    const repost = await this.repostRepository.findOne({
      where: { user: { id: user.id }, comment: { id: commentID } },
      relations: ['user', 'comment'],
    });
    if (!repost) {
      throw new NotFoundException('No comment was found');
    }
    if (repost.user.id !== repost.id) {
      throw new ForbiddenException('You cannot remove this like');
    }
    await this.repostRepository.remove(repost);
  }
}
