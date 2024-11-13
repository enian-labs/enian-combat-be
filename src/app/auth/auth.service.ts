import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtPayload } from '@/types/jwt';
import { verifyTelegramWebAppData } from '@/commons/telegram.common';
import { decodeParams } from '@/commons/general.common';
import { ITelegramInitData } from '@/types/telegram';
import { v4 as uuidv4 } from 'uuid';

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
    const token = uuidv4(); // Generate a new token
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // Set expiration date for 7 days

    // Store the refresh token in the database
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiredAt,
      },
    });

    return token;
  }

  async refreshAccessToken(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiredAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        expiredAt: new Date(),
      },
    });

    const accessToken = await this.generateAccessToken(storedToken.user.id);

    const newRefreshToken = await this.generateRefreshToken(
      storedToken.user.id,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async login(body: LoginDto): Promise<User> {
    const verifyCheck = verifyTelegramWebAppData(body.initData);

    if (!verifyCheck) throw new UnauthorizedException('Invalid telegram hash');

    const initData = decodeParams<ITelegramInitData>(body.initData);

    const user = await this.prisma.user.upsert({
      where: { telegramId: initData.user.id.toString() },
      update: {},
      create: {
        telegramId: initData.user.id.toString(),
        createdBy: 'Login Endpoint',
        updatedBy: 'Login Endpoint',
      },
    });

    return user;
  }

  // Verify refresh token (optional, in case you need to check manually)
  async verifyRefreshToken(refreshToken: string) {
    try {
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      return storedToken;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        expiredAt: new Date(),
      },
    });
  }
}
