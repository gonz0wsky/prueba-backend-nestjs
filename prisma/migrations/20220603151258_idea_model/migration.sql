-- CreateEnum
CREATE TYPE "IdeaVisibility" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "visibility" "IdeaVisibility" NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
