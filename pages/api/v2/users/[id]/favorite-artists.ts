/**
 * Get or update a user's favorite artists.
 * Supported routes:
 * GET
 * POST
 * - Expects in the body "op", which must be "add" or "remove",
 *   and "value", which is the artist to add or remove.
 */
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { ErrorWithStatusCode, ForbiddenError, Result, UnauthorizedError, handle, isNotFoundError, jsendError, jsendFailWithData, jsendFailWithMessage, jsendSuccess } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return await handle(req, res, {
        GET: get,
        PATCH: patch
    })
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }
    try {
        const favoriteArtists = await getFavoriteArtists(id)
        return jsendSuccess(res, HttpStatusCode.Ok, {
            favoriteArtists: favoriteArtists
        })
    } catch (error) {
        if (isNotFoundError(error)) {
            return jsendFailWithMessage(res, HttpStatusCode.NotFound, 
                "User not found with that ID"
            )
        }
        return jsendFailWithMessage(res, HttpStatusCode.InternalServerError,
            "Could not get favorite artists from database"
        )
    }
}

async function getFavoriteArtists(userId: string): Promise<[string]> {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })
    return user.favoriteArtists as [string] ?? []
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        const error = new UnauthorizedError()
        return jsendFailWithData(res, error.statusCode, error.message)
    }
    if (session.user.id !== id) {
        const error = new UnauthorizedError()
        return jsendFailWithData(res, error.statusCode, error.message)
    }

    try {
        const { op, value } = req.body
        switch (op) {
            case "add":
                let artistsAfterAdd = await addFavoriteArtist(id, value)
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    favoriteArtists: artistsAfterAdd
                })
            case "remove":
                let artistsAfterRemove = await removeFavoriteArtist(id, value)
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    favoriteArtists: artistsAfterRemove
                })
            default:
                return jsendFailWithData(res, HttpStatusCode.BadRequest, {
                    op: "op must be `add` or `remove"
                }) 
        }
    } catch (error) {
        return jsendError(res, HttpStatusCode.InternalServerError,
            `Error occurred when modifying favorite artists: ${error}`
        )
    }
}

async function addFavoriteArtist(userId: string, artistToAdd: string) {
    const artists = await getFavoriteArtists(userId)

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            favoriteArtists: [...artists, artistToAdd]
        }
    })
    return user.favoriteArtists
}

async function removeFavoriteArtist(userId: string, artistToRemove: string) {
    const artists = await getFavoriteArtists(userId)
    
    const updatedArtists = artists.filter((artist) => artist !== artistToRemove)

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            favoriteArtists: updatedArtists
        }
    })
    return user.favoriteArtists
}
