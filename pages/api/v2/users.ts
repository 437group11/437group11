/**
 * This route allows searching for a user by passing the GET parameter ?name=
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client"
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { isString } from "utils/api"

async function searchUserPublicData(name: string) {
    return await prisma.user.findMany({
        where: {
            name: {
                contains: name
            }
        },
        select: {
            id: true,
            name: true,
            image: true
        },
        take: 10
    })
}

/**
 * The return type of the publicly accessible information.
 */
export type UserPublicDataArray = Prisma.PromiseReturnType<typeof searchUserPublicData>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query

    if (!isString(name)) {
        res.status(400).json({
            "status": "fail",
            "data": {
                "title": "Name query must be a string"
            }
        })
        return
    }

    const users = await searchUserPublicData(name)
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