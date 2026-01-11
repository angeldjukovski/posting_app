import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  ParseIntPipe,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UserORMEntity } from 'src/user/entity/users.entity';

import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';

import { GetUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() CreatePostDTO: CreatePostDTO, @GetUser() user: UserORMEntity) {
    return this.postService.createPost(CreatePostDTO, user);
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDTO,
    @GetUser() user: UserORMEntity,
  ) {
    return this.postService.updatePost(id, updatePostDto, user);
  }

  @Get('user/:id')
  getPostByUser(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findByUser(id);
  }

  @Get(':id')
  getPostByID(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findByID(id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('search')
  findPostByTitle(@Query('title') title: string) {
    return this.postService.findByTitle(title);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.postService.deletePost(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  postLike(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.postService.toggleLike(id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/repost')
  postRepost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.postService.toggleRepost(id, user);
  }
}
