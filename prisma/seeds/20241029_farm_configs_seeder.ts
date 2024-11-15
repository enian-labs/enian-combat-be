import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  await prisma.farmConfig.deleteMany();
  await prisma.farmConfig.create({
    data: {
      expMultiplier: 0.03,
      minExpFastUpgradeMultiplier: 0.2,
      fastUpgradePriceMultiplier: 0.1,
    },
  });
}
