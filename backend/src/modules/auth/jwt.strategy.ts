import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Staff } from '../../entities/staff.entity';

export type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<Staff, 'password'>> {
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role
    } as Omit<Staff, 'password'>;
  }
}