/**
 * This route allows accessing and changing the users a user is following.
 * Supported methods:
 * - GET
 * - PATCH
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { isString, jsendError, methodNotAllowedError } from 'utils/api'

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

    switch (req.method) {
        case "GET":
            return getFollowing(req, res, id)
        case "PATCH":
            return patchFollowing(req, res, id, req.body)
        default:
            return methodNotAllowedError(res, ["GET", "PATCH"])
    }
}

function getFollowing(req: NextApiRequest, res: NextApiResponse, id: string) {
    prisma.user.findUniqueOrThrow({
        where: {
            id: id
        },
        select: {
            following: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
    }).then((user) => {
        return res.status(HttpStatusCode.Ok).json({
            "status": "success",
            "data": {
                "following": user.following
            }
        })
    }).catch((error) => {
        if (error.code === "P2025") {
            // User not found
            res.status(HttpStatusCode.NotFound).json({
                "status": "fail",
                "data": {
                    "title": "User not found with that ID"
                }
            })
            return
        } else if ("message" in error) {
            return jsendError(res, HttpStatusCode.InternalServerError, error.message)
        } else {
            return jsendError(res, HttpStatusCode.InternalServerError, "An unknown error occurred.")
        }
    })
}

async function patchFollowing(req: NextApiRequest, res: NextApiResponse, id: string, body: any) {
    // The data format expected is a bastardization of RFC 6902.
    // "op" must be "add" or "remove".
    // "value" is the id of the user to follow or unfollow.
    let op = body["op"]

    switch (op) {
        case "add":
            let userToFollowId = body["value"]
            try {
                await followUser(id, userToFollowId)
            } catch {
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not follow user")
            }
            return res.status(HttpStatusCode.Ok).json({
                "status": "success"
            })
        case "remove":
            let userToUnfollowId = body["value"]
            try {
                await unfollowUser(id, userToUnfollowId)
            } catch {
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not follow user")
            }
            return res.status(HttpStatusCode.Ok).json({
                "status": "success"
            })
        default:
            return res.status(HttpStatusCode.BadRequest).json({
                "status": "fail",
                "data": {
                    "op": "op must be add or remove"
                }
            })
    }
}

async function followUser(followerId: string, followingId: string) {
    const follower = await prisma.user.findUnique({
        where: {
            id: followerId,
        },
    });

    const following = await prisma.user.findUnique({
        where: {
            id: followingId,
        },
    });

    if (!follower || !following) {
        return Promise.reject(new Error('User not found'));
    }
    if (follower.id == following.id) {
        return Promise.reject(new Error('Cannot follow self'));
    }

    return prisma.user.update({
        where: {
            id: followerId,
        },
        data: {
            following: {
                connect: {
                    id: followingId,
                },
            },
        },
    });
}

async function unfollowUser(followerId: string, followingId: string) {
    const follower = await prisma.user.findUnique({
        where: {
            id: followerId,
        },
    });

    const following = await prisma.user.findUnique({
        where: {
            id: followingId,
        },
    });

    if (!follower || !following) {
        return Promise.reject(new Error('User not found'));
    }

    return await prisma.user.update({
        where: {
            id: followerId,
        },
        data: {
            following: {
                disconnect: {
                    id: followingId,
                },
            },
        },
    });
}