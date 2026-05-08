import {
  Controller,
  Body,
  Patch,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { GetUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CommentService } from './comment.service';
import { UserORMEntity } from 'src/user/entity/users.entity';

@Controller('post/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDTO,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.createComment(postId, createCommentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDTO: UpdateCommentDTO,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.updateComment(id, updateCommentDTO, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.deleteComment(id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number, @GetUser() user: UserORMEntity) {
    return this.commentService.toggleLike(id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/repost')
  repost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.toggleRepost(id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  deleteLike(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.deleteLike(id, user);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  deleteRepost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserORMEntity,
  ) {
    return this.commentService.deleteRepost(id, user);
  }
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.commentService.findALL(userId ? Number(userId) : undefined);
  }
  @Get(':id')
  getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByID(id);
  }
  @Get('user/:id/comment')
  getCommentsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByUser(id);
  }
  @Get()
  getCommentByPost(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByComment(id);
  }
}
