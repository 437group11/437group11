/**
 * This route allows accessing a user's posts and creating new posts.
 * Supported methods:
 * - GET
 * - POST (must be logged in as the user)
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { jsendError, methodNotAllowedError } from 'utils/api'
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
                let result = await createPost(req, res, id)
                return res.status(HttpStatusCode.Created).json({
                    "status": "success",
                    "data": {
                        "post": result
                    }
                })
            } catch (error) {
                if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                    return res.status(error.statusCode).json({
                        "status": "fail",
                        "message": `Could not create post: ${error}`
                    })
                }
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not create post: ${error}`)
            }
        default:
            return methodNotAllowedError(res, ["GET", "POST"])
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

    statusCode = HttpStatusCode.Forbidden
}

/**
 * An error that corresponds to HTTP Unauthorized.
 */
class UnauthorizedError extends Error {
    // https://stackoverflow.com/a/41429145
    constructor() {
        super("You must be signed in")
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }

    statusCode = HttpStatusCode.Unauthorized
}

async function createPost(req: NextApiRequest, res: NextApiResponse, id: string) {
    let session = await getServerSession(req, res, authOptions)
    if (!session) {
        throw new UnauthorizedError()
    }
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