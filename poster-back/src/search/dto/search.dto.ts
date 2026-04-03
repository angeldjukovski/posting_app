import { IsOptional, IsString } from 'class-validator';

export class SearchDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  query?: string;
}
