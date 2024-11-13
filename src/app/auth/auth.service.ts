import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtPayload } from '@/types/jwt';
import { verifyTelegramWebAppData } from '@/commons/telegram.common';
import { decodeParams } from '@/commons/general.common';
import { ITelegramInitData } from '@/types/telegram';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateAccessToken(userId: string) {
    const payload: JwtPayload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '15m' }); // short-lived access token
  }

  async generateRefreshToken(userId: string) {
    const payload: JwtPayload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // long-lived refresh token
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new Error();
      return this.generateAccessToken(user.id); // Issue new access token
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  async login(body: LoginDto): Promise<User> {
    const verifyCheck = verifyTelegramWebAppData(body.initData);

    if (!verifyCheck) throw new UnauthorizedException('Invalid telegram hash');

    const initData = decodeParams<ITelegramInitData>(body.initData);

    let user = await this.prisma.user.findUnique({
      where: { telegramId: initData.user.id.toString() },
    });

    if (!user) {
      const newUser = await this.prisma.user.create({
        data: {
          telegramId: initData.user.id.toString(),
          createdBy: 'Login Endpoint',
          updatedBy: 'Login Endpoint',
        },
      });
      user = newUser;
    }

    return user!;
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return payload;
    } catch (e) {
      return null;
    }
  }
}
