import { Expose, Exclude, Type } from 'class-transformer';
import { UserPublicDTO } from 'src/user/dto/user-public.dto';

export class PostDTO {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  @Type(() => UserPublicDTO)
  user: UserPublicDTO;
  @Expose()
  likesCount: number;
  @Expose()
  repostsCount: number;
  @Expose()
  isLiked?: boolean;
  @Expose()
  isReposted?: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
