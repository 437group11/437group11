/*
  Warnings:

  - Added the required column `albumId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` ADD COLUMN `albumId` VARCHAR(191) NOT NULL;
