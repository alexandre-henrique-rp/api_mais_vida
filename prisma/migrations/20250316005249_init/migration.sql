/*
  Warnings:

  - You are about to drop the column `id_payment` on the `Payment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valor" REAL NOT NULL DEFAULT 0,
    "pix_id" INTEGER,
    "notification_url" TEXT,
    "qr_code" TEXT,
    "qr_code_base64" TEXT,
    "link_payment" TEXT,
    "status" TEXT,
    "status_detail" TEXT,
    "pg" BOOLEAN NOT NULL DEFAULT false,
    "client_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("client_id", "createdAt", "id", "link_payment", "notification_url", "pg", "pix_id", "qr_code_base64", "status", "status_detail", "updatedAt", "valor") SELECT "client_id", "createdAt", "id", "link_payment", "notification_url", "pg", "pix_id", "qr_code_base64", "status", "status_detail", "updatedAt", "valor" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
