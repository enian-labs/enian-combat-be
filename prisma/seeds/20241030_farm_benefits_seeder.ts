// import { FarmType, PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function run(): Promise<void> {
//   await prisma.farmBenefit.deleteMany();

//   const farmConfig = await prisma.farmConfig.findFirst();
//   if (farmConfig) {
//     await prisma.farmBenefit.create({
//       data: {
//         farmConfigId: farmConfig.id,
//         farmType: FarmType.MAIN_FARMING,
//       },
//     });
//   }
// }
