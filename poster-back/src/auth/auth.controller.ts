import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/dto/users.dto';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RefreshTokenResponseDTO } from './dto/refresh-token.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() registerDto: RegisterDTO): Promise<Omit<User, 'password'>> {
    return this.authService.register(registerDto);
  }
  @Post('/login')
  login(@Body() loginDto: LoginDTO): Promise<RefreshTokenResponseDTO> {
    return this.authService.login(loginDto);
  }
  @Post('/refresh-token')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDTO,
  ): Promise<RefreshTokenResponseDTO> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
