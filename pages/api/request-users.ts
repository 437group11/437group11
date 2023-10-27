import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method = 'POST'){
        const input = req.body;
        try {
            const users : User[] = await prisma.user.findMany({
                where: {
                    username: {
                        contains: input,
                    },
                },
                take: 10,
            });
            if (!users){
                console.error('No Users Found');
                res.status(401).json({ message: 'No Users Found' });
            }
            console.log(users);
            res.status(200).json({message: 'Success', users});
        } catch (error) {
            console.error("Error");
            res.status(403).json({message: "User not found"});
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}