/*
  Warnings:

  - You are about to drop the column `image` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `datePublished` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `image`,
    ADD COLUMN `datePublished` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Album` (
    `spotifyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `genres` JSON NOT NULL,
    `artists` JSON NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`spotifyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`spotifyId`) ON DELETE RESTRICT ON UPDATE CASCADE;
