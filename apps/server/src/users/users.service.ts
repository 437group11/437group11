import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaClient) {}

    async find(username: string){
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

}
