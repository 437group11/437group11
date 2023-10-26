/**
* The app should only create one instance of PrismaClient.
* See https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/instantiate-prisma-client#the-number-of-prismaclient-instances-matters
* 
* This file allows for the use of a singleton.
* https://github.com/prisma/prisma/discussions/10037
* 
* It should only be used server-side.
*/
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
};
if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
}
prisma = globalWithPrisma.prisma;

export default prisma;