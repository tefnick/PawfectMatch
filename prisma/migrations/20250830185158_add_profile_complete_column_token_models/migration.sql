-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "type" "TokenType" NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_email_token_key" ON "Token"("email", "token");
