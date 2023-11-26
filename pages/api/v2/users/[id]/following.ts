/**
 * This route allows accessing and changing the users a user is following.
 * Supported methods:
 * - GET
 * - PATCH
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "utils/db"
import { HttpStatusCode } from 'axios'
import { handle, isNotFoundError, isString, jsendError, jsendFailWithMessage, jsendSuccess, methodNotAllowedError } from 'utils/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return await handle(req, res, {
        GET: handleGet,
        PATCH: handlePatch
    })
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    try {
        const following = await getFollowing(id)
        return jsendSuccess(res, HttpStatusCode.Ok, {
            following: following
        })
    } catch (error) {
        if (isNotFoundError(error)) {
            return jsendFailWithMessage(res, HttpStatusCode.NotFound, "User not found with that ID")
        } else {
            return jsendError(res, HttpStatusCode.InternalServerError, `Could not get following: ${error}`)
        }
    }
}

async function getFollowing(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
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
    })
    return user.following
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    // The data format expected is a bastardization of RFC 6902.
    // "op" must be "add" or "remove".
    // "value" is the id of the user to follow or unfollow.
    let op = req.body["op"]

    switch (op) {
        case "add":
            let userToFollowId = req.body["value"]
            try {
                await followUser(id, userToFollowId)
            } catch {
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not follow user")
            }
            return res.status(HttpStatusCode.Ok).json({
                "status": "success"
            })
        case "remove":
            let userToUnfollowId = req.body["value"]
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

    return await prisma.user.update({
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