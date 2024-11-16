import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  await prisma.mission.deleteMany();
  await prisma.mission.createMany({
    data: [
      {
        type: 'ONBOARDING',
        title: 'Subscribe our Telegram Channel',
        url: 'https://t.me/enian',
        image: faker.image.urlPlaceholder(),
        socialTask: 'REQUIRED',
        cooldown: 0,
        gold: 500,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'ONBOARDING',
        title: 'Follow our Twitter Account',
        url: 'https://x.com/enian',
        image: faker.image.urlPlaceholder(),
        socialTask: 'NORMAL',
        cooldown: 0,
        gold: 500,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'ONBOARDING',
        title: 'Subscribe our YouTube Channel',
        url: 'https://www.youtube.com/enian',
        image: faker.image.urlPlaceholder(),
        socialTask: 'NORMAL',
        cooldown: 0,
        gold: 500,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'RECURSIVE',
        title: 'Daily Login',
        cooldown: 24 * 60 * 60,
        gold: 100,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'RECURSIVE',
        title: 'Spin Roulette',
        cooldown: 8 * 60 * 60,
        gold: 100,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'RECURSIVE',
        title: 'Daily Puzzle Game',
        cooldown: 8 * 60 * 60,
        gold: 100,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'ONE_TIME',
        title: "Follow our CEO's Twitter",
        url: 'https://x.com/enian_ceo',
        image: faker.image.urlPlaceholder(),
        socialTask: 'NORMAL',
        cooldown: 0,
        gold: 250,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
      {
        type: 'ONE_TIME',
        title: "Follow our CTO's Twitter",
        url: 'https://x.com/enian_cto',
        image: faker.image.urlPlaceholder(),
        socialTask: 'NORMAL',
        cooldown: 0,
        gold: 250,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      },
    ],
  });

  const missionOnBoarding = await prisma.mission.findFirst({
    where: { type: 'ONBOARDING' },
  });
  const missionRecursive = await prisma.mission.findFirst({
    where: { type: 'RECURSIVE' },
  });
  const missionOneTime = await prisma.mission.findFirst({
    where: { type: 'ONE_TIME' },
  });

  let completedMissions = [];
  const users = await prisma.user.findMany();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    completedMissions.push({
      userId: user.id,
      missionId: missionOnBoarding!.id,
      gold: missionOnBoarding!.gold,
    });
    completedMissions.push({
      userId: user.id,
      missionId: missionRecursive!.id,
      gold: missionRecursive!.gold,
    });
    completedMissions.push({
      userId: user.id,
      missionId: missionOneTime!.id,
      gold: missionOneTime!.gold,
    });
  }

  await prisma.completedMission.createMany({
    data: completedMissions,
  });
}
