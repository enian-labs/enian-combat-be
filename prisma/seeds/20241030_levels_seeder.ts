// import { Level, PrismaClient } from '@prisma/client';
// import { v4 } from 'uuid';

// const prisma = new PrismaClient();

// export async function run(): Promise<void> {
//   await prisma.level.deleteMany();

//   const farmConfig = await prisma.farmConfig.findFirst();
//   const farmBenefit = await prisma.farmBenefit.findFirst();
//   const itemReward = await prisma.item.findFirst({
//     where: {
//       farmBenefitId: farmBenefit?.id,
//     },
//   });
//   if (farmConfig && farmBenefit && itemReward) {
//     let exp = 1000;
//     let minFastUpgradeExp = 200;
//     let fastUpgradePrice = 10;
//     let claimResult = 100;

//     const levels: Level[] = [];

//     Array.from({ length: 100 }, async (_, j) => {
//       const nextLevelExp = Math.round(
//         exp + exp * Number(farmConfig.expMultiplier),
//       );
//       const nextFastUpgradePrice = Math.round(
//         fastUpgradePrice +
//           fastUpgradePrice * Number(farmConfig.fastUpgradePriceMultiplier),
//       );
//       const nextMinFastUpgradeExp = Math.round(
//         minFastUpgradeExp +
//           minFastUpgradeExp * Number(farmConfig.expMultiplier),
//       );
//       const nextClaimResult = Math.round(
//         claimResult + claimResult * Number(itemReward.multiplier),
//       );

//       levels.push({
//         id: v4(),
//         farmConfigId: farmConfig.id,
//         level: j + 1,
//         exp: j === 0 ? 0 : exp,
//         minFastUpgradeExp: j === 0 ? 0 : minFastUpgradeExp,
//         fastUpgradePrice: j === 0 ? 0 : fastUpgradePrice,
//         nextLevelExp: j === 0 ? exp : nextLevelExp,
//         nextMinFastUpgradeExp:
//           j === 0 ? minFastUpgradeExp : nextMinFastUpgradeExp,
//         nextFastUpgradePrice: j === 0 ? fastUpgradePrice : nextFastUpgradePrice,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       if (j > 0) {
//         exp = nextLevelExp;
//         fastUpgradePrice = nextFastUpgradePrice;
//         minFastUpgradeExp = nextMinFastUpgradeExp;
//         claimResult = nextClaimResult;
//       }
//     });

//     await prisma.level.createMany({ data: levels });
//   }
// }
