import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/user/entity/user-role.enum';

type JWTStrategyPayload = {
  email: string;
  role: UserRole;
  sub: number;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: JWTStrategyPayload) {
    return {
      email: payload.email,
      userId: payload.sub,
      role: payload.role,
    };
  }
}
