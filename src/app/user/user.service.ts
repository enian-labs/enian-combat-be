import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { WalletType } from '@/constants/wallet.constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async findByUserId(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.getUserById(userId);
    return this.mapToUserResponseDto(user);
  }

  async updateUserWallets(
    userId: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    switch (updateWalletDto.type) {
      case WalletType.TON:
        // Check if the user wallet is already bind
        if (user.tonAddress) {
          throw new ConflictException('User already bind TON wallet');
        }

        // Check wallet already used
        const existingTonUser = await this.prisma.user.findFirst({
          where: { tonAddress: updateWalletDto.walletAddress },
        });
        if (existingTonUser && existingTonUser.id !== userId) {
          throw new ConflictException(
            'TON wallet is already associated with another user',
          );
        }
        break;
      case WalletType.EVM:
        // Check if the user wallet is already bind
        if (user.evmAddress) {
          throw new ConflictException('User already bind EVM address');
        }

        // Check wallet already used
        const existingEvmUser = await this.prisma.user.findFirst({
          where: { evmAddress: updateWalletDto.walletAddress },
        });
        if (existingEvmUser && existingEvmUser.id !== userId) {
          throw new ConflictException(
            'EVM address is already associated with another user',
          );
        }
        break;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        tonAddress:
          updateWalletDto.type === WalletType.TON
            ? updateWalletDto.walletAddress
            : undefined,
        evmAddress:
          updateWalletDto.type === WalletType.EVM
            ? updateWalletDto.walletAddress
            : undefined,
      },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.findByUserId(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      telegramId: user.telegramId,
      tonAddress: user.tonAddress,
      evmAddress: user.evmAddress,
      gold: user.gold,
      finishOnboarding: user.finishOnboarding,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    };
  }
}
