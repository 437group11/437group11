import { PrismaClient, Review } from "@prisma/client";
import { requestAlbum } from "./request-album";
import { Album } from "types/Album";
import { getUserId } from "utils/userIdManager";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId: number = 1;
    const reviews: Review[] = await prisma.review.findMany({where: {authorId: userId}})
    console.log(userId);
    if (!reviews){
        console.error('Bad response');
        res.status(500).json({ message: 'Bad Server'});
    }
    res.status(200).json({message: 'Success', userId, reviews});
}