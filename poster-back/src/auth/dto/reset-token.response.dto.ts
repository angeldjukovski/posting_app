import { ApiProperty } from '@nestjs/swagger';

export class ResetTokenResponseDTO {
  @ApiProperty({ description: 'Token for reset of user password' })
  token: string;
}
