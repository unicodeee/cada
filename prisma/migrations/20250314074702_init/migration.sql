/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('Media', 'Text', 'Icon');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "avatar_photo_url" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gender" "Gender",
    "hobbies" TEXT[],
    "description" TEXT,
    "yearBorn" INTEGER,
    "sexualOrientation" TEXT,
    "photos" TEXT[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "genderPreference" TEXT,
    "minAge" INTEGER,
    "maxAge" INTEGER,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swipe" (
    "id" TEXT NOT NULL,
    "swiperId" TEXT NOT NULL,
    "swipedId" TEXT NOT NULL,
    "dateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "swipeRight" BOOLEAN NOT NULL,

    CONSTRAINT "Swipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnmatchCountdown" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnmatchCountdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "MessageType" NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolEvent" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "photo_url" TEXT,

    CONSTRAINT "SchoolEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStudySession" (
    "userId" TEXT NOT NULL,
    "studySessionId" TEXT NOT NULL,

    CONSTRAINT "UserStudySession_pkey" PRIMARY KEY ("userId","studySessionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_swiperId_swipedId_key" ON "Swipe"("swiperId", "swipedId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_user1Id_user2Id_key" ON "Match"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "UnmatchCountdown_matchId_key" ON "UnmatchCountdown"("matchId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_swiperId_fkey" FOREIGN KEY ("swiperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_swipedId_fkey" FOREIGN KEY ("swipedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnmatchCountdown" ADD CONSTRAINT "UnmatchCountdown_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudySession" ADD CONSTRAINT "UserStudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudySession" ADD CONSTRAINT "UserStudySession_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
