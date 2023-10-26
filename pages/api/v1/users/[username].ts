/**
 * This route returns the publicly accessible information for a user.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client"
import prisma from "../../../../utils/db"

async function getUserPublicData(username: string) {
    return await prisma.user.findUniqueOrThrow({
        where: {
            username: username
        },
        select: {
            username: true,
            id: true
        }
    })
}

/**
 * The return type of the publicly accessible information.
 */
export type UserPublicData = Prisma.PromiseReturnType<typeof getUserPublicData>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(username)) {
        res.status(400).json({
            "status": "fail",
            "data": {
                "title": "Username must be a string"
            }
        })
        return
    }

    const user = await getUserPublicData(username)
        .catch((error) => {
            if (error.code === "P2025") {
                // User not found
                res.status(404).json({
                    "status": "fail",
                    "data": {
                        "title": "User not found with that username"
                    }
                })
                return
            }
        })

    res.status(200).json({
        "status": "success",
        "user": JSON.stringify(user)
    })
}