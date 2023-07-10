import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

export const prisma =
  global.prisma ||
  new PrismaClient()

global.prisma = prisma