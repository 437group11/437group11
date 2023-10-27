/**
 * This route allows searching for a user by passing the GET parameter ?username=
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client"
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'

async function searchUserPublicData(username: string) {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: username
            }
        },
        select: {
            username: true,
            dateRegistered: true
        },
        take: 10
    })
}

/**
 * The return type of the publicly accessible information.
 */
export type UserPublicDataArray = Prisma.PromiseReturnType<typeof searchUserPublicData>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(username)) {
        res.status(400).json({
            "status": "fail",
            "data": {
                "title": "Username query must be a string"
            }
        })
        return
    }

    const users = await searchUserPublicData(username)
        .catch((error) => {
            if ("message" in error) {
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
            "users": users
        }
    })
}