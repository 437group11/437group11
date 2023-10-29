/**
 * This route allows accessing and changing the users a user is following.
 * Supported methods:
 * - GET
 * - PATCH
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Album } from "@prisma/client"
import prisma from "utils/db"
import axios, { HttpStatusCode } from 'axios'
import { getToken } from "utils/tokenManager"
import { jsendError } from 'utils/jsend'
import { requestAccessToken } from "../../../request-token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(username)) {
        res.status(HttpStatusCode.BadRequest).json({
            "status": "fail",
            "data": {
                "title": "Username must be a string"
            }
        })
        return
    }

    switch (req.method) {
        case "GET":
            return getFollowing(req, res, username)
        case "PATCH":
            return patchFollowing(req, res, username, req.body)
        default:
            res.status(HttpStatusCode.MethodNotAllowed).json({
                "status": "fail",
                "data": {
                    "title": "This route only supports GET and PATCH"
                }
            })
            return
    }
}

function getFollowing(req: NextApiRequest, res: NextApiResponse, username: string) {
    prisma.user.findUniqueOrThrow({
        where: {
            username: username
        },
        select: {
            following: {
                select: {
                    username: true
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
                    "title": "User not found with that username"
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

async function patchFollowing(req: NextApiRequest, res: NextApiResponse, username: string, body: any) {
    // The data format expected is a bastardization of RFC 6902.
    // "op" must be "add" or "remove".
    // "value" is the username to follow or unfollow.
    let op = body["op"]

    switch (op) {
        case "add":
            let userToFollow = body["value"]
            try {
                await followUser(username, userToFollow)
            } catch {
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not follow user")
            }
            return res.status(HttpStatusCode.Ok).json({
                "status": "success"
            })
        case "remove":
            let userToUnfollow = body["value"]
            try {
                await unfollowUser(username, userToUnfollow)
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

async function followUser(followerUsername: string, followingUsername: string) {
    const follower = await prisma.user.findUnique({
        where: {
            username: followerUsername,
        },
    });

    const following = await prisma.user.findUnique({
        where: {
            username: followingUsername,
        },
    });

    if (!follower || !following) {
        return Promise.reject(new Error('User not found'));
    }
    if (follower.username == following.username) {
        return Promise.reject(new Error('Cannot follow self'));
    }

    return prisma.user.update({
        where: {
            username: followerUsername,
        },
        data: {
            following: {
                connect: {
                    username: followingUsername,
                },
            },
        },
    });
}

async function unfollowUser(followerUsername: string, followingUsername: string) {
    const follower = await prisma.user.findUnique({
        where: {
            username: followerUsername,
        },
    });

    const following = await prisma.user.findUnique({
        where: {
            username: followingUsername,
        },
    });

    if (!follower || !following) {
        return Promise.reject(new Error('User not found'));
    }

    return await prisma.user.update({
        where: {
            username: followerUsername,
        },
        data: {
            following: {
                disconnect: {
                    username: followingUsername,
                },
            },
        },
    });
}