import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { StartFarmingQueryDto } from '@/app/farm/dto/start-farming-query.dto';

@Injectable()
export class FarmService {
  constructor(private readonly prisma: PrismaService) {}

  async start(userId: string, dto: StartFarmingQueryDto): Promise<void> {
    try {
      const item = await this.prisma.item.findFirst({
        where: { id: dto.itemId },
      });
      if (!item) throw new NotFoundException('Item not found');

      const userSkill = await this.prisma.userSkill.findFirst({
        where: { userId: userId },
        include: {
          skill: {
            select: {
              id: true,
              maxLevel: true,
              metadata: true,
            },
          },
        },
      });
      if (!userSkill) throw new NotFoundException('User Skill not found');

      await this.prisma.farmingLog.create({
        data: {
          userId: userId,
          itemId: dto.itemId,
          metadata: {
            // dapat apa
            // start kapan
            // claim kapan
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async claim(userId: string, farmLogId: string): Promise<void> {}
}
