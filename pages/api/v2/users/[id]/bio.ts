/**
 * Endpoints for a user's bio.
 * Supported endpoints:
 * GET
 * PUT
 * - Takes the new bio as plain text. If successful, returns the new bio in JSON.
 */

import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { ErrorWithStatusCode, ForbiddenError, UnauthorizedError, handle, isNotFoundError, jsendError, jsendFailWithData, jsendFailWithMessage, jsendSuccess } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return await handle(req, res, {
        GET: handleGet,
        PUT: handlePut
    })
}

export async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    try {
        const bio = await getBio(id)
        return jsendSuccess(res, HttpStatusCode.Ok, {
            bio: bio
        })
    } catch (error) {
        if (isNotFoundError(error)) {
            return jsendFailWithMessage(res, HttpStatusCode.NotFound, "User not found for that ID")
        }
        return jsendError(res, HttpStatusCode.InternalServerError, "Could not get bio from database")
    }
}

async function getBio(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        select: {
            bio: true
        }
    })

    return user.bio
}

export async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    const session = await getServerSession(req, res, authOptions)
    let error: ErrorWithStatusCode | undefined
    if (!session) {
        error = new UnauthorizedError()
    } else if (session.user.id !== id) {
        error = new ForbiddenError()
    }
    if (error) {
        return jsendFailWithMessage(res, error.statusCode, error.message)
    }

    const bio = req.body
    try {
        const newBio = await updateBio(id, bio)
        return jsendSuccess(res, HttpStatusCode.Ok, {
            bio: newBio
        })
    } catch (error) {
        if (isNotFoundError(error)) {
            return jsendFailWithMessage(res, HttpStatusCode.NotFound, "User not found for that ID")
        }
        return jsendError(res, HttpStatusCode.InternalServerError, "Could not update bio in database")
    }
}

async function updateBio(userId: string, bio: string) {
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            bio: bio
        },
        select: {
            bio: true
        }
    })

    return user.bio
}