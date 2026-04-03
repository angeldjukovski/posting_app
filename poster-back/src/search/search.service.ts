import { Injectable } from '@nestjs/common';
import { SearchDTO } from './dto/search.dto';
import { PostORMEntity } from 'src/post/entity/post.entity';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>,
    @InjectRepository(PostORMEntity)
    private readonly postRepository: Repository<PostORMEntity>,
  ) {}

  async searchData(searchDTO: SearchDTO) {
    const { title, username, query } = searchDTO;

    if (!query && !username && !title) {
      return { user: [], posts: [] };
    }

    const usersQuery = this.userRepository.createQueryBuilder('user');

    if (query) {
      usersQuery.andWhere('user.username ILIKE :query', {
        query: `%${query}%`,
      });
    } else if (username) {
      usersQuery.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    const users = await usersQuery.getMany();

    const postsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user');

    if (query) {
      postsQuery.andWhere(
        '(post.title ILIKE :query OR post.content ILIKE :query)',
        {
          query: `%${query}%`,
        },
      );
    } else if (title) {
      postsQuery.andWhere('post.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    const posts = await postsQuery.getMany();

    return {
      users,
      posts,
    };
  }
}
