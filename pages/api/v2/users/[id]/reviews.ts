/**
 * This route returns the reviews for a user.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client"
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { isString } from "utils/api"

async function getUserReviews(id: string) {
    return await prisma.review.findMany({
        where: {
            authorId: id
        },
        include: {
            album: true
        }
    })
}

/**
 * The return type of the reviews.
 */
export type UserReviews = Prisma.PromiseReturnType<typeof getUserReviews>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    const reviews = await getUserReviews(id)
        .catch((error) => {
            if (error.code === "P2025") {
                // User not found
                res.status(HttpStatusCode.NotFound).json({
                    "status": "fail",
                    "data": {
                        "title": "User not found with that ID"
                    }
                })
                return
            }
        })

    res.status(HttpStatusCode.Ok).json({
        "status": "success",
        "data": {
            "reviews": reviews
        }
    })
}