import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/models/user.models';
import {
  ChangePasswordType,
  RequestResetPassowrdType,
  ResetPasswordType,
  SignInType,
  SignUpType,
} from './models/auth.models';

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
      expiresIn: '7d',
      secret: this.config.get('JWT_SECRET'),
    });

    return token;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
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
      const user = await this.getUserByEmail(dto.email);

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const valid = await argon.verify(user.hash, dto.password);

      if (!valid) throw new UnauthorizedException('Invalid credentials');

      const token = await this.signToken(user.id, user.email);

      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    dto: ChangePasswordType,
    user: UserType,
  ): Promise<boolean> {
    try {
      const userdb = await this.getUserByEmail(user.email);

      if (!userdb) throw new UnauthorizedException('User not found');

      const valid = await argon.verify(userdb.hash, dto.currentPassword);

      if (!valid) throw new UnauthorizedException('Invalid credentials');

      const newHash = await argon.hash(dto.newPassword);

      await this.prisma.user.update({
        data: { hash: newHash },
        where: { id: userdb.id },
      });

      return true;
    } catch (error) {
      return error;
    }
  }

  async requestResetPassword(dto: RequestResetPassowrdType): Promise<string> {
    try {
      const user = await this.getUserByEmail(dto.email);

      if (!user) throw new UnauthorizedException('User not found');

      const token = await this.signToken(user.id, user.email);

      // This should be sent to the user's email
      return token;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordType): Promise<boolean> {
    try {
      const decoded = this.jwt.decode(dto.token);

      const expirationDate = new Date(decoded['exp'] * 1000);

      if (expirationDate < new Date())
        throw new UnauthorizedException('Token expired');

      const id = decoded['sub'];
      const email = decoded['email'];

      const user = await this.getUserByEmail(email);

      if (!user || user.id !== id)
        throw new UnauthorizedException('User not found');

      const newHash = await argon.hash(dto.password);

      await this.prisma.user.update({
        data: { hash: newHash },
        where: { id },
      });

      return true;
    } catch (error) {
      return error;
    }
  }
}
