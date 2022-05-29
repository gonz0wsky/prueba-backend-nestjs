import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.model';
import { SignInType, SignUpType } from './models/auth.models';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return token;
  }

  async signUp(dto: SignUpType): Promise<UserType> {
    try {
      const hash = await argon.hash(dto.password);

      const { email, firstName, lastName } = dto;

      const user = await this.prisma.user.create({
        data: { email, hash, firstName, lastName },
      });

      const token = await this.signToken(user.id, user.email);

      return { ...user, token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInType): Promise<UserType> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const valid = await argon.verify(user.hash, dto.password);

      if (!valid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.signToken(user.id, user.email);

      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }
}
