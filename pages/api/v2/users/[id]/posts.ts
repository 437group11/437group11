/**
 * This route allows accessing a user's posts and creating new posts.
 * Supported methods:
 * - GET
 * - POST (must be logged in as the user)
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { jsendError } from 'utils/jsend'
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "pages/api/auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(id)) {
        return res.status(HttpStatusCode.BadRequest).json({
            "status": "fail",
            "data": {
                "title": "ID must be a string"
            }
        })
    }

    switch (req.method) {
        case "GET":
            try {
                let posts = await getPosts(req, res, id)
                return res.status(HttpStatusCode.Ok).json({
                    "status": "success",
                    "data": {
                        "posts": posts
                    }
                })
            } catch (error) {
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not get posts: ${error}`)
            }
        case "POST":
            try {
                return createPost(req, res, id)
            } catch (error) {
                if (error instanceof ForbiddenError) {
                    return res.status(HttpStatusCode.Forbidden).json({
                        "status": "fail",
                        "data": {
                            "message": `Could not create post: ${error}`
                        }
                    })
                }
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not create post: ${error}`)
            }
        default:
            return res.status(HttpStatusCode.MethodNotAllowed)
                .setHeader("Allow", "GET, POST")
                .json({
                    "status": "fail",
                    "data": {
                        "title": "This route only supports GET and POST"
                    }
                })
    }
}

async function getPosts(req: NextApiRequest, res: NextApiResponse, id: string) {
    return prisma.post.findMany({
        where: {
            authorId: id
        }
    })
}

/**
 * An error that corresponds to HTTP Forbidden.
 */
class ForbiddenError extends Error {
    // https://stackoverflow.com/a/41429145
    constructor() {
        super("You don't have permission to perform that action")
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}

async function createPost(req: NextApiRequest, res: NextApiResponse, id: string) {
    let session = await getServerSession(req, res, authOptions)
    if (session.user.id !== id) {
        // https://stackoverflow.com/a/42453705/
        throw new ForbiddenError()
    }

    return prisma.post.create({
        data: {
            content: req.body.content,
            authorId: id,
        }
    })
}