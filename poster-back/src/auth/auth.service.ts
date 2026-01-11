import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { UserRole } from 'src/user/entity/user-role.enum';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenResponseDTO } from './dto/refresh-token.response.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDTO,
  ): Promise<Omit<UserORMEntity, 'password'>> {
    const { username, email, firstName, lastName, password } = registerDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new BadRequestException(`That ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );

    const { password: _, ...passwordlessUser } = await this.userRepository.save(
      {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: registerDto.role || UserRole.Poster,
      },
    );

    return passwordlessUser;
  }

  async login(loginDto: LoginDTO): Promise<RefreshTokenResponseDTO> {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException(
        `User with the email ${loginDto.email} not found`,
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong credentials');
    }

    const { token, refreshToken } = await this.generateTokens(user);
    await this.addRefreshToken(user, refreshToken);

    return { token, refreshToken };
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO) {
    const payload = await this.jwtService.verifyAsync(
      refreshTokenDTO.refreshToken,
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );
    const userId = payload.userId;
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with the id ${userId} has not been found`,
      );
    }
    await this.validateUsersRefreshToken(refreshTokenDTO.refreshToken, user);
    await this.removeRefreshToken(user, refreshTokenDTO.refreshToken);
    const { token, refreshToken } = await this.generateTokens(user);
    await this.addRefreshToken(user, refreshToken);
    return {
      token,
      refreshToken,
    };
  }

  private async generateTokens(
    user: UserORMEntity,
  ): Promise<RefreshTokenResponseDTO> {
    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '1h',
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );
    return {
      token,
      refreshToken,
    };
  }

  private async validateUsersRefreshToken(
    token: string,
    user: UserORMEntity,
  ): Promise<void> {
    const isTokenValid = await Promise.any(
      user.refreshToken.map((hashedToken) =>
        bcrypt.compare(token, hashedToken),
      ),
    ).catch(() => false);

    if (!isTokenValid) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  private async addRefreshToken(
    user: UserORMEntity,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      Number(process.env.BCRYPT_SALT),
    );
    await this.userRepository.update(user.id, {
      refreshToken: [...user.refreshToken, hashedRefreshToken],
    });
  }

  private async removeRefreshToken(
    user: UserORMEntity,
    refreshToken: string,
  ): Promise<void> {
    const remainingTokens: string[] = [];

    for (const hashedToken of user.refreshToken) {
      const match = await bcrypt.compare(refreshToken, hashedToken);
      if (!match) {
        remainingTokens.push(hashedToken);
      }
    }

    user.refreshToken = remainingTokens;
    await this.userRepository.save(user);
  }
}
