/*
  Warnings:

  - You are about to alter the column `source` on the `message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `message` MODIFY `source` ENUM('telegram', 'instagram', 'eitaa', 'whatsapp') NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('pending', 'completed', 'canceled') NULL;
