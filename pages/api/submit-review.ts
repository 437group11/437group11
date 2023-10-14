import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    console.log('got to handler');
    if (req.method === 'POST'){
        const {albumId, content, rating, authorId} = req.body;
        try {
            const review = await prisma.review.create({
                data: {
                    albumId,
                    content,
                    rating,
                    authorId,
                },
            });
            res.status(200).json({message: 'Review Submitted', review});
        } catch (error) {
            console.error('Submit failed', error);
            res.status(500).json({ message: 'Review Submit Failed' });
        }     
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}