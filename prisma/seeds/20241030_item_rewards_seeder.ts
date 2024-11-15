// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function run(): Promise<void> {
//   await prisma.item.deleteMany();

//   const farmBenefit = await prisma.farmBenefit.findFirst();
//   if (farmBenefit) {
//     await prisma.item.create({
//       data: {
//         name: 'wood',
//         farmBenefitId: farmBenefit.id,
//         multiplier: 0.08,
//       },
//     });
//   }
// }
