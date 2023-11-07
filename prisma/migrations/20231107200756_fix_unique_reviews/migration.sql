/*
  Warnings:

  - A unique constraint covering the columns `[albumId,authorId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Review_albumId_authorId_key` ON `Review`(`albumId`, `authorId`);
