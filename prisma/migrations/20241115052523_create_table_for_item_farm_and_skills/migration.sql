/*
  Warnings:

  - You are about to drop the column `missionId` on the `completed_missions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `completed_missions` table. All the data in the column will be lost.
  - Added the required column `mission_id` to the `completed_missions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `completed_missions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('RESOURCE');

-- CreateEnum
CREATE TYPE "FarmType" AS ENUM ('MAIN_FARMING');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('FARMING');

-- DropForeignKey
ALTER TABLE "completed_missions" DROP CONSTRAINT "completed_missions_missionId_fkey";

-- DropForeignKey
ALTER TABLE "completed_missions" DROP CONSTRAINT "completed_missions_userId_fkey";

-- AlterTable
ALTER TABLE "completed_missions" DROP COLUMN "missionId",
DROP COLUMN "userId",
ADD COLUMN     "mission_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "SkillType" NOT NULL DEFAULT 'FARMING',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxLevel" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ItemType" NOT NULL DEFAULT 'RESOURCE',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB NOT NULL,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "FarmType" NOT NULL DEFAULT 'MAIN_FARMING',
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "FarmType" NOT NULL DEFAULT 'MAIN_FARMING',
    "farm_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_by" TEXT NOT NULL DEFAULT 'system',
    "updated_by" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "farm_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "completed_missions" ADD CONSTRAINT "completed_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_missions" ADD CONSTRAINT "completed_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_logs" ADD CONSTRAINT "farm_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_logs" ADD CONSTRAINT "farm_logs_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_logs" ADD CONSTRAINT "farm_logs_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
