/*
  Warnings:

  - Made the column `rating` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Review` MODIFY `rating` INTEGER NOT NULL;
