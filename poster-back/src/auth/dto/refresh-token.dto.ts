import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({ description: 'Refresh token of the user' })
  refreshToken: string;
}
