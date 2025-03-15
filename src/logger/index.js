import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Logs a message with a specified level into the database.
 *
 * @param {string} level - The severity level of the log (e.g., 'info', 'error').
 * @param {string} message - The message to be logged.
 * @returns {Promise<void>} - A promise that resolves when the log is successfully created.
 */

async function Logger(level, message) {
  await prisma.log.create({
    data: {
      level: level,
      message: message,
    },
  });
}

export default Logger;