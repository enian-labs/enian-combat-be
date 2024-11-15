-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('ONBOARDING', 'RECURSIVE', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "SocialTask" AS ENUM ('NORMAL', 'REQUIRED');

-- CreateTable
CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "telegram_id" TEXT,
  "ton_address" TEXT,
  "evm_address" TEXT,
  "gold" INTEGER NOT NULL DEFAULT 0,
  "gem" INTEGER NOT NULL DEFAULT 0,
  "finish_onboarding" BOOLEAN NOT NULL DEFAULT false,
  "created_by" TEXT,
  "updated_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "MissionType" NOT NULL DEFAULT 'ONE_TIME',
  "social_task" "SocialTask" NOT NULL DEFAULT 'NORMAL',
  "title" TEXT NOT NULL,
  "image" TEXT,
  "gold" INTEGER NOT NULL,
  "cooldown" INTEGER NOT NULL,
  "created_by" TEXT NOT NULL DEFAULT 'system',
  "updated_by" TEXT NOT NULL DEFAULT 'system',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  "url" TEXT,
  CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_missions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "missionId" UUID NOT NULL,
  "gold" INTEGER NOT NULL,
  "created_by" TEXT NOT NULL DEFAULT 'system',
  "updated_by" TEXT NOT NULL DEFAULT 'system',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "completed_missions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_ton_address_key" ON "users"("ton_address");

-- CreateIndex
CREATE UNIQUE INDEX "users_evm_address_key" ON "users"("evm_address");

-- AddForeignKey
ALTER TABLE
  "completed_missions"
ADD
  CONSTRAINT "completed_missions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "completed_missions"
ADD
  CONSTRAINT "completed_missions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;