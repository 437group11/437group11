/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `authorUsername` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorUsername` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_authorId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `authorId`,
    ADD COLUMN `authorUsername` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `authorId`,
    ADD COLUMN `authorUsername` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`username`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorUsername_fkey` FOREIGN KEY (`authorUsername`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_authorUsername_fkey` FOREIGN KEY (`authorUsername`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
