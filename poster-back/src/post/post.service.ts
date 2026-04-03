import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostORMEntity } from './entity/post.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostDTO } from './dto/post.dto';
import { UserORMEntity } from 'src/user/entity/users.entity';

import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { PostLikeORMEntity } from './entity/post-like.entity';
import { PostRepostORMEntity } from './entity/repost.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostORMEntity)
    private readonly postRepository: Repository<PostORMEntity>,
    @InjectRepository(PostLikeORMEntity)
    private readonly postLikeRepository: Repository<PostLikeORMEntity>,
    @InjectRepository(PostRepostORMEntity)
    private readonly postRepostRepository: Repository<PostRepostORMEntity>,
  ) {}

  async createPost(
    createPostDTO: CreatePostDTO,
    user: UserORMEntity,
  ): Promise<PostDTO> {
    console.log('Saving Post:', user.id);
    try {
      const post = this.postRepository.create({ ...createPostDTO, user });
      const savePost = await this.postRepository.save(post);
      const displayData = {
        ...savePost,
        likesCount: 0,
        repostsCount: 0,
        isLiked: false,
        isReposted: false,
      };
      return plainToInstance(PostDTO, displayData, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error during post creation');
    }
  }
  async updatePost(
    postID: number,
    updatePostDto: UpdatePostDTO,
    user: UserORMEntity,
  ) {
    const update = await this.postRepository.findOne({
      where: { id: postID },
      relations: ['user'],
    });
    if (!update) {
      throw new BadRequestException(
        `The post with the id : ${postID} was not found`,
      );
    }
    if (update.user.id !== user.id) {
      throw new ForbiddenException('You cannot edit this post');
    }
    Object.assign(update, updatePostDto);
    return this.postRepository.save(update);
  }

  async findAll(userId?: number) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.repostsCount', 'post.reposts');

    if (userId) {
      query

        .leftJoin(
          'post.likes',
          'myLike',
          'myLike.userId = :userId AND myLike.postId = post.id',
          { userId },
        )
        .leftJoin(
          'post.reposts',
          'myRepost',
          'myRepost.userId = :userId AND myRepost.postId = post.id',
          {
            userId,
          },
        )
        .addSelect(
          'CASE WHEN myLike.id IS NOT NULL THEN true ELSE false END',
          'isLiked',
        )
        .addSelect(
          'CASE WHEN myRepost.id IS NOT NULL THEN true ELSE false END',
          'isReposted',
        );
    }
    const { entities, raw } = await query.getRawAndEntities();
    return entities.map((post) => {
      const rawItem = raw.find((r) => r.post_id === post.id);

      return {
        ...post,
        isLiked: userId
          ? rawItem?.isLiked === true || rawItem?.isLiked === 'true'
          : false,
        isReposted: userId
          ? rawItem?.isReposted === true || rawItem?.isReposted === 'true'
          : false,
      };
    });
  }

  async findByTitle(title: string): Promise<PostORMEntity | null> {
    const post = await this.postRepository.findOneBy({ title });
    return post;
  }

  async findByID(postID: number): Promise<PostORMEntity> {
    const post = await this.postRepository.findOneBy({ id: postID });
    if (!post) {
      throw new NotFoundException(
        `The Post with the id : ${postID} was not found`,
      );
    }
    return post;
  }
  async findByUser(userId: number) {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async deletePost(postID: number, user: UserORMEntity): Promise<void> {
    console.log('User request:', user);
    const post = await this.postRepository.findOne({
      where: { id: postID },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (!post.user || post.user.id !== user.id) {
      throw new ForbiddenException('You cannot delete this post');
    }
    await this.postRepository.remove(post);
  }

  async toggleLike(postID: number, user: UserORMEntity) {
    const post = await this.postRepository.findOneBy({ id: postID });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.postLikeRepository.findOne({
      where: { user: { id: user.id }, post: { id: postID } },
      relations: ['user', 'post'],
    });
    if (existing) {
      await this.postLikeRepository.remove(existing);
      return { isLiked: false };
    }
    const like = this.postLikeRepository.create({ user, post });
    await this.postLikeRepository.save(like);
    return { isLiked: true };
  }

  async deleteLike(postID: number, user: UserORMEntity) {
    const postLike = await this.postLikeRepository.findOne({
      where: { user: { id: user.id }, post: { id: postID } },
      relations: ['user', 'post'],
    });
    if (!postLike) {
      throw new NotFoundException('No post was found');
    }
    if (postLike.user.id !== postLike.id) {
      throw new ForbiddenException('You cannot remove this like');
    }
    await this.postLikeRepository.remove(postLike);
  }

  async toggleRepost(postID: number, user: UserORMEntity) {
    const post = await this.postRepository.findOneBy({ id: postID });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.postRepostRepository.findOne({
      where: { user: { id: user.id }, post: { id: postID } },
      relations: ['user', 'post'],
    });

    if (existing) {
      await this.postRepostRepository.remove(existing);
      return { isReposted: false };
    }

    const repost = this.postRepostRepository.create({ user, post });
    await this.postRepostRepository.save(repost);
    return { isReposted: true };
  }

  async removeRepost(postID: number, user: UserORMEntity) {
    const repost = await this.postRepostRepository.findOne({
      where: { user: { id: user.id }, post: { id: postID } },
      relations: ['user', 'post'],
    });
    if (!repost) {
      throw new NotFoundException('No post was found');
    }
    if (repost.user.id !== repost.id) {
      throw new ForbiddenException('You cannot remove this repost');
    }
    await this.postRepostRepository.remove(repost);
  }
}
