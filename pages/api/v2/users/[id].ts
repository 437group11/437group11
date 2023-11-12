/**
 * This route returns the publicly accessible information for a user.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client"
import prisma from "utils/db"
import { HttpStatusCode } from "axios"
import { isString } from "utils/api"

async function getUserPublicData(id: string) {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            image: true,
        }
    })
}

/**
 * The return type of the publicly accessible information.
 */
export type UserPublicData = Prisma.PromiseReturnType<typeof getUserPublicData>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (!isString(id)) {
        res.status(HttpStatusCode.BadRequest).json({
            "status": "fail",
            "data": {
                "title": "ID must be a string"
            }
        })
        return
    }

    const user = await getUserPublicData(id)
        .catch((error) => {
            if (error.code === "P2025") {
                // User not found
                res.status(HttpStatusCode.NotFound).json({
                    "status": "fail",
                    "data": {
                        "title": "User not found with that id"
                    }
                })
                return
            } else if ("message" in error) {
                res.status(HttpStatusCode.InternalServerError).json({
                    "status": "fail",
                    "data": {
                        "title": error.message
                    }
                })
                return
            } else {
                res.status(HttpStatusCode.InternalServerError).json({
                    "status": "fail",
                    "data": {
                        "title": "An unknown error occurred."
                    }
                })
                return
            }
        })

    res.status(HttpStatusCode.Ok).json({
        "status": "success",
        "data": {
            "user": user
        }
    })
}