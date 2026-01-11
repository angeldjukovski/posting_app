import { IsString, IsNotEmpty } from 'class-validator';

export class EditPostDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
