import { Expose, Exclude, Type } from 'class-transformer';
import { UserPublicDTO } from 'src/user/dto/user-public.dto';

export class CommentDTO {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  @Type(() => UserPublicDTO)
  user: UserPublicDTO;
  @Expose()
  isLiked?: boolean;
  @Expose()
  isReposted?: boolean;
  @Expose()
  likesCount: number;
  @Expose()
  repostsCount: number;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
