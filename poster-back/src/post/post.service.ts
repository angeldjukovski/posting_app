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
    try {
      const post = this.postRepository.create({ ...createPostDTO, user });
      const savePost = await this.postRepository.save(post);
      return plainToInstance(PostDTO, savePost, {
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
    const { entities, raw } = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.likes', 'likes')
      .leftJoin('post.reposts', 'reposts')
      .leftJoin('post.likes', 'myLike', 'myLike.userId = :userId', { userId })
      .leftJoin('post.reposts', 'myRepost', 'myRepost.userId = :userId', {
        userId,
      })
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.repostsCount', 'post.reposts')
      .addSelect('myLike.id IS NOT NULL', 'isLiked')
      .addSelect('myRepost.id IS NOT NULL', 'isReposted')
      .getRawAndEntities();

    return entities.map((post, i) => ({
      ...post,
      isLiked: raw[i].isLiked,
      isReposted: raw[i].isReposted,
    }));
  }

  async findByTitle(title: string): Promise<PostORMEntity | null> {
    const post = await this.postRepository.findOneBy({ title });
    return post;
  }

  async findByID(postID: number): Promise<PostORMEntity> {
    const post = await this.postRepository.findOneBy({ id: postID });
    if (!post) {
      throw new NotFoundException(
        `The Post with the id : ${postID} was not found `,
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
    const post = await this.postRepository.findOne({
      where: { id: postID },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('You cannot edit this post');
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
      return { liked: false };
    }
    const like = this.postLikeRepository.create({ user, post });
    await this.postLikeRepository.save(like);
    return { liked: true };
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
      return { reposted: false };
    }

    const repost = this.postRepostRepository.create({ user, post });
    await this.postRepostRepository.save(repost);
    return { reposted: true };
  }
}
