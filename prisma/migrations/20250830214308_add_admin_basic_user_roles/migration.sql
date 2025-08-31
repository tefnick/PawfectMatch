-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BASIC_USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC_USER';
