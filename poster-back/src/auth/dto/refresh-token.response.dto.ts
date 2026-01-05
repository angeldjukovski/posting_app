import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDTO {
  @ApiProperty({ description: 'Token of the User' })
  token: string;
  @ApiProperty({ description: 'Refresh token of the user' })
  refreshToken: string;
}
