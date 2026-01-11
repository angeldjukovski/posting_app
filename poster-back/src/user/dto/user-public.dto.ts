import { Expose } from 'class-transformer';

export class UserPublicDTO {
  @Expose()
  id: number;
  @Expose()
  username: string;
}
