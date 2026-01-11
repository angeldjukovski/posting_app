import { Expose, Type } from 'class-transformer';
import { UserPublicDTO } from 'src/user/dto/user-public.dto';

export class CreatePostDTO {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  @Type(() => UserPublicDTO)
  user: UserPublicDTO;
}
