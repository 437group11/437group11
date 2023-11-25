-- AlterTable
ALTER TABLE `User` ADD COLUMN `bio` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `favoriteArtists` JSON NOT NULL,
    ADD COLUMN `favoriteGenres` JSON NOT NULL;
